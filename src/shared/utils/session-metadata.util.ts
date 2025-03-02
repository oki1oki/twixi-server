import type { FastifyRequest } from "fastify"
import { lookup } from "geoip-lite"
import * as countries from "i18n-iso-countries"
import { UAParser } from "ua-parser-js"
import { IS_DEV_ENV } from "./is-dev.util"
import type { SessionMetadata } from "./types/session-metadata.type"

// eslint-disable-next-line @typescript-eslint/no-var-requires
countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

export function getSessionMetadata(
	req: FastifyRequest,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV_ENV
		? "83.220.236.105"
		: Array.isArray(req.headers["cf-connecting-ip"])
			? req.headers["cf-connecting-ip"][0]
			: req.headers["cf-connecting-ip"] ||
				(typeof req.headers["x-forwarded-for"] === "string"
					? req.headers["x-forwarded-for"].split(",")[0]
					: req.ip)

	const location = lookup(ip)
	const { browser, os, device } = UAParser(userAgent)

	return {
		location: {
			country: countries.getName(location.country, "en") || null,
			city: location.city,
			latidute: location.ll[0] || 0,
			longitude: location.ll[1] || 0
		},
		device: {
			browser: {
				name: browser.name,
				version: browser.version
			},
			os: {
				name: os.name,
				version: os.version
			},
			type: device.type || "desktop",
			model: device.model || null,
			vendor: device.vendor || null
		},
		ip
	}
}
