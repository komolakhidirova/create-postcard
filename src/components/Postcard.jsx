import html2canvas from 'html2canvas'
import React, { useRef, useState } from 'react'

function Postcard({ backgroundImage, text, onDownloadComplete }) {
	const postcardRef = useRef(null)
	const [isDownloading, setIsDownloading] = useState(false)

	const backgroundStyles = {
		backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: 'fixed',
		minHeight: '100vh',
	}

	const handleDownload = async () => {
		if (!postcardRef.current) return

		setIsDownloading(true)
		try {
			const canvas = await html2canvas(postcardRef.current, {
				useCORS: true,
				backgroundColor: null,
				scale: 2,
				logging: false,
			})

			const link = document.createElement('a')
			const fileName = `postcard-${Date.now()}.png`
			link.download = fileName
			link.href = canvas.toDataURL('image/png')
			link.click()

			// Оповещаем App о скачивании
			if (onDownloadComplete) {
				onDownloadComplete(fileName)
			}
		} catch (error) {
			console.error('Ошибка:', error)
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<div className='relative postcard-container'>
			<div ref={postcardRef} style={backgroundStyles} className={`relative `}>
				<div className='p-8 min-h-screen flex flex-col justify-center'>
					<div className='text-white text-center'>
						<h1 className='text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg'>
							{text}
						</h1>
					</div>
				</div>
			</div>

			<button
				onClick={handleDownload}
				disabled={isDownloading}
				className='download-button'
				aria-label='Скачать открытку'
			>
				{isDownloading ? (
					<span className='flex items-center gap-2'>Создание...</span>
				) : (
					<span className='flex items-center gap-2'>Скачать открытку</span>
				)}
			</button>
		</div>
	)
}

export default Postcard
