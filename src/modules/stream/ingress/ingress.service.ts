import { BadRequestException, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import {
	CreateIngressOptions,
	IngressAudioEncodingPreset,
	IngressAudioOptions,
	IngressInput,
	IngressVideoEncodingPreset,
	IngressVideoOptions,
	TrackSource
} from "livekit-server-sdk"
import { PrismaService } from "src/core/prisma/prisma.service"
import { LivekitService } from "src/modules/libs/livekit/livekit.service"

@Injectable()
export class IngressService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly liveKitService: LivekitService
	) {}

	async create(user: User, ingressType: IngressInput) {
		await this.resetIngresses(user)

		const options: CreateIngressOptions = {
			name: user.username,
			roomName: user.id,
			participantName: user.username,
			participantIdentity: user.id
		}

		if (ingressType === IngressInput.WHIP_INPUT) {
			options.enableTranscoding = true
		} else {
			options.video = new IngressVideoOptions({
				source: TrackSource.CAMERA,
				encodingOptions: {
					value: IngressVideoEncodingPreset.H264_720P_30FPS_3_LAYERS,
					case: "preset"
				}
			})
			options.audio = new IngressAudioOptions({
				source: TrackSource.MICROPHONE,
				encodingOptions: {
					value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
					case: "preset"
				}
			})
		}

		const ingress = await this.liveKitService.ingress.createIngress(
			ingressType,
			options
		)

		if (!ingress || !ingress.url || !ingress.streamKey) {
			throw new BadRequestException("Не удалось создать входной поток")
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				ingressId: ingress.ingressId,
				serverUrl: ingress.url,
				streamKey: ingress.streamKey
			}
		})

		return true
	}

	private async resetIngresses(user: User) {
		const ingresses = await this.liveKitService.ingress.listIngress({
			roomName: user.id
		})

		const rooms = await this.liveKitService.room.listRooms([user.id])

		for (const room of rooms) {
			await this.liveKitService.room.deleteRoom(room.name)
		}

		for (const ingress of ingresses) {
			if (ingress.ingressId) {
				await this.liveKitService.ingress.deleteIngress(ingress.ingressId)
			}
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				ingressId: null
			}
		})
	}
}
