import Layout from 'antd/es/layout/layout'
const footerStyle = {
	textAlign: 'center',
	color: '#fff',
	backgroundColor: 'black',
}
export const footerData = {
	uz: " Viza ma'lumotlari portali",
	en: 'Visa Information Portal',
	ru: ' Портал визовой информации',
}
export default function LayoutFooter({ language }) {
	return (
		<Layout.Footer
			style={footerStyle}
		>{`@2025 ${footerData[language]}`}</Layout.Footer>
	)
}
