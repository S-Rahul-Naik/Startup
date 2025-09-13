import React from 'react';

const TermsOfService = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-12 px-2">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-blue-200 p-8 relative">
      <div className="flex justify-center mb-4">
        <span className="inline-block bg-blue-200 rounded-full p-4 shadow-lg">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#3b82f6" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3"/></svg>
        </span>
      </div>
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">Terms of Service</h1>
      <p className="mb-4 text-gray-700 leading-relaxed text-center">By using EduTech, you agree to these terms. Please read them carefully.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">Use of Service</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>You must provide accurate information</li>
        <li>You are responsible for your account and activity</li>
        <li>Do not misuse or attempt to disrupt the service</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">Content</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>You retain ownership of your content</li>
        <li>We may remove content that violates our policies</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">Liability</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>We are not liable for damages or losses from using EduTech</li>
        <li>Service may change or be discontinued at any time</li>
      </ul>
      <p className="mt-10 text-gray-700 text-center">For questions, contact us at <a href="mailto:edutech956@gmail.com" className="text-blue-600 underline">support@edutech.com</a>.</p>
    </div>
  </div>
);

export default TermsOfService;
