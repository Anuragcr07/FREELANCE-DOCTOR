// src/components/Hero.js
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Hero = () => {
  return (
    <Container style={{ marginTop: '80px', textAlign: 'center' }} className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4">Efficient Medical Store Management</h1>
          <p className="lead">
            Streamline your pharmacy operations with our all-in-one management system.
          </p>
          <Button variant="primary" size="lg" href="#contact">Get Started</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Hero;