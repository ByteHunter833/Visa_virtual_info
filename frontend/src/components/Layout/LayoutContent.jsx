import { SearchOutlined } from '@ant-design/icons'
import { Card, Col, Empty, Input, Row } from 'antd'
import Layout from 'antd/es/layout/layout'
import { useState } from 'react'

// Флаги стран
const countryFlags = {
	AUS: '🇦🇺',
	JPN: '🇯🇵',
	TUR: '🇹🇷',
	ALB: '🇦🇱',
	AND: '🇦🇩',
	// Добавьте другие флаги по необходимости
}

// Данные о странах
const countryData = [
	{
		code: 'AUS',
		nameUz: 'Avstraliya ittifoqi',
		nameRu: 'Австралийский Союз',
		nameEn: 'Commonwealth of Australia',
		visaInfoUz:
			'01.02.2019 yildan boshlab 30 kungacha bir tomonlama vizasiz rejim.',
		visaInfoRu:
			'с 01.02. 2019 года односторонний безвизовый режим до 30 суток.',
		visaInfoEn:
			'Unilateral visa-free regime for up to 30 days from 01.02.2019.',
		legalBasisUz:
			"O'zbekiston Respublikasi Prezidentining 05.01.2019 yildagi PF-5611 sonli farmoni va O'zbekiston Respublikasi Vazirlar Maxkamasining 21.11.1996 yildagi 408-sonli Qarori.",
		legalBasisRu:
			'Постановление Президента Республики Узбекистан № ПП-5611 от 05.01.2019 года и Постановление Кабинета Министров Республики Узбекистана № 408 от 21.11.1996 года.',
		legalBasisEn:
			'Decree of the President of the Republic of Uzbekistan No. PF-5611 dated 05.01.2019 and Resolution No. 408 of the Cabinet of Ministers of the Republic of Uzbekistan dated 21.11.1996.',
	},
	{
		code: 'JPN',
		nameUz: 'Yaponiya',
		nameRu: 'Япония',
		nameEn: 'Japan',
		visaInfoUz: '10.01.2018 yildan boshlab 30 kungacha vizasiz rejim.',
		visaInfoRu: 'с 10.01.2018 года безвизовый режим до 30 суток.',
		visaInfoEn: 'Visa-free regime for up to 30 days from 10.01.2018.',
		legalBasisUz:
			"O'zbekiston va Yaponiya o'rtasidagi ikki tomonlama kelishuv.",
		legalBasisRu: 'Двустороннее соглашение между Узбекистаном и Японией.',
		legalBasisEn: 'Bilateral agreement between Uzbekistan and Japan.',
	},
	{
		code: 'TUR',
		nameUz: 'Turkiya Respublikasi',
		nameRu: 'Турецкая Республика',
		nameEn: 'Republic of Türkiye',
		visaInfoUz: '15.03.2020 yildan boshlab 90 kungacha vizasiz rejim.',
		visaInfoRu: 'с 15.03.2020 года безвизовый режим до 90 суток.',
		visaInfoEn: 'Visa-free regime for up to 90 days from 15.03.2020.',
		legalBasisUz: "O'zbekiston va Turkiya o'rtasidagi ikki tomonlama kelishuv.",
		legalBasisRu: 'Двустороннее соглашение между Узбекистаном и Турцией.',
		legalBasisEn:
			'Starting from February 1, 2019, entry is allowed for up to 30 days with an electronic visa (e-visa.gov.uz)',
	},
	{
		code: 'ALB',
		nameUz: 'Albaniya Respublikasi',
		nameRu: 'Республика Албания',
		nameEn: 'Republic of Albania',
		visaInfoUz:
			'01.02.2019 yildan 30 kungacha elektron kirish vizasi bilan (e-viza.gov.uz).',
		visaInfoRu:
			'с 01.02.2019 года до 30 суток с электронной въездной визой (e-viza.gov.uz). ',
		visaInfoEn:
			'Starting from February 1, 2019, entry is allowed for up to 30 days with an electronic visa (e-visa.gov.uz).',
		legalBasisUz: `O’zbekiston Respublikasi Prezidentining 05.01.2019 yildagi PF-5611 sonli farmoni.`,
		legalBasisRu: `Постановление Президента Республики Узбекистан 
№ ПП-5611 от 05.01.2019 года. `,
		legalBasisEn:
			'According to the Presidential Decree of the Republic of Uzbekistan No. PF-5611 dated January 5, 2019',
	},
	{
		code: 'AND',
		nameUz: 'Andorra knyazligi',
		nameRu: 'Андорра',
		nameEn: 'Andorra',
		visaInfoUz:
			'01.02.2019 yildan boshlab 30 kungacha bir tomonlama vizasiz rejim.',
		visaInfoRu:
			'с 01.02. 2019 года односторонний безвизовый режим до 30 суток.',
		visaInfoEn:
			'Starting from February 1, 2019, a unilateral visa-free regime for up to 30 days is established.',
		legalBasisUz:
			'O’zbekiston Respublikasi Prezidentining 05.01.2019 yildagi PF-5611 sonli farmoni va O‘zbekiston Respublikasi Vazirlar Maxkamasining 21.11.1996 yildagi 408-sonli Qarori.',
		legalBasisRu: `Постановление Президента Республики Узбекистан 
№ ПП-5611 от 05.01.2019 года и Постановление Кабинета Министров Республики Узбекистана № 408 от 21.11.1996 года.`,
		legalBasisEn:
			'According to the Presidential Decree of the Republic of Uzbekistan No. PF-5611 dated January 5, 2019, and the Resolution of the Cabinet of Ministers of the Republic of Uzbekistan No. 408 dated November 21, 1996',
	},
]

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
							<Card bordered={false} style={countryCardStyle} hoverable>
								<div style={countryHeaderStyle}>
									<div style={countryCodeStyle}>
										<span style={countryFlagStyle}>
											{countryFlags[country.code]}
										</span>
										{country.code}
									</div>
									<div style={countryNameStyle}>{getCountryName(country)}</div>
								</div>

								<div>
									<div>{getVisaInfo(country)}</div>
									<div style={legalBasisStyle}>
										<strong>***{uiTexts[language].legalBasis}***:</strong>{' '}
										{getLegalBasis(country)}
									</div>
								</div>
							</Card>
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
