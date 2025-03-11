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
	domain?: string
	token: string
	metadata: SessionMetadata
	isNewEmail: boolean
}

export function EmailChangeTemplate({
	domain,
	token,
	metadata,
	isNewEmail
}: IPasswordRecoveryTemplateProps) {
	const changeLink = `${domain}/aссount/email-change?token=${token}`

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
						{isNewEmail ? (
							<>
								<Heading className='text-2xl font-semibold'>
									Код подтверждения
								</Heading>
								<Heading className='text-3xl font-semibold bg-white p-4 w-fit rounded-xl mx-auto'>
									{token}
								</Heading>
								<Text>Код действителен в течение 5 минут</Text>
							</>
						) : (
							<>
								<Text className='text-lg'>
									Для смены почты перейдите по ссылке ниже
								</Text>
								<Link
									href={changeLink}
									className='inline-flex px-5 py-2 justify-center items-center rounded-lg bg-sky-500 font-medium text-lg text-white'
								>
									Сменить почту
								</Link>
							</>
						)}
					</Section>
					{!isNewEmail && <MetadataTemplate metadata={metadata} />}
				</Body>
			</Tailwind>
		</Html>
	)
}
