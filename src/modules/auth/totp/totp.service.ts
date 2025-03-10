import { BadRequestException, Injectable } from "@nestjs/common"
import type { User } from "@prisma/client"
import { randomBytes } from "crypto"
import { encode } from "hi-base32"
import { TOTP } from "otpauth"
import * as QRCode from "qrcode"
import { PrismaService } from "src/core/prisma/prisma.service"
import { EnableTotpInput } from "./inputs/enable-totp.input"

@Injectable()
export class TotpService {
	constructor(private readonly prismaService: PrismaService) {}

	async generate(user: User) {
		const secret = encode(randomBytes(12)).replace(/=/g, "").substring(0, 24)

		const totp = new TOTP({
			issuer: "Twixi",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret
		})

		const otpAuthUrl = totp.toString()
		const qrCodeUrl = QRCode.toDataURL(otpAuthUrl)

		return { qrCodeUrl, secret }
	}

	async enable(user: User, input: EnableTotpInput) {
		const { secret, token } = input

		const totp = new TOTP({
			issuer: "Twixi",
			label: user.email,
			algorithm: "SHA1",
			digits: 6,
			period: 30,
			secret
		})

		console.log(totp.generate())

		const delta = totp.validate({ token })

		if (delta === null) throw new BadRequestException("Неверный код")

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnable: true,
				totpSecret: secret
			}
		})

		return true
	}

	async disable(user: User) {
		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				isTotpEnable: false,
				totpSecret: null
			}
		})

		return true
	}
}
