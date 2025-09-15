import React from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  UserGroupIcon,
  LightBulbIcon,
  TrophyIcon,
  HeartIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Projects Delivered', value: 'Dozens', description: 'of projects already in progress', icon: TrophyIcon },
    { label: 'Happy Students', value: 'Growing', description: 'community of learners', icon: HeartIcon },
    { label: 'Expert Mentors', value: 'Industry', description: 'professionals guiding every project', icon: UserGroupIcon },
    { label: 'Years Experience', value: 'Fresh', description: 'expertise backing us', icon: GlobeAltIcon }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in every project we deliver, ensuring the highest quality standards.',
      icon: TrophyIcon
    },
    {
      title: 'Innovation',
      description: 'Constantly exploring new technologies and methodologies to provide cutting-edge solutions.',
      icon: LightBulbIcon
    },
    {
      title: 'Student Success',
      description: 'Your success is our priority. We provide comprehensive support throughout your academic journey.',
      icon: HeartIcon
    },
    {
      title: 'Expert Guidance',
      description: 'Learn from industry experts and experienced mentors who are passionate about teaching.',
      icon: UserGroupIcon
    }
  ];

  const team = [
    {
      name: 'Sugali Rahul Naik',
      role: 'Founder & CEO',
      expertise: 'Founder passionate about making academic projects smarter, accessible, and impactful. Skilled in building software projects of any type.',
      image: '/images/undraw_developer-avatar_f6ac.svg'
    },
    
    {
      name: 'Harsha J N',
      role: 'Co-Founder & Lead Innovator',
      expertise: 'A state-level champion who represented Karnataka nationally in EV innovation. Focused on transforming ideas into sustainable technologies that drive real-world change. ',
      image: '/images/undraw_developer-avatar_f6ac.svg'
    },
    {
      name: 'Rohan Hiremath',
    role: 'Co-Founder & Tech Lead',
    expertise: 'Computer Science engineer with expertise in building scalable software and cloud-based solutions.',
      image: '/images/undraw_developer-avatar_f6ac.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Edu Tech
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Empowering students with cutting-edge academic projects and expert mentorship
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At Edu Tech, we believe that every student deserves access to high-quality, 
                industry-relevant academic projects. Our mission is to bridge the gap between 
                theoretical knowledge and practical application.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We provide comprehensive project solutions across various engineering domains, 
                from embedded systems to machine learning, ensuring that students gain hands-on 
                experience with cutting-edge technologies.
              </p>
              <div className="flex items-center text-primary-600 font-semibold">
                <AcademicCapIcon className="w-6 h-6 mr-2" />
                Empowering the next generation of engineers
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-lg shadow-soft p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AcademicCapIcon className="w-12 h-12 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Why Choose Edu Tech?
                  </h3>
                  <ul className="text-left space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Industry-standard project quality
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Expert mentorship and support
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Comprehensive documentation
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Post-delivery assistance
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Journey So Far
            </h2>
            <p className="text-xl text-gray-600">
              Shaping ideas into projects, step by step
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  className="bg-white rounded-lg shadow-soft p-6 text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to your success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6 text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.expertise}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students who have already transformed their academic journey with us
            </p>
            <div className="space-x-4">
              <a
                href="/projects"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Browse Projects
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
