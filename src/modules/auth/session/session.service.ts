import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { verify } from 'argon2'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaService } from 'src/core/prisma/prisma.service'

import { LoginInput } from './inputs/login.input'

@Injectable()
export class SessionService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configSerivce: ConfigService
	) {}

	async login(req: FastifyRequest, input: LoginInput) {
		const { email, password } = input

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (!user) throw new NotFoundException('Неверная почта')

		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) throw new BadRequestException('Неверный пароль')

		return new Promise((resolve, reject) => {
			req.session.createdAt = new Date()
			req.session.userId = user.id

			req.session.save(err => {
				if (err)
					return reject(
						new InternalServerErrorException(
							`Ошибка при сохранении сессии: ${err}`
						)
					)

				resolve(user)
			})
		})
	}

	async logout(req: FastifyRequest) {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err)
					return reject(
						new InternalServerErrorException(
							`Ошибка при завершении сессии: ${err}`
						)
					)

				resolve(true)
			})
		})
	}
}
