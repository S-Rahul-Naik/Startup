import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  CodeBracketIcon, 
  RocketLaunchIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const HomePage: React.FC = () => {
  // ...existing code...

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Academic Excellence',
      description: 'High-quality projects designed by industry experts and academic professionals.'
    },
    {
      icon: CodeBracketIcon,
      title: 'Latest Technologies',
      description: 'Stay ahead with cutting-edge technologies and modern development practices.'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Quick Delivery',
      description: 'Fast turnaround times with guaranteed quality and comprehensive support.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Your data and projects are protected with enterprise-grade security.'
    }
  ];

  const stats = [
    { number: '12+', label: 'Projects Delivered' },
    { number: '92%', label: 'Student Success Rate' },
    { number: '5+', label: 'Expert Mentors' },
  { number: '24/7', label: 'Support Hours' }
  ];

  const testimonials = [
    {
      name: 'Praveen Kumar',
      qualification: 'B.E(CSE) - BITM, Ballari',
              text: 'Edu Tech is professional, timely, and extremely efficient.',
      rating: 5
    },
    {
      name: 'Vaseem',
      qualification: 'B.E(EEE) - PVKKIT, Anantapur',
      text: 'I received my kit in time which was pretty exciting. Looking forward to start working on it.',
      rating: 5
    },
    {
      name: 'Chetana',
      qualification: 'B.E(DS), Ballari',
              text: 'EduTech helped me complete my project on AI-powered Deepfake & Liveness Detection with great learning.',
      rating: 5
    }
  ];

  const projectCategories = [
        { name: 'Computer Science', color: 'bg-blue-500', desc: 'Where code meets creativity' },
  { name: 'AI/ML', color: 'bg-purple-500', desc: 'Intelligence that adapts and evolves' },
    { name: 'Data Science', color: 'bg-yellow-500', desc: 'Insights that shape tomorrow' },
    { name: 'Electronics & Communication', color: 'bg-red-500', desc: 'Innovating the future of connectivity' },
    { name: 'Electrical Engineering', color: 'bg-indigo-500', desc: 'Smart power, smarter solutions' },
    { name: 'Mechanical Engineering', color: 'bg-green-500', desc: 'Engineering ideas into reality' }

  ];

  return (
    <div className="min-h-screen">
  {/* Hero Section */}
  <section id="hero" className="relative bg-gradient-to-br from-primary-700 via-primary-900 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 mb-8 max-w-xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight mb-4">
                  <span className="block bg-gradient-to-r from-secondary-400 via-pink-400 to-orange-400 bg-clip-text text-transparent animate-gradient-x">
                    Transform Your Academic Journey
                  </span>
                </h1>
                <p className="text-lg md:text-2xl text-primary-100 mb-6 leading-relaxed drop-shadow">
                  Unlock a world of innovative projects, expert mentorship, and real-world skills. <br className="hidden md:block" />
                  Empower your future with Edu Tech’s all-in-one academic platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Link
                    to="/projects"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-secondary-500 via-pink-500 to-orange-400 hover:from-secondary-600 hover:to-orange-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl text-lg animate-bounce-slow"
                  >
                    <RocketLaunchIcon className="w-6 h-6 mr-2" />
                    Explore Projects
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/20 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-700 transition-all duration-300 text-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/30 flex items-center justify-center min-h-[360px] group cursor-pointer hover:shadow-3xl hover:scale-105">
                <img
                  src="/images/hero-illustration.svg"
                  alt="Academic Projects"
                  className="w-full h-auto max-h-[340px] object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 rounded-3xl pointer-events-none group-hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.18)]"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/20 to-primary-500/20 rounded-3xl blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
    </section>
    {/* Closing tag added for Stats Section */}

  {/* ...existing code... */}

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Edu Tech?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive academic project solutions with cutting-edge technology, 
              expert guidance, and guaranteed success.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Projects Section */}
      <section className="py-20 bg-gradient-to-r from-pink-100 via-blue-100 to-orange-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Need a Custom Project?
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Can't find exactly what you need? We build fully customized academic projects for any branch or technology. Just tell us your requirements and our expert team will deliver a solution tailored for you!
            </p>
            <Link
              to="/custom-project"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-secondary-500 via-pink-500 to-orange-400 hover:from-secondary-600 hover:to-orange-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl text-lg"
            >
              Request a Custom Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Project Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Project Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide range of project categories across multiple domains and technologies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col justify-between">
                  <div className={`w-12 h-12 ${category.color} rounded-lg mb-4 flex items-center justify-center`}>
                    <CodeBracketIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.desc}</p>
                  <Link
                    to={`/projects?category=${encodeURIComponent(category.name)}`}
                    className="flex items-center text-primary-600 font-medium group-hover:text-primary-700"
                  >
                    Explore Projects
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View All Categories
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied students who have achieved academic success with our projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.qualification}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have successfully completed their academic projects 
              with Edu Tech. Get started today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-600 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;