type Language = "ru" | "en"

interface WandererNameConfig {
	wandererTypes: string[]
	adjectives: string[]
}

const translations: Record<Language, WandererNameConfig> = {
	ru: {
		wandererTypes: [
			"Странник",
			"Путник",
			"Кочевник",
			"Скиталец",
			"Пилигрим",
			"Странствующий",
			"Бродяга",
			"Путешественник"
		],
		adjectives: [
			"Таинственный",
			"Загадочный",
			"Бесстрашный",
			"Мудрый",
			"Отважный",
			"Тихий",
			"Быстрый",
			"Спокойный"
		]
	},
	en: {
		wandererTypes: [
			"Wanderer",
			"Wayfarer",
			"Nomad",
			"Vagabond",
			"Pilgrim",
			"Rover",
			"Voyager",
			"Explorer"
		],
		adjectives: [
			"Mysterious",
			"Enigmatic",
			"Fearless",
			"Wise",
			"Brave",
			"Silent",
			"Swift",
			"Calm"
		]
	}
}

function isValidLanguage(
	lang: string | string[] | undefined
): lang is Language {
	return typeof lang === "string" && (lang === "ru" || lang === "en")
}

export function generateViewerName(language?: string | string[]) {
	const lang = isValidLanguage(language) ? language : "en"
	const config = translations[lang]
	const wandererType =
		config.wandererTypes[
			Math.floor(Math.random() * config.wandererTypes.length)
		]
	const adjective =
		config.adjectives[Math.floor(Math.random() * config.adjectives.length)]
	const number = Math.floor(Math.random() * 1000)

	return `${adjective} ${wandererType} ${number}`
}
