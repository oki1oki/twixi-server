import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "src/core/prisma/prisma.service"

@Injectable()
export class CategoryService {
	constructor(private readonly prisma: PrismaService) {}

	async findAllCategories() {
		return this.prisma.category.findMany()
	}

	async findRandomCategories(count: number) {
		return this.prisma.category.findMany({
			take: count,
			orderBy: {
				id: "asc"
			}
		})
	}

	async findCategoryBySlug(slug: string) {
		const category = await this.prisma.category.findUnique({
			where: { slug },
			include: {
				streams: {
					include: {
						user: true
					}
				}
			}
		})

		if (!category) {
			throw new NotFoundException("Категория не найдена")
		}

		return category
	}
}
