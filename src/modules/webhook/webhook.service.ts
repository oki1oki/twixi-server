import { Injectable } from "@nestjs/common"
import { LivekitService } from "../libs/livekit/livekit.service"
import { StreamService } from "../stream/stream.service"

@Injectable()
export class WebhookService {
	constructor(
		private readonly livekitService: LivekitService,
		private readonly streamService: StreamService
	) {}

	async receiveWebhook(body: string, authToken: string) {
		const event = await this.livekitService.webhook.receive(
			body,
			authToken,
			true
		)

		const isLive = event.event === "ingress_started"
		if (["ingress_started", "ingress_ended"].includes(event.event)) {
			await this.streamService.handleStreamLiveStatus(
				event.ingressInfo.ingressId,
				isLive
			)
		}

		return event
	}
}
