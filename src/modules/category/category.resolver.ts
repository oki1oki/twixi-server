import { Args, Query, Resolver } from "@nestjs/graphql"
import { OmitType } from "@nestjs/mapped-types"
import { CategoryService } from "./category.service"
import {
	CategoryModel,
	CategoryWithStreamsModel
} from "./models/category.model"

@Resolver("Category")
export class CategoryResolver {
	constructor(private readonly categoryService: CategoryService) {}

	@Query(() => [CategoryModel], {
		name: "findAllCategories"
	})
	async findAllCategories() {
		return this.categoryService.findAllCategories()
	}

	@Query(() => [CategoryModel], {
		name: "findRandomCategories"
	})
	async findRandomCategories(@Args("count") count: number) {
		return this.categoryService.findRandomCategories(count)
	}

	@Query(() => CategoryWithStreamsModel, {
		name: "findCategoryBySlug"
	})
	async findCategoryBySlug(@Args("slug") slug: string) {
		return this.categoryService.findCategoryBySlug(slug)
	}
}
