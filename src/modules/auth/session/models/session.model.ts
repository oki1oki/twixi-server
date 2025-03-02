import { Field, ID, ObjectType } from "@nestjs/graphql"
import type {
	BaseInfo,
	DeviceInfo,
	LocationInfo,
	SessionMetadata
} from "src/shared/utils/types/session-metadata.type"

@ObjectType()
class BaseInfoModel implements BaseInfo {
	@Field()
	name: string

	@Field()
	version: string
}

@ObjectType()
export class LocationModel implements LocationInfo {
	@Field()
	country: string

	@Field()
	city: string

	@Field(() => Number)
	latidute: number

	@Field(() => Number)
	longitude: number
}

@ObjectType()
export class DeviceModel implements DeviceInfo {
	@Field()
	type: string

	@Field()
	model: string

	@Field()
	vendor: string

	@Field(() => BaseInfoModel)
	os: BaseInfoModel

	@Field(() => BaseInfoModel)
	browser: BaseInfoModel
}

@ObjectType()
export class SessionMetadataModel implements SessionMetadata {
	@Field(() => LocationModel)
	location: LocationModel

	@Field(() => DeviceModel)
	device: DeviceModel

	@Field()
	ip: string
}

@ObjectType()
export class SessionModel {
	@Field(() => ID)
	id: string

	@Field()
	userId: string

	@Field(() => Date)
	createdAt: Date

	@Field(() => SessionMetadataModel)
	metadata: SessionMetadataModel
}
