import Data from '@/models/data';
import RootDir from './root-dir';
import { ipcMain } from 'electron';
import Link from '@/models/link'
import Category from '@/models/category'
import { v4 as uuidv4 } from 'uuid';
import LinkEdit from '@/models/link-edit';
import CategoryCreate from '@/models/category-create';
import CategoryEdit from '@/models/category-edit';
import { IpcChannel } from './ipc-channel';
import { TypedIpcMain, TypedIpcRenderer, TypedWebContents } from 'electron-typed-ipc';
import { IpcCommands } from './ipc-commands';
import { IpcEvents } from './ipc-events';
import PackageExctract from '@/models/package-exctract';
import SettingsModel from '@/models/settingsModel';
import settings from 'electron-settings';
import IpcResponse from './ipc-response';

const { shell } = require('electron')
const fs = require('fs');
const path = require('path');
const packageExtract = require('../../package.json') as PackageExctract

const typedIpcMain = ipcMain as TypedIpcMain<IpcEvents, IpcCommands>;

export default class Ipc {
	static dataPath = ''

	static data: Data = new Data();

	static async loadData () {
		const dataPath = await settings.get('dataPath')
		if (dataPath) {
			Ipc.dataPath = dataPath.toString()
		} else {
			Ipc.dataPath = RootDir.combine('data.json')
			settings.set('dataPath', this.dataPath)
		}
		if (fs.existsSync(Ipc.dataPath)) {
			const rawdata = fs.readFileSync(Ipc.dataPath);
			Ipc.data = JSON.parse(rawdata);
		} else {
			Ipc.data = new Data()
		}
	}

	static async register () {
		await this.loadData()

		/*
		typedIpcMain.handle(IpcChannel.validateFileAccess, async (event, filePath: string) => {
			// Check if the file is readable.
			fs.access(filePath, fs.constants.R_OK, (err: Error) => {
				console.log(`${filePath} ${err ? 'is not readable' : 'is readable'}`);
			});
			// Check if the file is writable.
			fs.access(filePath, fs.constants.W_OK, (err: Error) => {
				console.log(`${filePath} ${err ? 'is not writable' : 'is writable'}`);
			});
		})
		*/

		typedIpcMain.handle(IpcChannel.fetchData, async (event) => {
			return Ipc.data
		})

		typedIpcMain.handle(IpcChannel.fetchPackage, async (event) => {
			return packageExtract
		})

		typedIpcMain.handle(IpcChannel.fetchSettings, async (event) => {
			const result = new SettingsModel() 
			const dataPath = await settings.get('dataPath');
			if (dataPath) {
				result.dataPath = dataPath.toString()
			}
			return result
		})

		typedIpcMain.handle(IpcChannel.updateSettings, async (event, newSettings: SettingsModel) => {
			await settings.set('dataPath', newSettings.dataPath)
  		await this.loadData()
			return newSettings
		})

		typedIpcMain.handle(IpcChannel.createLink, async (event: any, categoryId: string, link: Link) => {
			const category = Ipc.data.categories.find(category => category.id === categoryId)
			if (category) {
				link.id = uuidv4()
				category.links.push(link)
			}
			fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
			return Ipc.data
		})

		typedIpcMain.handle(IpcChannel.deleteCategory, async (event: any, categoryId: string) => {
			Ipc.data.categories = Ipc.data.categories.filter(category => category.id !== categoryId)
			fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
		})

		typedIpcMain.handle(IpcChannel.deleteLink, async (event: any, linkId: string) => {
			const response = new IpcResponse<boolean>()
			response.response = false
			try {
				const category = Ipc.data.categories.find(category => category.links.find(link => link.id === linkId))
				if (category) {
					category.links = category.links.filter(link => link.id !== linkId)
					fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
					response.response = true
				}
			} catch (err) {
				response.error = err	
			}
			return response
		})

		ipcMain.handle(IpcChannel.createCategory, async (event, categoryCreate: CategoryCreate) => {
			const category = new Category()
			category.name = categoryCreate.name
			category.id = uuidv4()
			Ipc.data.categories.push(category)
			fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
			return Ipc.data
		})

		ipcMain.handle(IpcChannel.editLink, async (event, link: LinkEdit) => {
			const linkId = link.id
			const category = Ipc.data.categories.find(category => category.links.find(link => link.id === linkId))
			if (category) {
				const categoryLink = category.links.find(link => link.id === linkId)
				if (categoryLink) {
					categoryLink.name = link.name
					categoryLink.url = link.url
				}
			}
			fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
			return Ipc.data
		})

		ipcMain.handle(IpcChannel.openUrl, async (event, url: string) => {
			shell.openExternal(url)
		})

		ipcMain.handle(IpcChannel.editCategory, async (event, categoryEdit: CategoryEdit) => {
			const category = Ipc.data.categories.find(category => category.id === categoryEdit.id)
			if (category) {
				category.name = categoryEdit.name
			}
			fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
			return Ipc.data
		})
	}
}
