export const HelpCommand = async () => {
  console.log(`
Usage: file0 <command>

Commands:
  login          Log in to file0.io
  whoami         Show your email address
  logout         Log out of file0.io
  upload         Upload a file
  usage          Show your storage usage
  files          List your files
  help           Show this help message
  show-data-dir  Shows where we store your session token
  `)
}
