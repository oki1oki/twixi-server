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
} from '@react-email/components'
import * as React from 'react'
import type { SessionMetadata } from 'src/shared/utils/types/session-metadata.type'
import { MetadataTemplate } from './metadata.template'

interface IPasswordRecoveryTemplateProps {
	domain: string
	token: string
	metadata: SessionMetadata
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	metadata
}: IPasswordRecoveryTemplateProps) {
	const resetLink = `${domain}/aссount/recovery?token=${token}`

	return (
		<Html className='text-black'>
			<Head />
			<Preview>Восстановление пароля</Preview>

			<Tailwind>
				<Body className='p-6 max-w-2xl mx-auto bg-slate-50 text-black'>
					<Section className='text-center mb-8'>
						<Heading className='text-2xl font-bold'>
							Восстановление пароля
						</Heading>
						<Text className='text-lg'>
							Для сброса пароля перейдите по ссылке ниже
						</Text>
						<Link
							href={resetLink}
							className='inline-flex px-5 py-2 justify-center items-center rounded-lg bg-sky-500 font-medium text-lg text-white'
						>
							Сбросить пароль
						</Link>
					</Section>
					<MetadataTemplate metadata={metadata} />
				</Body>
			</Tailwind>
		</Html>
	)
}
