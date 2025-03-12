import { Field, ID, ObjectType } from "@nestjs/graphql"
import type { User } from "@prisma/client"
import { SocialLinkModel } from "../../../profile/models/social-link.model"

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field()
	username: string

	@Field()
	email: string

	@Field()
	password: string

	@Field()
	displayName: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date)
	deacivatedAt: Date

	@Field(() => Boolean)
	isTotpEnable: boolean

	@Field()
	totpSecret: string

	@Field({ nullable: true })
	avatar: string

	@Field({ nullable: true })
	bio: string

	@Field(() => [SocialLinkModel])
	socialLinks: SocialLinkModel[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
