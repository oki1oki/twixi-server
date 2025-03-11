import { Module } from "@nestjs/common"
import { TokenModule } from "src/core/token/token.module"
import { SessionModule } from "../session/session.module"
import { DeactivateResolver } from "./deactivate.resolver"
import { DeactivateService } from "./deactivate.service"

@Module({
	imports: [SessionModule, TokenModule],
	providers: [DeactivateResolver, DeactivateService]
})
export class DeactivateModule {}
