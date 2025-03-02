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

interface IVerificationTemplateProps {
	domain: string
	token: string
}

export function VerificationTemplate({
	domain,
	token
}: IVerificationTemplateProps) {
	const verfificationLink = `${domain}/account/verify?token=${token}`

	return (
		<Html>
			<Head />
			<Preview>Верификация электронной почты</Preview>

			<Tailwind>
				<Body className='p-6 max-w-2xl mx-auto bg-slate-50 text-black'>
					<Section className='text-center mb-4'>
						<Heading className='text-2xl font-bold'>
							Благодарим вас за регистрацию в нашем сервисе!
						</Heading>
						<Text className='text-lg'>
							Для подтверждения вашей электронной почты, пожалуйста, перейдите
							по ссылке ниже.
						</Text>
						<Link
							href={verfificationLink}
							className='inline-flex px-5 py-2 justify-center items-center rounded-lg bg-sky-500 font-medium text-lg text-white'
						>
							Подтведить почту
						</Link>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
