import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { render } from "@react-email/components"
import type { SessionMetadata } from "src/shared/utils/types/session-metadata.type"
import { DeactivateAccouneTemplate } from "./templates/deactivate-account.template"
import { PasswordRecoveryTemplate } from "./templates/password-recovery.template"
import { VerificationTemplate } from "./templates/verification.template"

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
		const html = await render(VerificationTemplate({ domain, token }))

		return this.sendMail(email, "Подтверждение почты", html)
	}

	async sendPasswordResetToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metadata })
		)

		return this.sendMail(email, "Восстановление пароля", html)
	}

	async sendDeactivateAccountToken(
		email: string,
		token: string,
		metadata: SessionMetadata
	) {
		const html = await render(DeactivateAccouneTemplate({ token, metadata }))

		return this.sendMail(email, "Удаление аккаунта", html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
