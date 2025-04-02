import { ApolloDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { AuthModule } from "src/modules/auth/auth.module"
import { CategoryModule } from "src/modules/category/category.module"
import { ChatModule } from "src/modules/chat/chat.module"
import { CronModule } from "src/modules/cron/cron.module"
import { LibsModule } from "src/modules/libs/libs.module"
import { ProfileModule } from "src/modules/profile/profile.module"
import { StreamModule } from "src/modules/stream/stream.module"
import { WebhookModule } from "src/modules/webhook/webhook.module"
import { getGraphQLConfig } from "./config/graphql.config"
import { PrismaModule } from "./prisma/prisma.module"
import { RedisModule } from "./redis/redis.module"

@Module({
	imports: [
		GraphQLModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			driver: ApolloDriver,
			useFactory: getGraphQLConfig
		}),
		LibsModule,
		PrismaModule,
		RedisModule,
		AuthModule,
		CronModule,
		ProfileModule,
		StreamModule,
		WebhookModule,
		CategoryModule,
		ChatModule
	]
})
export class CoreModule {}
