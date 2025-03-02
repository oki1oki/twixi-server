import { Module } from "@nestjs/common"
import { SessionService } from "../session/session.service"
import { VerificationService } from "../verification/verification.service"
import { AccountResolver } from "./account.resolver"
import { AccountService } from "./account.service"

@Module({
	providers: [
		AccountResolver,
		AccountService,
		VerificationService,
		SessionService
	],
	exports: [AccountService]
})
export class AccountModule {}
