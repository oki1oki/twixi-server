import { Module } from "@nestjs/common"
import { PrismaService } from "src/core/prisma/prisma.service"
import { MailService } from "src/modules/libs/mail/mail.service"
import { SessionService } from "../session/session.service"
import { VerificationResolver } from "./verification.resolver"
import { VerificationService } from "./verification.service"

@Module({
	providers: [
		VerificationResolver,
		VerificationService,
		MailService,
		PrismaService,
		SessionService
	],
	exports: [VerificationService]
})
export class VerificationModule {}
