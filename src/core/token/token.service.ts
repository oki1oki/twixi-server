import {
	BadRequestException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { TokenType } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class TokenService {
	constructor(private readonly prismaService: PrismaService) {}

	async generate(userId: string, type: TokenType, isUUId: boolean = true) {
		let token: string

		if (isUUId) {
			token = uuidv4()
		} else {
			token = Math.floor(100000 + Math.random() * 900000).toString() // 6 digit code
		}

		const expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 minutes

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				type,
				userId
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id
				}
			})
		}

		const newToken = await this.prismaService.token.create({
			data: {
				token,
				expiresIn,
				type,
				user: {
					connect: {
						id: userId
					}
				}
			},
			include: {
				user: true
			}
		})

		return newToken
	}

	async validate(token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token
			}
		})

		if (!existingToken) {
			throw new NotFoundException("Токен не существует")
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException("Время действия токена истекло")
		}

		return existingToken
	}
}
