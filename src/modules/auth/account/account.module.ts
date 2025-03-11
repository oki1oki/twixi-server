import { Module } from "@nestjs/common"
import { SessionModule } from "../session/session.module"
import { VerificationModule } from "../verification/verification.module"
import { AccountResolver } from "./account.resolver"
import { AccountService } from "./account.service"

@Module({
	imports: [VerificationModule, SessionModule],
	providers: [AccountResolver, AccountService],
	exports: [AccountService]
})
export class AccountModule {}
