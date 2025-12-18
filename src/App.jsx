import React, { useEffect, useState } from 'react'
import './App.css'
import PostcardGallery from './components/PostcardGallery'

function App() {
	const [postcards, setPostcards] = useState(() => {
		const saved = localStorage.getItem('postcards')
		return saved
			? JSON.parse(saved)
			: [
					{
						backgroundImage: '/bg.jpg',
						text: 'Example Text',
						from: 'Me',
						to: 'You',
						size: 'big',
					},
			  ]
	})

	const [newPostcard, setNewPostcard] = useState({
		backgroundImage: '',
		text: '',
		from: '',
		to: '',
		size: '',
	})

	const [unsplashPhotos, setUnsplashPhotos] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

	useEffect(() => {
		localStorage.setItem('postcards', JSON.stringify(postcards))
	}, [postcards])

	const fetchUnsplashPhotos = async query => {
		setLoading(true)
		setError(null)

		try {
			const response = await fetch(
				`https://api.unsplash.com/search/photos?query=christmas ${query}&per_page=6&client_id=${UNSPLASH_ACCESS_KEY}`
			)

			if (!response.ok) {
				throw new Error('Ошибка при загрузке фотографий')
			}

			const data = await response.json()
			setUnsplashPhotos(data.results)
		} catch (err) {
			setError(err.message)
			console.error('Error fetching photos:', err)
		} finally {
			setLoading(false)
		}
	}

	const handleSearch = e => {
		e.preventDefault()
		if (searchTerm.trim()) {
			fetchUnsplashPhotos(searchTerm)
		}
	}

	const addPostcard = () => {
		if (!newPostcard.backgroundImage || !newPostcard.text) return

		const newCard = {
			id: Date.now(),
			...newPostcard,
		}

		setPostcards([...postcards, newCard])
		setNewPostcard({
			backgroundImage: '',
			text: '',
			from: '',
			to: '',
			size: '',
		})
	}

	const removePostcard = id => {
		setPostcards(postcards.filter(card => card.id !== id))
	}

	const selectBackground = photoUrl => {
		setNewPostcard({ ...newPostcard, backgroundImage: photoUrl })
	}

	const handleSizeChange = size => {
		setNewPostcard({ ...newPostcard, size })
	}

	return (
		<main>
			<section className='p-10'>
				<h1>Create Your Postcard</h1>

				<div className='space-y-4'>
					<div>
						<label>Background Image:</label>
						<div className='flex'>
							<input
								type='text'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								placeholder='eg. Snowman'
								className='flex-5 rounded-r-none'
							/>
							<button
								onClick={handleSearch}
								className='form-btn bg-brown flex-1 rounded-l-none rounded-r'
								disabled={loading}
							>
								{loading ? 'Searching...' : 'Search'}
							</button>
						</div>

						{error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
					</div>

					<div>
						{unsplashPhotos.length > 0 && (
							<>
								<p className='mb-2'>Click to choose:</p>

								<div className='flex gap-3'>
									{unsplashPhotos.map(photo => (
										<button
											key={photo.id}
											onClick={() =>
												selectBackground(photo.urls.regular || photo.urls.small)
											}
											className={`p-1 rounded-lg transition-all ${
												newPostcard.backgroundImage ===
												(photo.urls.regular || photo.urls.small)
													? 'ring-2 ring-red-800 transform scale-105'
													: 'ring-1 ring-gray-300 hover:ring-2 hover:ring-red-700'
											}`}
											title={photo.alt_description || 'Unsplash photo'}
										>
											<img
												src={photo.urls.small}
												className='w-30 h-30 object-cover rounded-md'
												alt={photo.alt_description || 'Background image'}
												loading='lazy'
											/>
										</button>
									))}
								</div>
							</>
						)}
					</div>

					<div>
						<label>Your Wishes:</label>
						<input
							type='text'
							value={newPostcard.text}
							onChange={e =>
								setNewPostcard({ ...newPostcard, text: e.target.value })
							}
							placeholder='What do you want to write?'
							className='w-full'
						/>
					</div>

					<div>
						<label>Wishes Box Size:</label>
						<div className='flex gap-5'>
							<div className='flex items-center'>
								<input
									type='radio'
									id='size-big'
									name='size'
									value='big'
									checked={newPostcard.size === 'big'}
									onChange={() => handleSizeChange('big')}
									className='hidden'
								/>
								<label
									htmlFor='size-big'
									className={`form-btn border-2 border-brown ${
										newPostcard.size === 'big'
											? 'bg-brown text-white '
											: 'bg-gray-200 text-brown hover:border-gray-200'
									}`}
								>
									Big
								</label>
							</div>

							<div className='flex items-center'>
								<input
									type='radio'
									id='size-small'
									name='size'
									value='small'
									checked={newPostcard.size === 'small'}
									onChange={() => handleSizeChange('small')}
									className='hidden'
								/>
								<label
									htmlFor='size-small'
									className={`form-btn border-2 border-brown ${
										newPostcard.size === 'small'
											? 'bg-brown text-white '
											: 'bg-gray-200 text-brown hover:border-gray-200'
									}`}
								>
									Small
								</label>
							</div>
						</div>
					</div>

					<div className='flex gap-5 mb-10'>
						<div className='w-full'>
							<label>From:</label>
							<input
								type='text'
								value={newPostcard.from}
								onChange={e =>
									setNewPostcard({ ...newPostcard, from: e.target.value })
								}
								placeholder='Your name'
								className='w-full'
							/>
						</div>
						<div className='w-full'>
							<label>To:</label>
							<input
								type='text'
								value={newPostcard.to}
								onChange={e =>
									setNewPostcard({ ...newPostcard, to: e.target.value })
								}
								placeholder='Recipient'
								className='w-full'
							/>
						</div>
					</div>

					<button
						onClick={addPostcard}
						className='form-btn'
						disabled={
							!newPostcard.backgroundImage ||
							!newPostcard.text ||
							!newPostcard.from ||
							!newPostcard.to
						}
					>
						Create Postcard
					</button>
				</div>
			</section>

			<PostcardGallery postcards={postcards} removePostcard={removePostcard} />
		</main>
	)
}

export default App
