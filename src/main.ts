import fastifyCookie from "@fastify/cookie"
import fastifySession from "@fastify/session"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import {
	FastifyAdapter,
	NestFastifyApplication
} from "@nestjs/platform-fastify"
import { RedisStore } from "connect-redis"
import { AppModule } from "./app.module"
import { RedisService } from "./core/redis/redis.service"
import { ms } from "./shared/utils/ms.util"
import { parseBoolean } from "./shared/utils/parse-boolean.util"

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter()
	)
	const config = app.get(ConfigService)
	const redis = app.get(RedisService)

	await app.register(fastifyCookie, {
		secret: config.getOrThrow<string>("COOKIES_SECRET")
	})

	await app.register(fastifySession, {
		cookieName: config.getOrThrow<string>("SESSION_NAME"),
		secret: config.getOrThrow<string>("SESSION_SECRET"),
		saveUninitialized: false,
		cookie: {
			domain: config.getOrThrow<string>("SESSION_DOMAIN"),
			maxAge: ms(config.getOrThrow<string>("SESSION_MAX_AGE")),
			httpOnly: parseBoolean(config.getOrThrow<string>("SESSION_HTTP_ONLY")),
			secure: parseBoolean(config.getOrThrow<string>("SESSION_SECURE")),
			sameSite: "lax"
		},
		store: new RedisStore({
			client: redis,
			prefix: config.getOrThrow<string>("SESSION_FOLDER")
		})
	})

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
		credentials: true,
		exposedHeaders: ["set-cookie"]
	})

	await app.listen(config.getOrThrow<number>("APPLICATION_PORT"))
}

bootstrap()
