import React from 'react';

const CookiePolicy = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 py-12 px-2">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-200 p-8 relative">
      <div className="flex justify-center mb-4">
        <span className="inline-block bg-purple-200 rounded-full p-4 shadow-lg">
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 16h.01M16 12h.01M12 8h.01"/></svg>
        </span>
      </div>
      <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-600">Cookie Policy</h1>
      <p className="mb-4 text-gray-700 leading-relaxed text-center">EduTech uses cookies to enhance your experience. This Cookie Policy explains what cookies are and how we use them.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">What Are Cookies?</h2>
      <p className="mb-4 text-gray-700">Cookies are small text files stored on your device by your browser. They help us remember your preferences and improve your experience.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">How We Use Cookies</h2>
      <ul className="list-disc ml-8 mb-4 text-gray-700">
        <li>To keep you logged in</li>
        <li>To remember your preferences</li>
        <li>To analyze site usage and improve our service</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-8 mb-3 text-pink-600">Managing Cookies</h2>
      <p className="mb-4 text-gray-700">You can control cookies through your browser settings. Disabling cookies may affect your experience on EduTech.</p>
      <p className="mt-10 text-gray-700 text-center">For questions, contact us at <a href="mailto:edutech956@gmail.com" className="text-purple-600 underline">support@edutech.com</a>.</p>
    </div>
  </div>
);

export default CookiePolicy;
