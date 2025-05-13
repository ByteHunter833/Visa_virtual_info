import { Layout } from 'antd'
import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutContent from './components/Layout/LayoutContent'
import LayoutFooter from './components/Layout/LayoutFooter'
import LayoutHeader from './components/Layout/LayoutHeader'
import CountryDetail from './components/ui/CountryDetail'
import { footerData } from './components/Layout/LayoutFooter'

function App() {
	// Используем localStorage для хранения выбранного языка
	const [language, setLanguage] = useState(() => {
		// Получаем сохраненный язык из localStorage или используем значение по умолчанию
		return localStorage.getItem('selectedLanguage') || 'uz'
	})

	// Сохраняем язык в localStorage при его изменении
	useEffect(() => {
		localStorage.setItem('selectedLanguage', language)
		document.title = footerData[language]
	}, [language])

	// Функция для изменения языка, которую мы передадим в Header
	const handleLanguageChange = newLanguage => {
		setLanguage(newLanguage)
	}

	return (
		<BrowserRouter>
			<Layout>
				<LayoutHeader
					language={language}
					onLanguageChange={handleLanguageChange}
				/>
				<Layout>
					<Routes>
						<Route path='/' element={<LayoutContent language={language} />} />
						<Route
							path='/country/:code'
							element={<CountryDetail language={language} />}
						/>
					</Routes>
					<LayoutFooter language={language} />
				</Layout>
			</Layout>
		</BrowserRouter>
	)
}

export default App
