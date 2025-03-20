import { DynamicModule, Module } from "@nestjs/common"
import { LivekitService } from "./livekit.service"
import {
	LivekitAsyncOptions,
	LivekitOptions,
	LivekitOptionsSymbol
} from "./types/livekit.types"

@Module({})
export class LivekitModule {
	static forRoot(options: LivekitOptions): DynamicModule {
		return {
			module: LivekitModule,
			providers: [
				{
					provide: LivekitOptionsSymbol,
					useValue: options
				},
				LivekitService
			],
			exports: [LivekitService],
			global: true
		}
	}

	static forRootAsync(options: LivekitAsyncOptions): DynamicModule {
		return {
			module: LivekitModule,
			imports: options.imports || [],
			providers: [
				{
					provide: LivekitOptionsSymbol,
					useFactory: options.useFactory,
					inject: options.inject || []
				},
				LivekitService
			],
			exports: [LivekitService],
			global: true
		}
	}
}
