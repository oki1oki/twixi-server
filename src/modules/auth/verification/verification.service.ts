import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import type { User } from "@prisma/client"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { generateToken } from "src/shared/utils/generate-token.util"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { SessionService } from "../session/session.service"
import { VerificationInput } from "./inputs/verification.input"

@Injectable()
export class VerificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService
	) {}

	async verify(
		req: FastifyRequest,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input

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

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})

		const sessionMetadata = getSessionMetadata(req, userAgent)

		await this.sessionService.save(req, user, sessionMetadata)

		return true
	}

	async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user.id,
			"EMAIL_VERIFY"
		)

		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		)

		return verificationToken
	}
}
