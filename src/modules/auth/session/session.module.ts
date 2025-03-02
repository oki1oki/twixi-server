import { Module } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "src/core/prisma/prisma.service"
import { RedisService } from "src/core/redis/redis.service"
import { SessionResolver } from "./session.resolver"
import { SessionService } from "./session.service"

@Module({
	providers: [
		SessionResolver,
		SessionService,
		PrismaService,
		RedisService,
		ConfigService
	],
	exports: [SessionService]
})
export class SessionModule {}
