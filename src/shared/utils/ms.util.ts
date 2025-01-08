export function ms(time: string): number {
	const regex = /^(\d+)([smhdwMy])$/
	const match = time.match(regex)

	if (!match) {
		throw new Error(`Invalid time format: ${time}`)
	}

	const value = parseInt(match[1], 10)
	const unit = match[2]

	const unitToMilliseconds: Record<string, number> = {
		s: 1000,
		m: 1000 * 60,
		h: 1000 * 60 * 60,
		d: 1000 * 60 * 60 * 24,
		w: 1000 * 60 * 60 * 24 * 7,
		M: 1000 * 60 * 60 * 24 * 30,
		y: 1000 * 60 * 60 * 24 * 365
	}

	if (!unitToMilliseconds[unit]) {
		throw new Error(`Unsupported time unit: ${unit}`)
	}

	return value * unitToMilliseconds[unit]
}
