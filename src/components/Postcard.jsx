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
			<div
				ref={postcardRef}
				className='relative w-full max-w-4xl h-[300px] max-sm:h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] postcard-outer-frame'
			>
				<div className='absolute inset-2.5 max-sm:inset-1.5 overflow-hidden rounded-[10px]'>
					<div className='relative h-full w-full'>
						<div className='absolute top-0 right-0 z-10'>
							<img src='/stamp.png' className='w-40 md:w-60 max-sm:w-25' />
						</div>
						<div
							className='absolute inset-0 bg-cover bg-center bg-no-repeat'
							style={{
								backgroundImage: `url(${backgroundImage})`,
							}}
						/>

						<div className='h-full w-full flex flex-col justify-start items-start relative z-10 '>
							<div className='max-w-sm m-10 max-sm:m-2  max-sm:max-w-35 bg-white p-5 md:p-10 max-sm:p-3 rounded-sm border-2 border-dashed border-blue-950'>
								<h1 className='text-xl md:text-3xl max-sm:text-sm font-bold text-blue-800 italic mb-0'>
									{text}
								</h1>
							</div>
							<div className=' bg-yellow-50 py-3 px-7 max-sm:py-2 rounded-sm border-2 border-green-900 border-dashed absolute right-5 bottom-5 max-sm:text-xs'>
								<p className='underline'>
									From:
									<span className='text-blue-800'> {from}</span>
								</p>
								<p className='underline'>
									To:
									<span className='text-blue-800'> {to}</span>
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
