import { Login } from '@/api'
import consola from 'consola'

export const LoginCommand = async () => {
	const email = prompt('Email: ')
	const password = prompt('Password: ')

	if (!email || !password) {
		return consola.warn('Email and password are required')
	}

	await Login(email, password)
}
