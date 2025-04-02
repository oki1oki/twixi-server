import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { CoreModule } from "./core/core.module"
import { IS_DEV_ENV } from "./shared/utils/is-dev.util"

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		CoreModule
	]
})
export class AppModule {}
