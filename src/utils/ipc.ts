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

const fs = require('fs');
const path = require('path');
const packageExtract = require('../../package.json') as PackageExctract

const typedIpcMain = ipcMain as TypedIpcMain<IpcEvents, IpcCommands>;

export default class Ipc {
    static dataPath = RootDir.combine('data.json')

    static data: Data = new Data();

    static register () {
        if (fs.existsSync(Ipc.dataPath)) {
            const rawdata = fs.readFileSync(Ipc.dataPath);
            Ipc.data = JSON.parse(rawdata);
        }

        typedIpcMain.handle(IpcChannel.fetchData, async (event) => {
            return Ipc.data
        })

        typedIpcMain.handle(IpcChannel.fetchPackage, async (event) => {
            return packageExtract
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

        ipcMain.handle('create-category', async (event, categoryCreate: CategoryCreate) => {
            const category = new Category()
            category.name = categoryCreate.name
            category.id = uuidv4()
            Ipc.data.categories.push(category)
            fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
            return Ipc.data
        })

        ipcMain.handle('edit-link', async (event, link: LinkEdit) => {
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

        ipcMain.handle('edit-category', async (event, categoryEdit: CategoryEdit) => {
            const category = Ipc.data.categories.find(category => category.id === categoryEdit.id)
            if (category) {
                category.name = categoryEdit.name
            }
            fs.writeFileSync(Ipc.dataPath, JSON.stringify(Ipc.data, null, 2));
            return Ipc.data
        })
    }
}
