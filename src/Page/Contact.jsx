import React from 'react';
import { Container, Card, Form } from 'react-bootstrap';

function Contact() {
  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4">📞 Contact Us</h2>
        <p>If you have any questions, feedback, or suggestions, feel free to contact the developer.</p>

        <ul>
          <li><strong>Email:</strong> gsrikrishna2004@gmail.com</li>
          <li><strong>GitHub:</strong> github.com/your-github</li>
          <li><strong>LinkedIn:</strong> linkedin.com/in/your-profile</li>
        </ul>

        <h5 className="mt-4">📬 Feedback</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Your Email</Form.Label>
            <Form.Control type="email" placeholder="name@example.com" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>

          <button className="btn btn-primary">Send</button>
        </Form>
      </Card>
    </Container>
  );
}

export default Contact;
