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

const fs = require('fs');
const path = require('path');

export default class Api {
    static dataPath = RootDir.combine('data.json')

    static data: Data = new Data();

    static register () {
        if (fs.existsSync(Api.dataPath)) {
            const rawdata = fs.readFileSync(Api.dataPath);
            Api.data = JSON.parse(rawdata);
        }

        ipcMain.handle(IpcChannel.getData, async (event) => {
            return Api.data
        })

        ipcMain.handle(IpcChannel.createLink, async (event, categoryId: string, link: Link) => {
            const category = Api.data.categories.find(category => category.name === categoryId)
            if (category) {
                link.id = uuidv4()
                category.links.push(link)
            }
            fs.writeFileSync(Api.dataPath, JSON.stringify(Api.data, null, 2));
            return Api.data
        })

        ipcMain.handle('create-category', async (event, categoryCreate: CategoryCreate) => {
            const category = new Category()
            category.name = categoryCreate.name
            category.id = uuidv4()
            Api.data.categories.push(category)
            fs.writeFileSync(Api.dataPath, JSON.stringify(Api.data, null, 2));
            return Api.data
        })

        ipcMain.handle('edit-link', async (event, link: LinkEdit) => {
            const linkId = link.id
            const category = Api.data.categories.find(category => category.links.find(link => link.id === linkId))
            if (category) {
                const categoryLink = category.links.find(link => link.id === linkId)
                if (categoryLink) {
                    categoryLink.name = link.name
                    categoryLink.url = link.url
                }
            }
            fs.writeFileSync(Api.dataPath, JSON.stringify(Api.data, null, 2));
            return Api.data
        })

        ipcMain.handle('edit-category', async (event, categoryEdit: CategoryEdit) => {
            const category = Api.data.categories.find(category => category.id === categoryEdit.id)
            if (category) {
                category.name = categoryEdit.name
            }
            fs.writeFileSync(Api.dataPath, JSON.stringify(Api.data, null, 2));
            return Api.data
        })
    }
}
