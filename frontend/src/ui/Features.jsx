// src/components/Features.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaBoxes, FaUserMd, FaChartLine } from 'react-icons/fa';

const Features = () => {
  return (
    <Container id="features" className="py-5 bg-light">
      <h2 className="text-center mb-4">Key Features</h2>
      <Row className="text-center">
        <Col md={4}>
          <FaBoxes size={50} className="text-primary mb-3" />
          <h3>Inventory Management</h3>
          <p>Keep track of your stock levels in real-time with automated alerts.</p>
        </Col>
        <Col md={4}>
          <FaUserMd size={50} className="text-primary mb-3" />
          <h3>Doctor & Patient Records</h3>
          <p>Manage doctor and patient information securely and efficiently.</p>
        </Col>
        <Col md={4}>
          <FaChartLine size={50} className="text-primary mb-3" />
          <h3>Sales & Reporting</h3>
          <p>Generate detailed sales reports to gain insights into your business.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Features;