
import React, { useState } from 'react';

const AddProjectPage: React.FC = () => {
	const [title, setTitle] = useState('');
	const [image, setImage] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission logic here
		alert('Project submitted!');
	};

	return (
		<div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
			<h2 className="text-2xl font-bold mb-6">Add New Project</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">Project Title</label>
					<input
						type="text"
						value={title}
						onChange={e => setTitle(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">Project Image</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
						required
					/>
					  <p className="text-xs text-gray-500 mt-1">Recommended image size: <span className="font-semibold">900x600px</span> (3:2 aspect ratio, landscape, JPG/PNG)</p>
				</div>
				{/* ...other fields... */}
				<button
					type="submit"
					className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
				>
					Submit Project
				</button>
			</form>
		</div>
	);
};

export default AddProjectPage;
