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

export function AccountDeletionTemplate({ domain }: { domain: string }) {
	const registerLink = `https://${domain}/account/register`
	return (
		<Html>
			<Head />
			<Preview>Аккаунт удален</Preview>

			<Tailwind>
				<Body className='p-6 max-w-2xl mx-auto bg-slate-50 text-black!'>
					<Section className='text-center mb-8'>
						<Heading className='text-2xl font-bold'>
							Ваш аккаунт полностью удален
						</Heading>
						<Text className='text-lg'>
							Вы больше не будете получать уведомления на почту и в Telegram
						</Text>
						<Text>Если снова захотите вернуться - мы всегда вам рады</Text>
						<Link href={registerLink}>Зарегистрироваться на Twixi</Link>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	)
}
