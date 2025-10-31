import React from "react";
import './Nw.css';
import Home from "./Page/Home";
import About from "./Page/About";
import Contact from "./Page/Contact";
import Longin from "./component/Login";
import Sin from "./component/Sin";
import Profile from "./Page/Profile";
import Myposts from"./Page/Myposts";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { Row, Col, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from "./Page/Feed";
function App() {
  return (
    <BrowserRouter>
      <div className="moving-bg min-vh-100">
        <Container fluid className="p-0">
          <Row>
            <Col>
              <Nav variant="tabs" defaultActiveKey="/home" className="bg-dark p-3">
                <Nav.Item>
                  <Nav.Link as={Link} to="/home" className="text-white">
                    Home
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/about" className="text-white">
                    About
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/contact" className="text-white">
                    Contact
                  </Nav.Link>
                </Nav.Item>
                <div className="ms-auto d-flex">
                  <Nav.Item>
                    <Nav.Link as={Link} to="/login" className="text-white fw-bold">
                      Sign Up
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link as={Link} to="/sin" className="text-white fw-bold">
                      Sign In
                    </Nav.Link>
                  </Nav.Item>
                </div>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Longin />} />
                <Route path="/sin" element={<Sin />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/myposts" element={<Myposts/>} />
                <Route path="/" element={<Home />} /> 
              </Routes>
            </Col>
          </Row>
        </Container>

      </div>
    </BrowserRouter>
  );
}
export default App;
