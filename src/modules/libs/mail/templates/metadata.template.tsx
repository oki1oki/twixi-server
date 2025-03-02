import { Heading, Section, Text } from '@react-email/components'
import * as React from 'react'
import type { SessionMetadata } from 'src/shared/utils/types/session-metadata.type'

interface IMetadataTemplateProps {
	metadata: SessionMetadata
}

export function MetadataTemplate({ metadata }: IMetadataTemplateProps) {
	return (
		<Section className='bg-gray-100 px-6 py-4'>
			<Heading className='text-xl font-semibold'>Информация о запросе:</Heading>
			<ul className='list-disc list-inside mt-2 pl-3'>
				<li>
					🌍 Расположение: {metadata.location.country}, {metadata.location.city}
				</li>
				<li>
					📱 Операционная система: {metadata.device.os.name}{' '}
					{metadata.device.os.version}
				</li>
				<li>🌐 Браузер: {metadata.device.browser.name}</li>
				<li>📝 IP-адрес: {metadata.ip}</li>
			</ul>
			<Text className='text-gray-800 mt-1'>
				Если вы не иницииализировали этот запрос, игнорируйте это сообщение
			</Text>
		</Section>
	)
}
