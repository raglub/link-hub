import Data from '@/models/data';
import Link from '@/models/link';
import { IpcChannel } from './ipc-channel';

export type IpcCommands = {
    fetchData: () => Promise<Data>;
    createLink: (categoryId: string, link: Link) => Promise<Data>
    [IpcChannel.deleteCategory]: (categoryId: string) => Promise<void>
};