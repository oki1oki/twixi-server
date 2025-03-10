import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { verify } from "argon2"
import { FastifyRequest } from "fastify"
import { TOTP } from "otpauth"
import { getSessionMetadata } from "src/shared/utils/session-metadata.util"
import { AccountService } from "./account/account.service"
import { CreateUserInput } from "./account/inputs/create-user.input"
import { LoginInput } from "./session/inputs/login.input"
import { SessionService } from "./session/session.service"
import { VerificationService } from "./verification/verification.service"

@Injectable()
export class AuthService {
	constructor(
		private readonly sessionService: SessionService,
		private readonly accountService: AccountService,
		private readonly verificationService: VerificationService
	) {}

	async register(input: CreateUserInput) {
		return this.accountService.create(input)
	}

	async login(req: FastifyRequest, input: LoginInput, userAgent: string) {
		const { email, password, pin } = input

		const user = await this.accountService.findByEmail(email)

		if (!user) throw new NotFoundException("Неверная почта")

		const isPasswordValid = await verify(user.password, password)

		if (!isPasswordValid) throw new BadRequestException("Неверный пароль")

		if (user.isDeactivated)
			throw new BadRequestException("Ваш аккаунт деактивирован")

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)
			throw new BadRequestException(
				"Ваша почта не подтверждена. Пожалуйста, проверьте свою почту для подтверждения."
			)
		}

		if (user.isTotpEnable) {
			if (!pin) throw new BadRequestException("Не передан код для TOTP")

			const totp = new TOTP({
				issuer: "Twixi",
				label: user.email,
				algorithm: "SHA1",
				digits: 6,
				period: 30,
				secret: user.totpSecret
			})

			const delta = totp.validate({ token: pin })

			if (delta === null) throw new BadRequestException("Неверный код")
		}

		const sessionMetadata = getSessionMetadata(req, userAgent)

		return this.sessionService.save(req, user, sessionMetadata)
	}

	async logout(req: FastifyRequest) {
		return this.sessionService.destroy(req)
	}
}
