import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from "@nestjs/common"
import { ReadStream } from "fs"
import { validateFileFormat, validateFileSize } from "../utils/file.util"

@Injectable()
export class FileValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (value.fileName) throw new BadRequestException("Файл не загружен")

		const { fileName, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]
		const isValidFormat = validateFileFormat(fileName, allowedExtensions)

		if (!isValidFormat)
			throw new BadRequestException("Недопустимое расширение файла")

		const isSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

		if (!isSizeValid)
			throw new BadRequestException("Размер файла превышает 10 МБ")
	}
}
