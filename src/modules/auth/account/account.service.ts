import { ConflictException, Injectable } from "@nestjs/common"
import { hash } from "argon2"
import { PrismaService } from "src/core/prisma/prisma.service"
import { VerificationService } from "../verification/verification.service"
import { CreateUserInput } from "./inputs/create-user.input"

@Injectable()
export class AccountService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService
	) {}

	async findMe(id: string) {
		return this.prismaService.user.findUnique({
			where: {
				id
			}
		})
	}

	async findByEmail(email: string) {
		return this.prismaService.user.findUnique({
			where: {
				email
			}
		})
	}

	async create(input: CreateUserInput) {
		const { username, email, password, displayName } = input

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username
			}
		})

		if (isUsernameExists)
			throw new ConflictException("Это имя пользователя уже занято")

		const isEmailExisting = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (isEmailExisting) throw new ConflictException("Эта почта уже занята")

		const user = await this.prismaService.user.create({
			data: {
				username,
				email,
				password: await hash(password),
				displayName
			}
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}
}
