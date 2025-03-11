import { Module } from "@nestjs/common"
import { TokenModule } from "src/core/token/token.module"
import { PasswordRecoveryResolver } from "./password-recovery.resolver"
import { PasswordRecoveryService } from "./password-recovery.service"

@Module({
	imports: [TokenModule],
	providers: [PasswordRecoveryResolver, PasswordRecoveryService]
})
export class PasswordRecoveryModule {}
