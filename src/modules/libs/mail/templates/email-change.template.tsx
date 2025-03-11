import {
	Body,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from "@react-email/components"
import * as React from "react"
import type { SessionMetadata } from "src/shared/utils/types/session-metadata.type"
import { MetadataTemplate } from "./metadata.template"

interface IPasswordRecoveryTemplateProps {
	token: string
	metadata: SessionMetadata
	isNewEmail: boolean
}

export function EmailChangeTemplate({
	token,
	metadata,
	isNewEmail
}: IPasswordRecoveryTemplateProps) {
	return (
		<Html>
			<Head />
			<Preview>
				{isNewEmail ? "Подтверждение новой почты" : "Смена почты"}
			</Preview>

			<Tailwind>
				<Body className='p-6 max-w-2xl mx-auto bg-slate-50 text-black!'>
					<Section className='text-center mb-8'>
						<Heading className='text-2xl font-bold'>
							{isNewEmail
								? "Подтвердите вашу новую почту"
								: "Запрос на смену почты"}
						</Heading>
						<Text className='text-lg'>
							{isNewEmail
								? "Подтверждение новой почты"
								: "Вы отправили запрос на смену почты"}{" "}
							в сервисе <b>Twixi</b>
						</Text>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-5 text-center'>
						<Heading className='text-2xl font-semibold'>
							Код подтверждения
						</Heading>
						<Heading className='text-3xl font-semibold bg-white p-4 w-fit rounded-xl mx-auto'>
							{token}
						</Heading>
						<Text>Код действителен в течение 5 минут</Text>
					</Section>
					{!isNewEmail && <MetadataTemplate metadata={metadata} />}
				</Body>
			</Tailwind>
		</Html>
	)
}
