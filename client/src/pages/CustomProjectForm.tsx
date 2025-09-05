import React, { useState, ChangeEvent } from 'react';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
const API_URL = process.env.REACT_APP_API_URL;
// Helper to POST custom project form
async function sendCustomProjectForm(data: Record<string, string>) {
  const apiUrl = `${API_URL}/api/contact`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to send message');
  }
  return res.json();
}

const CustomProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    projectTitle: '',
    requirements: ''
  });
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      form.append('subject', 'Custom Project Request');
      form.append('message', `Branch: ${formData.branch}\nProject Title: ${formData.projectTitle}\nRequirements: ${formData.requirements}`);
      if (documents) {
        Array.from(documents).forEach((file) => form.append('documents', file));
      }
      if (images) {
        Array.from(images).forEach((file) => form.append('images', file));
      }
      const apiUrl =
  `${API_URL}/api/contact`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send message');
      }
      toast.success("Custom project request sent! We'll contact you soon.");
      setFormData({ name: '', email: '', phone: '', branch: '', projectTitle: '', requirements: '' });
      setDocuments(null);
      setImages(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 py-20 flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto rounded-2xl p-[2px] bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-200 shadow-2xl">
        <div className="rounded-2xl bg-white/30 backdrop-blur-md p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 drop-shadow">Request a Custom Project</h2>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter your phone number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branch / Department *</label>
            <input type="text" value={formData.branch} onChange={e => handleInputChange('branch', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. CSE, ECE, Mechanical" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
            <input type="text" value={formData.projectTitle} onChange={e => handleInputChange('projectTitle', e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Give your project a title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Requirements *</label>
            <textarea value={formData.requirements} onChange={e => handleInputChange('requirements', e.target.value)} required rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe your custom project requirements in detail..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents (PDF, DOCX, etc.) <span className="text-gray-400">(optional)</span></label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip,.rar,.csv,.json,.xml,.md,.rtf,.odt,.ods,.odp,.pages,.numbers,.key"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDocuments(e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (JPG, PNG, etc.) <span className="text-gray-400">(optional)</span></label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e: ChangeEvent<HTMLInputElement>) => setImages(e.target.files)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 disabled:from-indigo-300 disabled:to-pink-300 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed backdrop-blur-md bg-opacity-80"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomProjectForm;
