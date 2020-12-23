import { app } from 'electron'

export default class RootDir {
    static combine (subPath: string): string {
		let appPath = ''
		if (process.env.PORTABLE_EXECUTABLE_DIR != undefined) {
			appPath = process.env.PORTABLE_EXECUTABLE_DIR
		} else {
			appPath = app.getAppPath()
			if (appPath.indexOf('app.asar') > -1) {
				appPath = app.getPath('userData')
			}
		}
		return `${appPath}/${subPath}`
	}
}
