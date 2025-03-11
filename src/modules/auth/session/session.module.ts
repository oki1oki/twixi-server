import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { SessionResolver } from "./session.resolver"
import { SessionService } from "./session.service"

@Module({
	providers: [SessionResolver, SessionService, ConfigService],
	exports: [SessionService]
})
export class SessionModule {}
