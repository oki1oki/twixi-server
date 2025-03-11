import { BadRequestException, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { verify } from "argon2"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { TokenService } from "src/core/token/token.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { SessionService } from "../session/session.service"
import { DeactivateAccountInput } from "./inputs/deactivate-account.input"

@Injectable()
export class DeactivateService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService,
		private readonly tokenService: TokenService
	) {}

	async deactivate(
		req: FastifyRequest,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	) {
		const { email, password, token } = input

		if (user.email !== email) throw new BadRequestException("Неверная почта")

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) throw new BadRequestException("Неверный пароль")

		if (!token) {
			await this.sendDeactivateToken(req, user, userAgent)

			throw new BadRequestException(
				"Требуется код подтверждения, он отправлен на вашу почту"
			)
		}

		const validToken = await this.tokenService.validate(token)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isDeactivated: true,
				deacivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: validToken.id
			}
		})

		await this.sessionService.destroy(req)

		return user
	}

	async sendDeactivateToken(
		req: FastifyRequest,
		user: User,
		userAgent: string
	) {
		const deactivateToken = await this.tokenService.generate(
			user.id,
			"DEACTIVATE_ACCOUNT",
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendDeactivateAccountToken(
			user.email,
			deactivateToken.token,
			metadata
		)

		return true
	}
}
