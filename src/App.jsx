import React, { useEffect, useState } from 'react'
import './App.css'
import PostcardGallery from './components/PostcardGallery'

function App() {
	const [postcards, setPostcards] = useState(() => {
		const saved = localStorage.getItem('postcards')
		return saved ? JSON.parse(saved) : []
	})

	const [newPostcard, setNewPostcard] = useState({
		backgroundImage: '',
		text: '',
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
				`https://api.unsplash.com/search/photos?query=christmas ${query}&per_page=3&client_id=${UNSPLASH_ACCESS_KEY}`
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
		setNewPostcard({ backgroundImage: '', text: '' })
	}

	const removePostcard = id => {
		setPostcards(postcards.filter(card => card.id !== id))
	}

	const selectBackground = photoUrl => {
		setNewPostcard({ ...newPostcard, backgroundImage: photoUrl })
	}

	return (
		<main>
			<section className='p-10'>
				<h1>Create Your Postcard</h1>

				<div className='space-y-4'>
					<div>
						<label>Search Background Image:</label>
						<div className='flex'>
							<input
								type='text'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
								placeholder='What do you want to see on your postcard background?'
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

					<div className='mb-10'>
						<label>Text:</label>
						<input
							type='text'
							value={newPostcard.text}
							onChange={e =>
								setNewPostcard({ ...newPostcard, text: e.target.value })
							}
							placeholder='What do you want to write on your postcard?'
							className='w-full'
						/>
					</div>

					<button
						onClick={addPostcard}
						className='form-btn'
						disabled={!newPostcard.backgroundImage || !newPostcard.text}
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
