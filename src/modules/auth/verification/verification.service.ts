import { Injectable } from "@nestjs/common"
import type { User } from "@prisma/client"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { TokenService } from "src/core/token/token.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { SessionService } from "../session/session.service"
import { VerificationInput } from "./inputs/verification.input"

@Injectable()
export class VerificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly sessionService: SessionService,
		private readonly tokenService: TokenService
	) {}

	async verify(
		req: FastifyRequest,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input

		const validToken = await this.tokenService.validate(token)

		const user = await this.prismaService.user.update({
			where: {
				id: validToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: validToken.id
			}
		})

		const sessionMetadata = getSessionMetadata(req, userAgent)

		await this.sessionService.save(req, user, sessionMetadata)

		return true
	}

	async sendVerificationToken(user: User) {
		const verificationToken = await this.tokenService.generate(
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
