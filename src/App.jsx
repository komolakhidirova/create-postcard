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

	useEffect(() => {
		localStorage.setItem('postcards', JSON.stringify(postcards))
	}, [postcards])

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

	return (
		<main>
			<section className='p-10'>
				<h1>Create Your Postcard</h1>

				<div className='space-y-4'>
					<div>
						<label>Background:</label>
						<div className='flex'>
							<input
								type='text'
								value={'ok'}
								onChange={e => e.preventDefault()}
								placeholder='What do you want to see on your postcard background?'
								className='flex-5 rounded-r-none'
							/>
							<button className='form-btn bg-brown flex-1 rounded-l-none rounded-r '>
								Search
							</button>
						</div>
					</div>

					<div>
						<p className='mb-2'>Click to choose:</p>
						<div className='flex gap-3'>
							{['/bg.jpg', '/bg1.jpg', '/bg2.jpg'].map((img, index) => (
								<button
									key={index}
									onClick={() =>
										setNewPostcard({ ...newPostcard, backgroundImage: img })
									}
									className={`p-1 rounded-lg ${
										newPostcard.backgroundImage === img
											? 'ring-2 ring-red-800'
											: ''
									}`}
								>
									<img
										src={img}
										className='w-30 h-30 object-cover rounded-md'
										alt={`Background ${index + 1}`}
									/>
								</button>
							))}
						</div>
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
						/>
					</div>

					<button onClick={addPostcard} className='form-btn'>
						Create Postcard
					</button>
				</div>
			</section>

			<PostcardGallery postcards={postcards} removePostcard={removePostcard} />
		</main>
	)
}

export default App
