import { FactoryProvider, ModuleMetadata } from "@nestjs/common"

export const LivekitOptionsSymbol = Symbol("LivekitOptions")

export type LivekitOptions = {
	apiUrl: string
	apiKey: string
	apiSecret: string
}

export type LivekitAsyncOptions = Pick<ModuleMetadata, "imports"> &
	Pick<FactoryProvider<LivekitOptions>, "useFactory" | "inject">
