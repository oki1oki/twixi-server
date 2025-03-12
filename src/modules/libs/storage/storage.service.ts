import {
	DeleteObjectCommand,
	DeleteObjectTaggingCommandInput,
	PutObjectCommand,
	PutObjectCommandInput,
	S3Client
} from "@aws-sdk/client-s3"
import { BadGatewayException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class StorageService {
	private readonly client: S3Client
	private readonly bucketName: string

	constructor(private readonly configService: ConfigService) {
		this.client = new S3Client({
			endpoint: this.configService.getOrThrow<string>("S3_ENDPOINT"),
			region: this.configService.getOrThrow<string>("S3_REGION"),
			credentials: {
				accessKeyId: this.configService.getOrThrow<string>("S3_ACCESS_KEY_ID"),
				secretAccessKey: this.configService.getOrThrow<string>(
					"S3_SECRET_ACCESS_KEY"
				)
			}
		})

		this.bucketName = this.configService.getOrThrow<string>("S3_BUCKET_NAME")
	}

	async upload(fileBuffer: Buffer, fileKey: string, fileMimeType: string) {
		const putObjectCommandInput: PutObjectCommandInput = {
			Bucket: this.bucketName,
			Key: fileKey,
			Body: fileBuffer,
			ContentType: fileMimeType
		}

		try {
			await this.client.send(new PutObjectCommand(putObjectCommandInput))
		} catch (error) {
			throw new BadGatewayException(
				`Ошибка при загрзке файла: ${error.message}`
			)
		}
	}

	async remove(key: string) {
		const command: DeleteObjectTaggingCommandInput = {
			Bucket: this.bucketName,
			Key: key
		}

		try {
			await this.client.send(new DeleteObjectCommand(command))
		} catch (error) {
			throw new BadGatewayException(
				`Ошибка при удалении файла: ${error.message}`
			)
		}
	}
}
