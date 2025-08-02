// src/components/ContactForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import Dashboard from '../pages/dashboard';

const ContactForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to hold only the error message

  const navigate = useNavigate(); // 2. Initialize the navigate function

  const handleLogin = (event) => {
    event.preventDefault();

    // 3. Check credentials and navigate on success
    if (username === 'Aman' && password === 'Arti medical 123') {
      console.log('Login successful');
      navigate('/dashboard'); // Navigate to the dashboard route
    } else {
      console.log('Login failed');
      setError('Invalid username or password.'); // Set an error message on failure
    }
  };

  return (
    <Container id="contact" className="py-5">
      <h2 className="text-center mb-4">Login</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* 4. Display an error message if it exists */}
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactForm;