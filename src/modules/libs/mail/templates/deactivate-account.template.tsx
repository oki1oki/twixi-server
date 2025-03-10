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

interface IDeactivateAccouneTemplateProps {
	token: string
	metadata: SessionMetadata
}

export function DeactivateAccouneTemplate({
	token,
	metadata
}: IDeactivateAccouneTemplateProps) {
	return (
		<Html className='text-black'>
			<Head />
			<Preview>Удаление аккаунта</Preview>

			<Tailwind>
				<Body className='p-6 max-w-2xl mx-auto bg-slate-50 text-black!'>
					<Section className='text-center mb-8'>
						<Heading className='text-2xl font-bold'>
							Запрос на удаление аккаунта
						</Heading>
						<Text className='text-lg'>
							Вы отправили запрос на удаление аккаунта в сервисе <b>Twixi</b>
						</Text>
					</Section>
					<Section className='bg-gray-100 rounded-lg p-5 text-center'>
						<Heading className='text-2xl font-semibold'>
							Код подтверждения
						</Heading>
						<Heading className='text-3xl font-semibold bg-white p-4 w-fit rounded-xl mx-auto'>
							{token}
						</Heading>
						<Text>Код действителен в течении 5 минут</Text>
					</Section>
					<MetadataTemplate metadata={metadata} />
				</Body>
			</Tailwind>
		</Html>
	)
}
