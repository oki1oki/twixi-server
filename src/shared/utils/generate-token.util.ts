import type { TokenType } from "@prisma/client"
import type { PrismaService } from "src/core/prisma/prisma.service"
import { v4 as uuidv4 } from "uuid"

export async function generateToken(
	prismaService: PrismaService,
	userId: string,
	type: TokenType,
	isUUId: boolean = true
) {
	let token: string

	if (isUUId) {
		token = uuidv4()
	} else {
		token = Math.floor(100000 + Math.random() * 900000).toString() // 6 digit code
	}

	const expiresIn = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 minutes

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			userId
		}
	})

	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id
			}
		})
	}

	const newToken = await prismaService.token.create({
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
