import React from 'react'
import Postcard from './Postcard'

const PostcardGallery = ({ postcards, removePostcard }) => {
	return (
		<section className='p-3'>
			<h2 className='m-4'>My Postcards ({postcards.length})</h2>

			{postcards.length === 0 ? (
				<p className='text-gray-400 m-4'>Create Your First Postcard!</p>
			) : (
				<div className='space-y-4'>
					{postcards.map(card => (
						<div key={card.id} className='relative group'>
							<Postcard
								backgroundImage={card.backgroundImage}
								text={card.text}
								showDownloadButton={true}
							/>

							<button
								onClick={() => removePostcard(card.id)}
								className='delete-btn'
							>
								Delete
							</button>
						</div>
					))}
				</div>
			)}
		</section>
	)
}

export default PostcardGallery
