import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common"
import { hash, verify } from "argon2"
import { PrismaService } from "src/core/prisma/prisma.service"
import { VerificationService } from "../verification/verification.service"
import { ChangePasswordInput } from "./inputs/change-password.input"
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
			},
			include: {
				socialLinks: true
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
				displayName,
				stream: {
					create: {
						title: `Стрим ${username}`,
						description: `Добро пожаловать на стрим ${username}`
					}
				}
			}
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}

	async changePassword(userId: string, input: ChangePasswordInput) {
		const { oldPassword, newPassword } = input

		if (oldPassword === newPassword)
			throw new BadRequestException("Новый пароль должен отличаться от старого")

		const existinguser = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})

		if (!existinguser) throw new NotFoundException("Пользователь не найден")
		const isPasswordValid = await verify(existinguser.password, oldPassword)

		if (!isPasswordValid)
			throw new BadRequestException("Неверный старый пароль")

		await this.prismaService.user.update({
			where: {
				id: userId
			},
			data: {
				password: await hash(newPassword)
			}
		})

		return true
	}
}
