
import React, { useState } from 'react';
const API_URL = process.env.REACT_APP_API_URL;
import toast from 'react-hot-toast';

const AddProjectPage: React.FC = () => {
	const [title, setTitle] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [abstract, setAbstract] = useState('');
	const [blockDiagram, setBlockDiagram] = useState<File | null>(null);
	const [specifications, setSpecifications] = useState('');
	const [learningOutcomes, setLearningOutcomes] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleBlockDiagramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setBlockDiagram(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const formData = new FormData();
			formData.append('title', title);
			if (image) formData.append('image', image);
			formData.append('abstract', abstract);
			if (blockDiagram) formData.append('blockDiagram', blockDiagram);
			formData.append('specifications', specifications);
			formData.append('learningOutcomes', learningOutcomes);

			const response = await fetch(`${API_URL}/api/projects`, {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success('Project submitted successfully!');
				setTitle('');
				setImage(null);
				setAbstract('');
				setBlockDiagram(null);
				setSpecifications('');
				setLearningOutcomes('');
			} else {
				const err = await response.text();
				setError(err || 'Failed to submit project');
				toast.error('Failed to submit project');
			}
		} catch (err) {
			setError('Failed to submit project');
			toast.error('Failed to submit project');
		} finally {
			setLoading(false);
		}
	};

			return (
				<div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow mt-10">
					<h2 className="text-2xl font-bold mb-6">Add New Project</h2>
					<form onSubmit={handleSubmit} encType="multipart/form-data">
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
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Abstract</label>
							<textarea
								value={abstract}
								onChange={e => setAbstract(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								rows={4}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Block Diagram (Image Upload)</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleBlockDiagramChange}
								className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Specifications</label>
							<textarea
								value={specifications}
								onChange={e => setSpecifications(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								rows={3}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-2">Learning Outcomes <span className="text-xs text-gray-400">(one per line)</span></label>
							<textarea
								value={learningOutcomes}
								onChange={e => setLearningOutcomes(e.target.value)}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
								rows={4}
								placeholder="e.g. Learn MATLAB basics\nUnderstand image processing\n..."
								required
							/>
						</div>
						{error && <div className="text-red-600 mb-4 text-center">{error}</div>}
						<button
							type="submit"
							className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-60"
							disabled={loading}
						>
							{loading ? 'Submitting...' : 'Submit Project'}
						</button>
					</form>
				</div>
			);
};

export default AddProjectPage;
