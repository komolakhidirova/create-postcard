import { toPng } from 'html-to-image'
import React, { useRef, useState } from 'react'

function Postcard({ backgroundImage, text, onDownloadComplete }) {
	const postcardRef = useRef(null)
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownload = async () => {
		if (!postcardRef.current) return

		setIsDownloading(true)
		try {
			const dataUrl = await toPng(postcardRef.current, {
				quality: 1.0,
				backgroundColor: '#ffffff',
				skipFonts: true,
				cacheBust: true,
			})

			const link = document.createElement('a')
			const fileName = `postcard-${Date.now()}.png`
			link.download = fileName
			link.href = dataUrl
			link.click()

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
		<div className='flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 '>
			<div
				ref={postcardRef}
				className='
					relative 
					w-full 
					max-w-4xl 
					h-[300px] 
					sm:h-[400px] 
					md:h-[500px] 
					lg:h-[600px]
					overflow-hidden
					bg-cover 
					bg-center 
					bg-no-repeat 
				'
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgroundImage})`,
				}}
			>
				<div className='p-4 sm:p-6 md:p-8 h-full flex flex-col justify-center items-center'>
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
							background:
								'repeating-linear-gradient(45deg, #C54540, #C54540 10px, #FFFFFF 10px, #FFFFFF 20px, #37877A 20px, #37877A 30px, #FFFFFF 30px, #FFFFFF 40px)',
							padding: '10px',
							borderRadius: '20px',
						}}
					>
						<div className='max-w-3xl mx-auto bg-white p-5 md:p-10 rounded-xl'>
							<h1
								className='
							text-xl md:text-3xl font-bold text-blue-800 italic'
							>
								{text}
							</h1>
						</div>
					</div>
				</div>
			</div>

			<button
				onClick={handleDownload}
				disabled={isDownloading}
				className='
					download-btn
				'
				aria-label='Скачать открытку'
			>
				{isDownloading ? (
					<span>Downloading...</span>
				) : (
					<span>Download Postcard</span>
				)}
			</button>
		</div>
	)
}

export default Postcard
