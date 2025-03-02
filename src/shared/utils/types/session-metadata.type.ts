export interface LocationInfo {
	country: string
	city: string
	latidute: number
	longitude: number
}

export interface DeviceInfo {
	type: string
	model: string
	vendor: string
	os: BaseInfo
	browser: BaseInfo
}

export interface SessionMetadata {
	location: LocationInfo
	device: DeviceInfo
	ip: string
}

export interface BaseInfo {
	name: string
	version: string
}
