import { Module } from "@nestjs/common"
import { SessionService } from "../session/session.service"
import { DeactivateResolver } from "./deactivate.resolver"
import { DeactivateService } from "./deactivate.service"

@Module({
	providers: [DeactivateResolver, DeactivateService, SessionService]
})
export class DeactivateModule {}
