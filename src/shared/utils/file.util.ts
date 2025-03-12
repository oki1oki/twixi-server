import { ReadStream } from "fs"

export function validateFileFormat(fileName: string, allowedFormats: string[]) {
	const fileParts = fileName.split(".")
	const extension = fileParts[-1]

	return allowedFormats.includes(extension)
}

export async function validateFileSize(
	fileStream: ReadStream,
	maxAllowedBytes: number
) {
	return new Promise((resolve, reject) => {
		let totalBytes = 0

		fileStream
			.on("data", (chunk: Buffer) => (totalBytes += chunk.byteLength))
			.on("end", () => resolve(totalBytes <= maxAllowedBytes))
			.on("error", error => reject(error))
	})
}
