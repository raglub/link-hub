import { TypedIpcRenderer } from 'electron-typed-ipc'
import { IpcEvents } from './ipc-events'
import { IpcCommands } from './ipc-commands'

export default window.ipcRenderer as TypedIpcRenderer<IpcEvents, IpcCommands>
