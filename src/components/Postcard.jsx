import html2canvas from 'html2canvas'
import React, { useRef, useState } from 'react'

function Postcard({
	backgroundImage,
	overlayOpacity = 0.3,
	text,
	className = '',
	fixedBackground = true,
	showDownloadButton = true,
	downloadFileName = 'postcard',
	children,
	onDownloadComplete, // Колбэк после скачивания
}) {
	const postcardRef = useRef(null)
	const [isDownloading, setIsDownloading] = useState(false)

	const backgroundStyles = {
		backgroundImage: `linear-gradient(rgba(0, 0, 0, ${overlayOpacity}), rgba(0, 0, 0, ${overlayOpacity})), url(${backgroundImage})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundAttachment: fixedBackground ? 'fixed' : 'scroll',
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
			const fileName = `${downloadFileName}-${Date.now()}.png`
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
			<div
				ref={postcardRef}
				style={backgroundStyles}
				className={`relative ${className}`}
			>
				<div className='p-8 min-h-screen flex flex-col justify-center'>
					{typeof text === 'string' ? (
						<div className='text-white text-center'>
							<h1 className='text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg'>
								{text}
							</h1>
						</div>
					) : (
						text
					)}
					{children}
				</div>
			</div>

			{showDownloadButton && (
				<button
					onClick={handleDownload}
					disabled={isDownloading}
					className='download-button'
					aria-label='Скачать открытку'
				>
					{isDownloading ? (
						<span className='flex items-center gap-2'>
							<Spinner />
							Создание...
						</span>
					) : (
						<span className='flex items-center gap-2'>
							<DownloadIcon />
							Скачать открытку
						</span>
					)}
				</button>
			)}
		</div>
	)
}

// Выносим иконки в отдельные компоненты
const Spinner = () => (
	<svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
		<circle
			className='opacity-25'
			cx='12'
			cy='12'
			r='10'
			stroke='currentColor'
			strokeWidth='4'
			fill='none'
		/>
		<path
			className='opacity-75'
			fill='currentColor'
			d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
		/>
	</svg>
)

const DownloadIcon = () => (
	<svg
		className='w-5 h-5'
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
		/>
	</svg>
)

export default Postcard
