import { ApolloDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { AuthModule } from "src/modules/auth/auth.module"
import { LibsModule } from "src/modules/libs/libs.module"
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
		AuthModule
	]
})
export class CoreModule {}
