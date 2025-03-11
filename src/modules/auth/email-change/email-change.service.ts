import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { User } from "@prisma/client"
import { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { generateToken } from "src/shared/utils/generate-token.util"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { EmailChangeInput } from "./inputs/email-change.input"

@Injectable()
export class EmailChangeService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	async change(
		req: FastifyRequest,
		input: EmailChangeInput,
		user: User,
		userAgent: string
	) {
		const { newEmail, oldEmailToken, newEmailToken } = input

		if (!oldEmailToken) {
			await this.sendEmailToken(req, user, userAgent, false)

			throw new BadRequestException(
				"Требуется код подтверждения с вашей старой почты"
			)
		}

		const validOldToken = await this.validateToken(oldEmailToken)

		if (!newEmailToken) {
			await this.sendEmailToken(req, user, userAgent, true)

			throw new BadRequestException(
				"Требуется код подтверждения с вашей новой почты"
			)
		}

		const validNewToken = await this.validateToken(newEmailToken)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				email: newEmail
			}
		})

		await this.prismaService.token.deleteMany({
			where: {
				id: validOldToken.id || validNewToken.id
			}
		})

		return true
	}

	private async validateToken(token: string) {
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

		return existingToken
	}

	async sendEmailToken(
		req: FastifyRequest,
		user: User,
		userAgent: string,
		isNewEmail: boolean
	) {
		const token = await generateToken(
			this.prismaService,
			user.id,
			isNewEmail ? "NEW_EMAIL_VERIFY" : "OLD_EMAIL_VERIFY",
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendEmailChangeToken(
			user.email,
			token.token,
			metadata,
			isNewEmail
		)

		return true
	}
}
