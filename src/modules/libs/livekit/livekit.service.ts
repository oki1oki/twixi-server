import { Inject, Injectable } from "@nestjs/common"
import {
	IngressClient,
	RoomServiceClient,
	WebhookReceiver
} from "livekit-server-sdk"
import { LivekitOptions } from "./types/livekit.types"
import { LivekitOptionsSymbol } from "./types/livekit.types"

@Injectable()
export class LivekitService {
	private roomService: RoomServiceClient
	private ingressClient: IngressClient
	private webhookReceiver: WebhookReceiver

	constructor(
		@Inject(LivekitOptionsSymbol) private readonly options: LivekitOptions
	) {
		this.roomService = new RoomServiceClient(
			this.options.apiUrl,
			this.options.apiKey,
			this.options.apiSecret
		)

		this.ingressClient = new IngressClient(this.options.apiUrl)

		this.webhookReceiver = new WebhookReceiver(
			this.options.apiKey,
			this.options.apiSecret
		)
	}

	get ingress() {
		return this.createProxy(this.ingressClient)
	}

	get room() {
		return this.createProxy(this.roomService)
	}

	get webhook() {
		return this.createProxy(this.webhookReceiver)
	}

	private createProxy<T extends object>(target: T) {
		return new Proxy(target, {
			get: (object, prop) => {
				const value = object[prop as keyof T]

				if (typeof value === "function") {
					return value.bind(object)
				}

				return value
			}
		})
	}
}
