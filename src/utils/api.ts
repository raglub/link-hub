import Data from '@/models/data';
import RootDir from './root-dir';
import { ipcMain } from 'electron';
import Link from '@/models/link'
import Category from '@/models/category'
import { v4 as uuidv4 } from 'uuid';

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

        ipcMain.handle('get-data', async (event, ...args) => {
            return Api.data
        })

        ipcMain.handle('create-link', async (event, categoryId: string, link: Link) => {
            const category = Api.data.categories.find(category => category.name === categoryId)
            if (category) {
                link.id = uuidv4()
                category.links.push(link)
            }
            fs.writeFileSync(Api.dataPath, JSON.stringify(Api.data, null, 2));
            return Api.data
        })
    }
}
