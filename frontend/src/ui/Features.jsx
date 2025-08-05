import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBoxes, FaUserMd, FaChartLine } from 'react-icons/fa';

const featuresData = [
  {
    icon: <FaBoxes size={40} className="text-blue-600" />,
    title: 'Inventory Management',
    description: 'Keep track of your stock levels in real-time with automated alerts.',
  },
  {
    icon: <FaUserMd size={40} className="text-blue-600" />,
    title: 'Doctor & Patient Records',
    description: 'Manage doctor and patient information securely and efficiently.',
  },
  {
    icon: <FaChartLine size={40} className="text-blue-600" />,
    title: 'Sales & Reporting',
    description: 'Generate detailed sales reports to gain insights into your business.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Key Features</h2>
          <p className="text-gray-600 mt-2">Everything you need to run your pharmacy smoothly.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {featuresData.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default Features;