import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { getLivekitConfig } from "src/core/config/livekit.config"
import { TokenModule } from "../../core/token/token.module"
import { LivekitModule } from "./livekit/livekit.module"
import { MailModule } from "./mail/mail.module"
import { StorageModule } from "./storage/storage.module"

@Module({
	imports: [
		MailModule,
		StorageModule,
		TokenModule,
		LivekitModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getLivekitConfig,
			inject: [ConfigService]
		})
	]
})
export class LibsModule {}
