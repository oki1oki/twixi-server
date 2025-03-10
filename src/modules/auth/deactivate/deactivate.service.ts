import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { User } from "@prisma/client"
import { verify } from "argon2"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { generateToken } from "src/shared/utils/generate-token.util"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { SessionService } from "../session/session.service"
import { DeactivateAccountInput } from "./inputs/deactivate-account.input"

@Injectable()
export class DeactivateService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService
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

		await this.validateDeactivateToken(req, token)

		console.log(user)

		return user
	}

	private async validateDeactivateToken(req: FastifyRequest, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token
			}
		})

		if (!existingToken) {
			throw new NotFoundException("Токен не существует")
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException("Время действия токена истекло")
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isDeactivated: true,
				deacivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})

		return this.sessionService.destroy(req)
	}

	async sendDeactivateToken(
		req: FastifyRequest,
		user: User,
		userAgent: string
	) {
		const deactivateToken = await generateToken(
			this.prismaService,
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
