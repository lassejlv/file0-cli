import os from 'os'
import fs from 'fs'

export const GetLocalConfig = async (): Promise<string> => {
	const home = os.homedir()
	const configPath = `${home}/.file0`

	if (!fs.existsSync(configPath)) {
		fs.mkdirSync(configPath)
	}

	return configPath
}

export const SetToken = async (token: string): Promise<boolean> => {
	const configPath = await GetLocalConfig()
	const config = `${configPath}/token.txt`
	await Bun.write(config, token)

	return true
}

export const GetToken = async (): Promise<string> => {
	const configPath = await GetLocalConfig()
	const config = `${configPath}/token.txt`
	const token = await Bun.file(config).text()
	return token
}

export const DeleteToken = async (): Promise<boolean> => {
	const configPath = await GetLocalConfig()
	const config = `${configPath}/token.txt`
	await Bun.write(config, '')
	return true
}
