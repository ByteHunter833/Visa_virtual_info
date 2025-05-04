import { Select } from 'antd'
import Layout from 'antd/es/layout/layout'

const headerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	color: '#fff',
	height: 60,
	paddingInline: 48,
	backgroundColor: '#0C2D6B', // Темно-синий как в прежнем дизайне
	boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}

const titleStyle = {
	margin: 0,
	fontSize: '20px',
	fontWeight: 'bold',
}

const flagStyle = {
	marginRight: '6px',
}

export default function LayoutHeader({ language, onLanguageChange }) {
	const uiTexts = {
		uz: {
			title: "Viza ma'lumotlari portali",
			search: "Davlat kodi yoki nomi bo'yicha qidirish",
			legalBasis: 'Asos',
			noResults: "Hech qanday ma'lumot topilmadi",
			languageSelect: 'Tilni tanlang',
		},
		ru: {
			title: 'Портал визовой информации',
			search: 'Поиск по коду или названию страны',
			legalBasis: 'Основание',
			noResults: 'Информация не найдена',
			languageSelect: 'Выберите язык',
		},
		en: {
			title: 'Visa Information Portal',
			search: 'Search by country code or name',
			legalBasis: 'Legal Basis',
			noResults: 'No information found',
			languageSelect: 'Select language',
		},
	}

	const handleLanguageChange = value => {
		// Вызываем родительскую функцию для обновления языка в App
		onLanguageChange(value)
	}

	return (
		<Layout.Header style={headerStyle}>
			<h1 style={titleStyle}>{uiTexts[language].title}</h1>

			<div>
				<span style={{ marginRight: '10px', fontSize: '14px' }}>
					{uiTexts[language].languageSelect}:
				</span>
				<Select
					value={language}
					onChange={handleLanguageChange}
					style={{ width: 150 }}
					options={[
						{
							value: 'uz',
							label: (
								<span>
									<span style={flagStyle}>🇺🇿</span> O'zbekcha
								</span>
							),
						},
						{
							value: 'ru',
							label: (
								<span>
									<span style={flagStyle}>🇷🇺</span> Русский
								</span>
							),
						},
						{
							value: 'en',
							label: (
								<span>
									<span style={flagStyle}>🇬🇧</span> English
								</span>
							),
						},
					]}
				/>
			</div>
		</Layout.Header>
	)
}
