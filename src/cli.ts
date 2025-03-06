import consola from 'consola'
import { LoginCommand } from './commands/login'
import { GetFiles, GetUsage, Logout, Me } from './api'
import { UploadCommand } from './commands/upload'

const command = process.argv[2]

switch (command) {
	case 'login':
		LoginCommand()
		break
	case 'whoami':
		Me()
		break
	case 'logout':
		Logout()
		break
	case 'upload':
		UploadCommand()
		break
	case 'usage':
		GetUsage()
		break
	case 'files':
		GetFiles()
		break
	default:
		consola.error(`Unknown command: ${command}`)
		break
}
