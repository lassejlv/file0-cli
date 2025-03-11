import consola from 'consola'
import ky from 'ky'
import { DeleteToken, GetToken, SetToken } from './config'
import type { BunFile } from 'bun'
import ora from 'ora'
import clipboard from 'clipboardy'
import chalk from 'chalk'
import Table from 'cli-table3'
import { filesize } from 'filesize'

const API_ENDPOINT = 'https://file0.io'

interface File {
	id: string
	userId: string
	fileName: string
	fileSize: number
	fileRegion: string
	createdAt: string
}

const api = ky.create({
	hooks: {
		afterResponse: [
			async (_request, _options, response) => {
				if (!response.ok) {
					const json = (await response.json()) as { error: string; message: string }
					throw new Error(json.error || json.message || 'An unknown error occurred')
				}
			}
		]
	}
})

export const Login = async (email: string, password: string) => {
	try {
		const response = await api
			.post(`${API_ENDPOINT}/api/auth/login`, {
				json: {
					email,
					password
				}
			})
			.json<{ data: { token: string } }>()

		const token = response.data.token
		await SetToken(token)
		consola.success(`Logged in as ${email}`)
	} catch (error) {
		consola.error(error)
	}
}

export const Me = async () => {
	try {
		const token = await GetToken()
		const response = await api
			.get(`${API_ENDPOINT}/api/auth/me`, {
				headers: {
					Cookie: `session=${token}`
				}
			})
			.json<{ email: string }>()
		consola.info(`Logged in as ${response.email}`)
	} catch (error) {
		consola.error(error)
	}
}

export const Logout = async () => {
	try {
		const sure = confirm('Are you sure you want to logout?')
		if (!sure) return
		const token = await GetToken()
		await api.delete(`${API_ENDPOINT}/api/auth/logout`, {
			headers: {
				Cookie: `session=${token}`
			}
		})

		await DeleteToken()
		consola.success('Logged out')
	} catch (error) {
		consola.error(error)
	}
}

export const Upload = async (file: BunFile) => {
	try {
		const token = await GetToken()
		const start = ora(`Uploading ${file.name}...`).start()
		const formData = new FormData()
		formData.append('file', file)
		const response = await api.post(`${API_ENDPOINT}/upload`, {
			headers: {
				Cookie: `session=${token}`
			},
			body: formData
		})

		const { url, time } = await response.json<{ url: string; time: string }>()
		await clipboard.write(url)
		start.succeed(`Uploaded ${file.name} in ${time} and copied url to clipboard!`)
	} catch (error) {
		consola.error(error)
	}
}

export const GetUsage = async () => {
	try {
		const token = await GetToken()
		const response = await api
			.get(`${API_ENDPOINT}/api/files/total-storage-size`, {
				headers: {
					Cookie: `session=${token}`
				}
			})
			.json<{ pretty: string; procentageUsed: string }>()

		consola.info(`Storage usage: ${response.pretty} (${response.procentageUsed}%)`)
	} catch (error) {
		consola.error(error)
	}
}

export const GetFiles = async () => {
	const spinner = ora('Fetching files...').start()

	try {
		const token = await GetToken()
		const response = await api
			.get(`${API_ENDPOINT}/api/files`, {
				headers: {
					Cookie: `session=${token}`
				}
			})
			.json<File[]>()

		spinner.succeed('Files fetched successfully')

		// Create a pretty table for the files
		const table = new Table({
			head: [chalk.cyan('Name'), chalk.cyan('Size'), chalk.cyan('Region'), chalk.cyan('Created At')],
			colWidths: [40, 15, 12, 25]
		})

		response.forEach((file) => {
			const name = file.fileName.split('/').pop() || file.fileName
			table.push([
				chalk.white(name),
				chalk.yellow(filesize(file.fileSize)),
				chalk.green(file.fileRegion),
				chalk.blue(file.createdAt)
			])
		})

		console.log(table.toString())
	} catch (error) {
		spinner.fail('Failed to fetch files')
		console.error(chalk.red('Error:'), error)
	}
}
