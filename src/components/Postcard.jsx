import { toPng } from 'html-to-image'
import React, { useRef, useState } from 'react'

function Postcard({ backgroundImage, text, from, to, onDownloadComplete }) {
	const postcardRef = useRef(null)
	const [isDownloading, setIsDownloading] = useState(false)

	const handleDownload = async () => {
		if (!postcardRef.current) return

		setIsDownloading(true)
		try {
			const dataUrl = await toPng(postcardRef.current, {
				quality: 1.0,
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
			console.error('Error:', error)
		} finally {
			setIsDownloading(false)
		}
	}

	return (
		<div className='flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8'>
			<div ref={postcardRef} className='postcard-outer-frame'>
				<div className='postcard'>
					<div className='relative h-full w-full'>
						<div className='postcard-stamp-container'>
							<img src='/stamp.png' className='w-40 md:w-60 max-sm:w-21' />
						</div>
						<div
							className='postcard-bg-image'
							style={{
								backgroundImage: `url(${backgroundImage})`,
							}}
						/>

						<div className='h-full w-full flex flex-col justify-start items-start relative z-10 '>
							<div className='postcard-text-container'>
								<h1 className='postcard-text'>{text}</h1>
							</div>
							<div className='postcard-info-container'>
								<p className='underline max-sm:mb-2'>
									From:
									<span> {from}</span>
								</p>
								<p className='underline'>
									To:
									<span> {to}</span>
								</p>
							</div>
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
				{isDownloading ? <p>Downloading...</p> : <p>Download Postcard</p>}
			</button>
		</div>
	)
}

export default Postcard
