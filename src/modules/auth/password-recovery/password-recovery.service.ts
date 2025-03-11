import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { hash } from "argon2"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { TokenService } from "src/core/token/token.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { isActionAllowed } from "src/shared/utils/is-action-allowed.util"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { NewPasswordInput } from "./inputs/new-password.input"
import { ResetPasswordInput } from "./inputs/reset-password.input"

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly tokenService: TokenService
	) {}

	async resetPassword(
		req: FastifyRequest,
		input: ResetPasswordInput,
		userAgent: string
	) {
		const { email } = input

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (!user) throw new NotFoundException("Пользователь не найден")

		await this.prismaService.actionAttempt.create({
			data: {
				type: "PASSWORD_RESET",
				userId: user.id
			}
		})

		const hasAttemptsLeft = await isActionAllowed(
			this.prismaService,
			user.id,
			"PASSWORD_RESET"
		)

		if (!hasAttemptsLeft)
			throw new BadRequestException(
				"Вы совершили слишком много попыток, пожалуйста, попробуйте снова через 1 час."
			)

		const resetToken = await this.tokenService.generate(
			user.id,
			"PASSWORD_RESET"
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendPasswordResetToken(
			email,
			resetToken.token,
			metadata
		)

		return true
	}

	async newPassword(input: NewPasswordInput) {
		const { token, password } = input

		const validToken = await this.tokenService.validate(token)

		await this.prismaService.user.update({
			where: {
				id: validToken.userId
			},
			data: {
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: validToken.id
			}
		})

		return true
	}
}
