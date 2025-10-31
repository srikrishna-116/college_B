import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = "https://my-backend-c.onrender.com";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API}/api/user/checkauth`, {
          withCredentials: true
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API}/api/user/logout`, {
        withCredentials: true
      });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow p-4">
        <h3 className="mb-4">👤 My Profile</h3>

        {user ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Register No:</strong> {user.reg_num}</p>
            <p><strong>Date of Birth:</strong> {user.Dob}</p>

            <div className="mt-4">
              <Button variant="primary" className="me-2" onClick={() => navigate("/feed")}>
                ➕ Add Post
              </Button>
              <Button variant="info" className="me-2" onClick={() => navigate("/myposts")}>
                📄 My Posts
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                🔓 Logout
              </Button>
            </div>
          </>
        ) : (
          <Alert variant="danger">User not found.</Alert>
        )}
      </Card>
    </Container>
  );
}

export default Profile;
