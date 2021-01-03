import { TypedIpcRenderer } from 'electron-typed-ipc'
import { IpcEvents } from './ipc-events'
import { IpcCommands } from './ipc-commands'
const { ipcRenderer } = window.require('electron')

export default ipcRenderer as TypedIpcRenderer<IpcEvents, IpcCommands>
