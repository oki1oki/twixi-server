import { ConfigService } from "@nestjs/config"
import { LivekitOptions } from "src/modules/libs/livekit/types/livekit.types"

export function getLivekitConfig(configService: ConfigService): LivekitOptions {
	return {
		apiUrl: configService.getOrThrow<string>("LIVEKIT_API_URL"),
		apiKey: configService.getOrThrow<string>("LIVEKIT_API_KEY"),
		apiSecret: configService.getOrThrow<string>("LIVEKIT_API_SECRET")
	}
}
