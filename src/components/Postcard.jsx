import html2canvas from 'html2canvas'
import React, { useRef, useState } from 'react'

function Postcard({ backgroundImage, text, onDownloadComplete }) {
	const postcardRef = useRef(null)
	const [isDownloading, setIsDownloading] = useState(false)

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
					rounded-xl 
					shadow-2xl 
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
					<div className=' text-center max-w-3xl mx-auto bg-white/70 p-10 rounded-xl'>
						<h1
							className='
							text-2xl sm:text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg  underline text-blue-800 italic'
						>
							{text}
						</h1>
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
