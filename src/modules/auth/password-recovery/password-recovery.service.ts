import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { hash } from "argon2"
import type { FastifyRequest } from "fastify"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { generateToken } from "src/shared/utils/generate-token.util"
import { isActionAllowed } from "src/shared/utils/is-action-allowed.util"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { NewPasswordInput } from "./inputs/new-password.input"
import { ResetPasswordInput } from "./inputs/reset-password.input"

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
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

		const resetToken = await generateToken(
			this.prismaService,
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
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})

		return true
	}
}
