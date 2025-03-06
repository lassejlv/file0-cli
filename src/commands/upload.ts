import { Upload } from '@/api'
import consola from 'consola'

export const UploadCommand = async () => {
	const path = process.argv[3]

	if (!path) {
		return consola.warn('Path is required')
	}

	const file = Bun.file(path)

	if (!file.exists) {
		consola.warn('File does not exist')
		process.exit(1)
	}

	await Upload(file)
}
