import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CoreModule } from "./core/core.module"
import { IS_DEV_ENV } from "./shared/utils/is-dev.util"
import { CronModule } from './modules/cron/cron.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		CoreModule,
		CronModule
	]
})
export class AppModule {}
