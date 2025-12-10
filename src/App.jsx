import React, { useState } from 'react'
import Postcard from './components/Postcard'

function App() {
	// Состояния для управления открытками
	const [postcards, setPostcards] = useState([
		{
			id: 1,
			backgroundImage: 'bg.jpg',
			overlayOpacity: 0.3,
			text: 'Первая открытка',
			downloadFileName: 'postcard-1',
		},
	])

	const [newPostcard, setNewPostcard] = useState({
		backgroundImage: '',
		overlayOpacity: 0.3,
		text: '',
	})

	// Функции для добавления/удаления открыток
	const addPostcard = () => {
		if (!newPostcard.backgroundImage || !newPostcard.text) return

		const newCard = {
			id: Date.now(),
			...newPostcard,
			downloadFileName: `postcard-${Date.now()}`,
		}

		setPostcards([...postcards, newCard])
		setNewPostcard({ backgroundImage: '', overlayOpacity: 0.3, text: '' })
	}

	const removePostcard = id => {
		setPostcards(postcards.filter(card => card.id !== id))
	}

	return (
		<div className='min-h-screen bg-gray-900 text-white p-4'>
			{/* Панель управления */}
			<div className='max-w-4xl mx-auto mb-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl'>
				<h1 className='text-3xl font-bold mb-6'>Создатель открыток</h1>

				<div className='space-y-4'>
					<div>
						<label className='block mb-2'>URL фонового изображения:</label>
						<input
							type='text'
							value={newPostcard.backgroundImage}
							onChange={e =>
								setNewPostcard({
									...newPostcard,
									backgroundImage: e.target.value,
								})
							}
							placeholder='https://example.com/image.jpg или /images/bg.jpg'
							className='w-full p-2 rounded bg-gray-700 text-white'
						/>
					</div>

					<div>
						<label className='block mb-2'>Текст открытки:</label>
						<input
							type='text'
							value={newPostcard.text}
							onChange={e =>
								setNewPostcard({ ...newPostcard, text: e.target.value })
							}
							placeholder='Введите текст для открытки'
							className='w-full p-2 rounded bg-gray-700 text-white'
						/>
					</div>

					<div>
						<label className='block mb-2'>
							Прозрачность оверлея: {newPostcard.overlayOpacity}
						</label>
						<input
							type='range'
							min='0'
							max='1'
							step='0.1'
							value={newPostcard.overlayOpacity}
							onChange={e =>
								setNewPostcard({
									...newPostcard,
									overlayOpacity: parseFloat(e.target.value),
								})
							}
							className='w-full'
						/>
					</div>

					<button
						onClick={addPostcard}
						className='bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded'
					>
						Добавить открытку
					</button>
				</div>
			</div>

			{/* Галерея открыток */}
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-2xl font-bold mb-4'>
					Мои открытки ({postcards.length})
				</h2>

				{postcards.length === 0 ? (
					<p className='text-gray-400'>Нет открыток. Создайте первую!</p>
				) : (
					<div className='space-y-8'>
						{postcards.map(card => (
							<div key={card.id} className='relative group'>
								<Postcard
									backgroundImage={card.backgroundImage}
									overlayOpacity={card.overlayOpacity}
									text={card.text}
									downloadFileName={card.downloadFileName}
									showDownloadButton={true}
								/>

								<button
									onClick={() => removePostcard(card.id)}
									className='absolute top-4 right-4 bg-red-600/80 hover:bg-red-700 
                           text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 
                           transition-opacity z-50'
								>
									Удалить
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default App
