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
// ddd.example1()

class IpcApi implements IpcCommands {

	async fetchData () {
		return Ipc.data
	}

	async fetchPackage () {
		return packageExtract
	}

	async fetchSettings () {
		const result = new SettingsModel() 
		const dataPath = await settings.get('dataPath');
		if (dataPath) {
			result.dataPath = dataPath.toString()
		}
		return result
	}

	async updateSettings (newSettings: SettingsModel) {
		await settings.set('dataPath', newSettings.dataPath)
		// await this.loadData()
		return newSettings
	}

	async createLink (categoryId: string, link: Link) {
		const category = Ipc.data.categories.find(category => category.id === categoryId)
		if (category) {
			link.id = uuidv4()
			category.links.push(link)
		}
		fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
		return Ipc.data
	}

	async deleteCategory (categoryId: string) {
		Ipc.data.categories = Ipc.data.categories.filter(category => category.id !== categoryId)
		fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
	}

	async deleteLink (linkId: string) {
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
	}

	async createCategory (categoryCreate: CategoryCreate) {
		const category = new Category()
		category.name = categoryCreate.name
		category.id = uuidv4()
		Ipc.data.categories.push(category)
		fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
		return Ipc.data
	}

	async editLink (link: LinkEdit) {
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
	}

	async openUrl (url: string) {
		shell.openExternal(url)
	}

	async editCategory (categoryEdit: CategoryEdit) {
		const category = Ipc.data.categories.find(category => category.id === categoryEdit.id)
		if (category) {
			category.name = categoryEdit.name
		}
		fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
		return Ipc.data
	}
}
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
		const api = new IpcApi()
		for (var apiKey in api) {
			const method = (api as any)[apiKey] 
			ipcMain.handle(apiKey, (event: any, ...args: any): any => {
				return method(...args)
			})
		}
	}
}
