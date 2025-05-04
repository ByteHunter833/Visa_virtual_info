import { Layout } from 'antd'
import React, { useState, useEffect } from 'react'
import LayoutContent from './components/Layout/LayoutContent'
import LayoutFooter from './components/Layout/LayoutFooter'
import LayoutHeader from './components/Layout/LayoutHeader'
import { footerData } from './components/Layout/LayoutFooter'
function App() {
	// Используем localStorage для хранения выбранного языка
	const [language, setLanguage] = useState(() => {
		// Получаем сохраненный язык из localStorage или используем значение по умолчанию
		return localStorage.getItem('selectedLanguage') || 'en'
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
		<>
			<Layout>
				<LayoutHeader
					language={language}
					onLanguageChange={handleLanguageChange}
				/>
				<Layout>
					<LayoutContent language={language} />
					<LayoutFooter language={language} />
				</Layout>
			</Layout>
		</>
	)
}

export default App
