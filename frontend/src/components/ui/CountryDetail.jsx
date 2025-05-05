import { ArrowLeftOutlined } from '@ant-design/icons'
import {
	Breadcrumb,
	Button,
	Card,
	Descriptions,
	Layout,
	Typography,
} from 'antd'
import React from 'react'
import { Link, useParams } from 'react-router-dom'

// Импортируем данные о странах
import { countryData, countryFlags } from '../../data'

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
	fontSize: '42px',
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
	},
}

const CountryDetail = ({ language }) => {
	// Получаем код страны из URL параметра
	const { code } = useParams()

	// Находим данные страны по коду
	const country = countryData.find(c => c.code === code)

	// Получение локализованных данных
	const getCountryName = () => {
		if (!country) return ''
		switch (language) {
			case 'uz':
				return country.nameUz
			case 'ru':
				return country.nameRu
			default:
				return country.nameEn
		}
	}

	const getVisaInfo = () => {
		if (!country) return ''
		switch (language) {
			case 'uz':
				return country.visaInfoUz
			case 'ru':
				return country.visaInfoRu
			default:
				return country.visaInfoEn
		}
	}

	const getLegalBasis = () => {
		if (!country) return ''
		switch (language) {
			case 'uz':
				return country.legalBasisUz
			case 'ru':
				return country.legalBasisRu
			default:
				return country.legalBasisEn
		}
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
					{ title: getCountryName() },
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
						<div style={flagStyle}>{countryFlags[country.code]}</div>
						<div>
							<div>{country.code}</div>
							<Title level={3} style={{ margin: 0 }}>
								{getCountryName()}
							</Title>
						</div>
					</div>
				}
			>
				<Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold' }}>
					<Descriptions.Item label={uiTexts[language].country}>
						{getCountryName()}
					</Descriptions.Item>

					<Descriptions.Item label={uiTexts[language].visaInfo}>
						{getVisaInfo()}
					</Descriptions.Item>

					<Descriptions.Item label={uiTexts[language].legalBasis}>
						{getLegalBasis()}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Content>
	)
}

export default CountryDetail
