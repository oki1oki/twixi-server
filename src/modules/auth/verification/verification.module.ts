import { Module } from "@nestjs/common"
import { TokenModule } from "src/core/token/token.module"
import { SessionModule } from "../session/session.module"
import { VerificationResolver } from "./verification.resolver"
import { VerificationService } from "./verification.service"

@Module({
	imports: [SessionModule, TokenModule],
	providers: [VerificationResolver, VerificationService],
	exports: [VerificationService]
})
export class VerificationModule {}
