import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CoreModule } from "./core/core.module"
import { StreamModule } from "./modules/stream/stream.module"
import { IS_DEV_ENV } from "./shared/utils/is-dev.util"
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		CoreModule,
		StreamModule,
		WebhookModule
	]
})
export class AppModule {}
