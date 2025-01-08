import { ConflictException, Injectable } from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/core/prisma/prisma.service'

import { CreateUserInput } from './inputs/create-user.input'

@Injectable()
export class AccountService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll() {
		return this.prismaService.user.findMany()
	}

	async create(input: CreateUserInput) {
		const { username, email, password, displayName } = input

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUsernameExists)
			throw new ConflictException('Это имя пользователя уже занято')

		const isEmailExisting = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (isEmailExisting) throw new ConflictException('Эта почта уже занята')

		await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName
			}
		})

		return true
	}
}
