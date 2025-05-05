import { SearchOutlined } from '@ant-design/icons'
import { Card, Col, Empty, Input, Row } from 'antd'
import Layout from 'antd/es/layout/layout'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Импортируем данные из отдельного файла
import { countryData, countryFlags } from '../../data'

const contentStyle = {
	padding: '20px',
	minHeight: 'calc(100vh - 120px)', // 60px header + 60px footer
	backgroundColor: '#f0f2f5', // Светло-серый фон как в типичном Ant Design
}

const searchContainerStyle = {
	maxWidth: '600px',
	margin: '0 auto 30px auto',
}

const countryCardStyle = {
	boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
	transition: 'all 0.3s ease',
	height: '100%',
	borderRadius: '6px',
	overflow: 'hidden',
	cursor: 'pointer',
}

const countryHeaderStyle = {
	display: 'flex',
	borderBottom: '1px solid #e8e8e8',
	marginBottom: '12px',
}

const countryCodeStyle = {
	backgroundColor: '#000',
	color: '#fff',
	padding: '8px 12px',
	fontWeight: 'bold',
	fontSize: '16px',
	display: 'flex',
	alignItems: 'center',
}

const countryFlagStyle = {
	marginRight: '8px',
	fontSize: '20px',
}

const countryNameStyle = {
	backgroundColor: '#e6e6e6',
	padding: '8px 12px',
	fontWeight: '500',
	flex: 1,
}

const legalBasisStyle = {
	fontSize: '13px',
	fontStyle: 'italic',
	marginTop: '10px',
}

const viewMoreStyle = {
	textAlign: 'right',
	marginTop: '12px',
	color: '#1890ff',
	fontWeight: '500',
}

export default function LayoutContent({ language }) {
	const [searchQuery, setSearchQuery] = useState('')

	// Тексты для элементов интерфейса на разных языках
	const uiTexts = {
		uz: {
			title: "Viza ma'lumotlari portali",
			search: "Davlat kodi yoki nomi bo'yicha qidirish",
			legalBasis: 'Asos',
			noResults: "Hech qanday ma'lumot topilmadi",
			languageSelect: 'Tilni tanlang',
			viewMore: "Batafsil ko'rish",
		},
		ru: {
			title: 'Портал визовой информации',
			search: 'Поиск по коду или названию страны',
			legalBasis: 'Основание',
			noResults: 'Информация не найдена',
			languageSelect: 'Выберите язык',
			viewMore: 'Подробнее',
		},
		en: {
			title: 'Visa Information Portal',
			search: 'Search by country code or name',
			legalBasis: 'Legal Basis',
			noResults: 'No information found',
			languageSelect: 'Select language',
			viewMore: 'View details',
		},
	}

	// Фильтрация стран на основе поискового запроса
	const filteredCountries = countryData.filter(country => {
		const query = searchQuery.toLowerCase()
		if (!query) return true

		const nameField = `name${
			language.charAt(0).toUpperCase() + language.slice(1)
		}`
		return (
			country.code.toLowerCase().includes(query) ||
			country[nameField].toLowerCase().includes(query)
		)
	})

	// Получение названия страны на основе текущего языка
	const getCountryName = country => {
		switch (language) {
			case 'uz':
				return country.nameUz
			case 'ru':
				return country.nameRu
			default:
				return country.nameEn
		}
	}

	// Получение информации о визе на основе текущего языка
	const getVisaInfo = country => {
		switch (language) {
			case 'uz':
				return country.visaInfoUz
			case 'ru':
				return country.visaInfoRu
			default:
				return country.visaInfoEn
		}
	}

	// Получение юридического основания на основе текущего языка
	const getLegalBasis = country => {
		switch (language) {
			case 'uz':
				return country.legalBasisUz
			case 'ru':
				return country.legalBasisRu
			default:
				return country.legalBasisEn
		}
	}

	return (
		<Layout.Content style={contentStyle}>
			{/* Поле поиска */}
			<div style={searchContainerStyle}>
				<Input
					size='large'
					placeholder={uiTexts[language].search}
					prefix={<SearchOutlined />}
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					allowClear
				/>
			</div>

			{/* Карточки стран */}
			<Row gutter={[16, 16]}>
				{filteredCountries.length > 0 ? (
					filteredCountries.map(country => (
						<Col xs={24} sm={12} lg={8} key={country.code}>
							<Link
								to={`/country/${country.code}`}
								style={{ textDecoration: 'none' }}
							>
								<Card bordered={false} style={countryCardStyle} hoverable>
									<div style={countryHeaderStyle}>
										<div style={countryCodeStyle}>
											<span style={countryFlagStyle}>
												{countryFlags[country.code]}
											</span>
											{country.code}
										</div>
										<div style={countryNameStyle}>
											{getCountryName(country)}
										</div>
									</div>

									<div>
										<div>{getVisaInfo(country)}</div>
										<div style={legalBasisStyle}>
											<strong>***{uiTexts[language].legalBasis}***:</strong>{' '}
											{getLegalBasis(country).substring(0, 100)}
											{getLegalBasis(country).length > 100 ? '...' : ''}
										</div>
										<div style={viewMoreStyle}>
											{uiTexts[language].viewMore} →
										</div>
									</div>
								</Card>
							</Link>
						</Col>
					))
				) : (
					<Col span={24} style={{ textAlign: 'center', padding: '40px 0' }}>
						<Empty description={uiTexts[language].noResults} />
					</Col>
				)}
			</Row>
		</Layout.Content>
	)
}
