import consola from 'consola'
import { LoginCommand } from './commands/login'
import { GetFiles, GetUsage, Logout, Me } from './api'
import { UploadCommand } from './commands/upload'
import { HelpCommand } from './commands/ help'
import { GetLocalConfig } from './config'

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
  case 'show-data-dir':
    consola.info(await GetLocalConfig())
    break
  case 'help':
    HelpCommand()
    break
  default:
    HelpCommand()
    break
}
