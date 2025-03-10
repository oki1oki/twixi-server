import { Module } from "@nestjs/common"
import { AccountModule } from "./account/account.module"
import { AuthResolver } from "./auth.resolver"
import { AuthService } from "./auth.service"
import { PasswordRecoveryModule } from "./password-recovery/password-recovery.module"
import { SessionModule } from "./session/session.module"
import { TotpModule } from "./totp/totp.module"
import { VerificationModule } from "./verification/verification.module"
import { DeactivateModule } from './deactivate/deactivate.module';

@Module({
	imports: [
		AccountModule,
		SessionModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule
	],
	providers: [AuthResolver, AuthService]
})
export class AuthModule {}
