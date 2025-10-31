import React from 'react';
import { Container, Card } from 'react-bootstrap';

function About() {
  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4">📘 About CampusConnect</h2>
        <p>
          <strong>CampusConnect</strong> is a student-focused social platform designed to make college communication smoother and more interactive.
        </p>
        <ul>
          <li>📝 Students can post announcements, questions, or video links</li>
          <li>💬 Others can comment and engage in discussion</li>
          <li>🔍 Posts can be searched using the email ID of any student</li>
          <li>🔐 Secure signup/login with JWT and cookie-based authentication</li>
        </ul>

        <h5 className="mt-4">🔧 Tech Stack</h5>
        <ul>
          <li>Frontend: React + React Bootstrap</li>
          <li>Backend: Express.js + Node.js</li>
          <li>Database: MongoDB</li>
          <li>Auth: JWT, bcrypt, cookies</li>
        </ul>

        <h5 className="mt-4">👨‍💻 Developer</h5>
        <p>Made  by G. Sri Krishna, 3rd Year CSE Student</p>
      </Card>
    </Container>
  );
}

export default About;
