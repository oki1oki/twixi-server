import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { User } from "@prisma/client"
import type { FastifyRequest } from "fastify"
import { RedisService } from "src/core/redis/redis.service"
import type { SessionMetadata } from "src/shared/utils/types/session-metadata.type"

@Injectable()
export class SessionService {
	constructor(
		private readonly redisService: RedisService,
		private readonly configSerivce: ConfigService
	) {}

	async findByUser(req: FastifyRequest) {
		const userId = req.session.userId

		if (!userId) {
			throw new NotFoundException("Пользователь не имеет активных сессий")
		}

		const sessionIds = await this.redisService.smembers(
			`user:${userId}:sessions`
		)

		if (!sessionIds.length) {
			throw new NotFoundException("Активные сессии не найдены")
		}

		const userSessions = []

		for (const sessionId of sessionIds) {
			const session = await this.redisService.get(`sessions:${sessionId}`)
			if (session) {
				const sessionData = JSON.parse(session)
				userSessions.push({
					...sessionData,
					id: sessionId
				})
			}
		}

		userSessions.sort((a, b) => b.createdAt - a.createdAt)

		return userSessions.filter(session => session.id !== req.session.sessionId)
	}

	async findCurrent(req: FastifyRequest) {
		const sessionId = req.session.sessionId

		const session = await this.redisService.get(
			`${this.configSerivce.getOrThrow<string>("SESSION_FOLDER")}${sessionId}`
		)

		return {
			...JSON.parse(session),
			id: sessionId
		}
	}

	async removeById(req: FastifyRequest, id: string) {
		if (req.session.sessionId === id) {
			throw new ConflictException("Нельзя удалить текущую сессию")
		}

		await this.redisService.del(
			`${this.configSerivce.getOrThrow<string>("SESSION_FOLDER")}${id}`
		)

		await this.redisService.srem(`user:${req.session.userId}:sessions`, id)

		return true
	}

	async save(req: FastifyRequest, user: User, metadata: SessionMetadata) {
		try {
			req.session.createdAt = new Date()
			req.session.metadata = metadata
			req.session.userId = user.id

			await this.redisService.sadd(
				`user:${user.id}:sessions`,
				req.session.sessionId
			)

			await new Promise<void>((resolve, reject) => {
				req.session.save(err => {
					if (err) return reject(err)

					resolve()
				})
			})

			return user
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при сохранении сессии: ${error}`
			)
		}
	}

	async destroy(req: FastifyRequest) {
		try {
			await this.redisService.srem(
				`user:${req.session.userId}:sessions`,
				req.session.sessionId
			)

			await new Promise<void>((resolve, reject) => {
				req.session.destroy(err => {
					if (err) return reject(err)

					resolve()
				})
			})

			return true
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при завершении сессии: ${error}`
			)
		}
	}
}
