import { ArrowLeftOutlined } from '@ant-design/icons'
import {
	Breadcrumb,
	Button,
	Card,
	Descriptions,
	Layout,
	Spin,
	Typography,
	message,
} from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const { Content } = Layout
const { Title } = Typography

// Стили
const contentStyle = {
	padding: '20px',
	minHeight: 'calc(100vh - 120px)',
	backgroundColor: '#f0f2f5',
}

const cardStyle = {
	boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
	maxWidth: '800px',
	margin: '0 auto',
	borderRadius: '6px',
}

const headerStyle = {
	display: 'flex',
	alignItems: 'center',
	marginBottom: '24px',
}

const flagStyle = {
	width: '42px',
	height: '42px',
	marginRight: '16px',
}

const backButtonStyle = {
	marginBottom: '16px',
}

// Тексты для интерфейса на разных языках
const uiTexts = {
	uz: {
		back: 'Orqaga',
		title: "Viza ma'lumotlari",
		info: "Ma'lumot",
		legalBasis: 'Huquqiy asos',
		country: 'Davlat',
		visaInfo: 'Viza rejimi',
		notFound: 'Davlat topilmadi',
		home: 'Bosh sahifa',
		countryDetails: 'Davlat haqida batafsil',
		error: "Ma'lumotlarni yuklashda xatolik yuz berdi",
	},
	ru: {
		back: 'Назад',
		title: 'Визовая информация',
		info: 'Информация',
		legalBasis: 'Правовая основа',
		country: 'Страна',
		visaInfo: 'Визовый режим',
		notFound: 'Страна не найдена',
		home: 'Главная',
		countryDetails: 'Детали о стране',
		error: 'Ошибка при загрузке данных',
	},
	en: {
		back: 'Back',
		title: 'Visa Information',
		info: 'Information',
		legalBasis: 'Legal Basis',
		country: 'Country',
		visaInfo: 'Visa Regime',
		notFound: 'Country not found',
		home: 'Home',
		countryDetails: 'Country Details',
		error: 'Error loading data',
	},
}

const CountryDetail = ({ language }) => {
	const { code } = useParams()
	const [country, setCountry] = useState(null)
	const [loading, setLoading] = useState(false)

	// Загрузка данных с API
	useEffect(() => {
		const fetchCountryData = async () => {
			setLoading(true)
			try {
				const apiLang =
					language === 'ru' ? 'rus' : language === 'uz' ? 'uz' : null
				if (!apiLang) {
					setCountry(null)
					setLoading(false)
					message.warning(uiTexts[language].notFound)
					return
				}

				const response = await axios.get(
					`http://localhost:5000/visa_regimes/${code}?lang=${apiLang}`
				)
				setCountry(response.data)
			} catch (error) {
				message.error(uiTexts[language].error)
				console.error('Error fetching country data:', error)
				setCountry(null)
			} finally {
				setLoading(false)
			}
		}

		fetchCountryData()
	}, [code, language])

	// Если данные загружаются
	if (loading) {
		return (
			<Content style={contentStyle}>
				<Button
					icon={<ArrowLeftOutlined />}
					style={backButtonStyle}
					type='primary'
				>
					<Link to='/'>{uiTexts[language].back}</Link>
				</Button>
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<Spin size='large' />
				</div>
			</Content>
		)
	}

	// Если страна не найдена
	if (!country) {
		return (
			<Content style={contentStyle}>
				<Button
					icon={<ArrowLeftOutlined />}
					style={backButtonStyle}
					type='primary'
				>
					<Link to='/'>{uiTexts[language].back}</Link>
				</Button>
				<Card style={cardStyle}>
					<Title level={3}>{uiTexts[language].notFound}</Title>
				</Card>
			</Content>
		)
	}

	return (
		<Content style={contentStyle}>
			{/* Хлебные крошки */}
			<Breadcrumb
				style={{ marginBottom: '16px' }}
				items={[
					{ title: <Link to='/'>{uiTexts[language].home}</Link> },
					{ title: uiTexts[language].countryDetails },
					{ title: country.country_name },
				]}
			/>

			{/* Кнопка назад */}
			<Button
				icon={<ArrowLeftOutlined />}
				style={backButtonStyle}
				type='primary'
			>
				<Link to='/'>{uiTexts[language].back}</Link>
			</Button>

			{/* Детальная карточка страны */}
			<Card
				style={cardStyle}
				title={
					<div style={headerStyle}>
						<div style={flagStyle}>
							{country.flag_url ? (
								<img
									src={country.flag_url}
									alt={`${country.country_code} flag`}
									style={flagStyle}
								/>
							) : (
								<span style={flagStyle}>🌐</span>
							)}
						</div>
						<div>
							<div>{country.country_code}</div>
							<Title level={3} style={{ margin: 0 }}>
								{country.country_name}
							</Title>
						</div>
					</div>
				}
			>
				<Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
					<Descriptions.Item label={uiTexts[language].country}>
						{country.country_name}
					</Descriptions.Item>
					<Descriptions.Item label={uiTexts[language].visaInfo}>
						{country.visa_policy}
					</Descriptions.Item>
					<Descriptions.Item label={uiTexts[language].legalBasis}>
						{country.visa_policy}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Content>
	)
}

export default CountryDetail
