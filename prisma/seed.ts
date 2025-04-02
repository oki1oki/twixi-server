import { BadRequestException, Logger } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"
import { hash } from "argon2"
import { CATEGORIES } from "./data/categories"
import { STREAMS_TITLES } from "./data/stream-titles"
import { USERNAMES } from "./data/users"

const prisma = new PrismaClient()

async function main() {
	try {
		Logger.log("Начало заполнения базы данных")

		await prisma.stream.deleteMany()
		await prisma.category.deleteMany()
		await prisma.user.deleteMany()

		Logger.log("Таблицы очищены")

		await prisma.category.createMany({
			data: CATEGORIES
		})

		const categories = await prisma.category.findMany()

		const categoriesBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)

		Logger.log("Категории созданы")

		for (const username of USERNAMES) {
			const randomCategory =
				categoriesBySlug[
					Object.keys(categoriesBySlug)[
						Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
					]
				]

			const createdUser = await prisma.user.create({
				data: {
					username,
					email: `${username}@twixi.ru`,
					password: await hash("12345678"),
					displayName: username,
					avatar: `/channels/${username}.webp`,
					isEmailVerified: true,
					socialLinks: {
						createMany: {
							data: [
								{
									title: "Telegram",
									url: `https://t.me/${username}`,
									position: 1
								},
								{
									title: "YouTube",
									url: `https://youtube.com/@${username}`,
									position: 2
								}
							]
						}
					}
				}
			})

			const randomTitles = STREAMS_TITLES[randomCategory.slug]
			const title =
				randomTitles[Math.floor(Math.random() * randomTitles.length)]

			await prisma.stream.create({
				data: {
					title,
					description: `Стрим ${title} от ${createdUser.displayName}`,
					thumbnailUrl: `/streams/${createdUser.username}.webp`,
					categoryId: randomCategory.id,
					userId: createdUser.id
				}
			})
		}

		Logger.log("Пользователи и стримы созданы")
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException("Ошибка при заполнении базы данных")
	} finally {
		Logger.log("База данных заполнена")
		await prisma.$disconnect()
		Logger.log("Соединение с базой данных закрыто")
	}
}

main()
