import { SearchOutlined } from '@ant-design/icons'
import { Button, Card, Col, Empty, Input, Row, Spin, message } from 'antd'
import Layout from 'antd/es/layout/layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const contentStyle = {
	padding: '20px',
	minHeight: 'calc(100vh - 120px)',
	backgroundColor: '#f0f2f5',
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
	width: '20px',
	height: '20px',
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

const showMoreButtonStyle = {
	display: 'block',
	margin: '20px auto',
}

export default function LayoutContent({ language }) {
	const [searchQuery, setSearchQuery] = useState('')
	const [countries, setCountries] = useState([])
	const [loading, setLoading] = useState(false)
	const [visibleCount, setVisibleCount] = useState(6) // Показываем 6 карточек по умолчанию

	// Тексты для интерфейса
	const uiTexts = {
		uz: {
			title: "Viza ma'lumotlari portali",
			search: "Davlat kodi yoki nomi bo'yicha qidirish",
			legalBasis: 'Asos',
			noResults: "Hech qanday ma'lumot topilmadi",
			languageSelect: 'Tilni tanlang',
			viewMore: "Batafsil ko'rish",
			showMore: "Ko'proq ko'rsatish",
			error: "Ma'lumotlarni yuklashda xatolik yuz berdi",
		},
		ru: {
			title: 'Портал визовой информации',
			search: 'Поиск по коду или названию страны',
			legalBasis: 'Основание',
			noResults: 'Информация не найдена',
			languageSelect: 'Выберите язык',
			viewMore: 'Подробнее',
			showMore: 'Показать больше',
			error: 'Ошибка при загрузке данных',
		},
		en: {
			title: 'Visa Information Portal',
			search: 'Search by country code or name',
			legalBasis: 'Legal Basis',
			noResults: 'No information found',
			languageSelect: 'Select language',
			viewMore: 'View details',
			showMore: 'Show more',
			error: 'Error loading data',
		},
	}

	// Загрузка данных с API
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const apiLang =
					language === 'ru' ? 'rus' : language === 'uz' ? 'uzb' : null
				if (!apiLang) {
					setCountries([])
					setLoading(false)
					return
				}

				const response = await axios.get(
					`https://visa-virtual-info-1.onrender.com/visa_regimes?lang=${apiLang}`
				)
				setCountries(response.data)
			} catch (error) {
				message.error(uiTexts[language].error)
				console.error('Error fetching data:', error)
				setCountries([])
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [language])

	// Фильтрация стран на основе поискового запроса
	const filteredCountries = countries.filter(country => {
		const query = searchQuery.toLowerCase()
		if (!query) return true
		return (
			country.country_code.toLowerCase().includes(query) ||
			country.country_name.toLowerCase().includes(query)
		)
	})

	// Показываем только visibleCount карточек
	const visibleCountries = filteredCountries.slice(0, visibleCount)

	// Обработчик кнопки "Показать больше"
	const handleShowMore = () => {
		setVisibleCount(prev => prev + 6) // Показываем ещё 6 карточек
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

			{/* Индикатор загрузки или карточки стран */}
			{loading ? (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<Spin size='large' />
				</div>
			) : (
				<Row gutter={[16, 16]}>
					{visibleCountries.length > 0 ? (
						visibleCountries.map(country => (
							<Col xs={24} sm={12} lg={8} key={country.country_code}>
								<Link
									to={`/country/${country.country_code}`}
									style={{ textDecoration: 'none' }}
								>
									<Card bordered={false} style={countryCardStyle} hoverable>
										<div style={countryHeaderStyle}>
											<div style={countryCodeStyle}>
												{country.flag_url ? (
													<img
														src={country.flag_url}
														alt={`${country.country_code} flag`}
														style={countryFlagStyle}
													/>
												) : (
													<span style={countryFlagStyle}>🌐</span>
												)}
												{country.country_code}
											</div>
											<div style={countryNameStyle}>{country.country_name}</div>
										</div>

										<div>
											<div>{country.visa_policy}</div>
											<div style={legalBasisStyle}>
												<strong>***{uiTexts[language].legalBasis}***:</strong>{' '}
												{country.visa_policy.substring(0, 100)}
												{country.visa_policy.length > 100 ? '...' : ''}
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
			)}

			{/* Кнопка "Показать больше" */}
			{!loading && visibleCount < filteredCountries.length && (
				<Button
					type='primary'
					style={showMoreButtonStyle}
					onClick={handleShowMore}
				>
					{uiTexts[language].showMore}
				</Button>
			)}
		</Layout.Content>
	)
}
