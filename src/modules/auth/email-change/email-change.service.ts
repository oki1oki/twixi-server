import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { User } from "@prisma/client"
import { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { TokenService } from "src/core/token/token.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { ChangeEmailInput } from "./inputs/change-email.input"

@Injectable()
export class EmailChangeService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly tokenService: TokenService
	) {}

	async change(
		req: FastifyRequest,
		input: ChangeEmailInput,
		user: User,
		userAgent: string
	) {
		const { newEmail, oldEmailToken, newEmailToken } = input

		const validOldToken = await this.tokenService.validate(oldEmailToken)

		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email: newEmail
			}
		})

		if (isEmailExists) throw new BadRequestException("Эта почта уже занята")

		if (!newEmailToken) {
			await this.sendEmailToken(req, user, userAgent, newEmail)

			throw new BadRequestException(
				"Требуется код подтверждения с вашей новой почты"
			)
		}

		const validNewToken = await this.tokenService.validate(newEmailToken)

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
				OR: [{ id: validOldToken.id }, { id: validNewToken.id }]
			}
		})

		return true
	}

	async sendEmailToken(
		req: FastifyRequest,
		user: User,
		userAgent: string,
		newEmail?: string
	) {
		const token = await this.tokenService.generate(
			user.id,
			newEmail ? "NEW_EMAIL_VERIFY" : "OLD_EMAIL_VERIFY",
			newEmail && false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendEmailChangeToken(
			newEmail ? newEmail : user.email,
			token.token,
			metadata,
			!!newEmail
		)

		return true
	}
}
