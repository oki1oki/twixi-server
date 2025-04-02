import { Field, ObjectType } from "@nestjs/graphql"
import { MetaModel } from "./meta.model"
import { StreamModel } from "./stream.model"

@ObjectType()
export class StreamAndMetaModel {
	@Field(() => [StreamModel])
	items: StreamModel[]

	@Field(() => MetaModel)
	meta: MetaModel
}
