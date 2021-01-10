import Data from '@/models/data';
import Link from '@/models/link';
import { IpcChannel } from './ipc-channel';
import PackageExctract from '@/models/package-exctract';
import SettingsModel from '@/models/settingsModel';
import LinkEdit from '@/models/link-edit';
import CategoryCreate from '@/models/category-create';
import CategoryEdit from '@/models/category-edit';
import IpcResponse from './ipc-response';

export type IpcCommands = {
    fetchData: () => Promise<Data>;
    [IpcChannel.createLink]: (categoryId: string, link: Link) => Promise<Data>
    [IpcChannel.deleteCategory]: (categoryId: string) => Promise<void>
    [IpcChannel.deleteLink]: (linkId: string) => Promise<IpcResponse<boolean>>
    [IpcChannel.fetchPackage]: () => Promise<PackageExctract>
    [IpcChannel.fetchSettings]: () => Promise<SettingsModel>
    [IpcChannel.updateSettings]: (settings: SettingsModel) => Promise<SettingsModel>
    [IpcChannel.editLink]: (response: LinkEdit) => Promise<Data>
    [IpcChannel.createCategory]: (categoryCreate: CategoryCreate) => Promise<Data>
    [IpcChannel.editCategory]: (categoryEdit: CategoryEdit) => Promise<Data>
    [IpcChannel.openUrl]: (url: string) => Promise<void>
};