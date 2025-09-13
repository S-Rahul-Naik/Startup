import React from 'react';

const PrivacyPolicy = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-12 px-2">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-200 p-8 relative">
      <div className="flex justify-center mb-4">
        <span className="inline-block bg-pink-200 rounded-full p-4 shadow-lg">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ec4899" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </span>
      </div>
      <h1 className="text-4xl font-extrabold mb-6 text-center text-pink-600">Privacy Policy</h1>
      <p className="mb-4 text-gray-700 leading-relaxed text-center">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use EduTech.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-blue-600">Information We Collect</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>Personal information you provide (name, email, etc.)</li>
        <li>Usage data (pages visited, actions taken)</li>
        <li>Files and documents you upload</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-blue-600">How We Use Information</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>To provide and improve our services</li>
        <li>To communicate with you</li>
        <li>To ensure security and prevent abuse</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-blue-600">Your Rights</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>You can request deletion of your data</li>
        <li>You can update your information at any time</li>
      </ul>
      <p className="mt-10 text-gray-700 text-center">For questions, contact us at <a href="mailto:edutech956@gmail.com" className="text-pink-600 underline">support@edutech.com</a>.</p>
    </div>
  </div>
);

export default PrivacyPolicy;
