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
			{/* Панель управления */}
			<section className='p-10'>
				<h1>Create Your Own Postcard</h1>

				<div className='space-y-4'>
					<div>
						<label>URL:</label>
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
						/>
					</div>

					<div className='mb-10'>
						<label>Text:</label>
						<input
							type='text'
							value={newPostcard.text}
							onChange={e =>
								setNewPostcard({ ...newPostcard, text: e.target.value })
							}
							placeholder='Enter text'
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
