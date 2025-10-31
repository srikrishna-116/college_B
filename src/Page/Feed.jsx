import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API = "https://my-backend-c.onrender.com";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ type: "", message: "", videoLink: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${API}/api/posts/myposts`, { withCredentials: true });
        setPosts(res.data.posts || []);
      } catch (err) {
        alert("Please login to access Feed");
        navigate("/login");
      }
    };
    fetchMyPosts();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/api/posts/update/${editingId}`, form, { withCredentials: true });
        setEditingId(null);
      } else {
        await axios.post(`${API}/api/posts/create`, form, { withCredentials: true });
      }
      setForm({ type: "", message: "", videoLink: "" });
      const res = await axios.get(`${API}/api/posts/myposts`, { withCredentials: true });
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error saving post:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/posts/delete/${id}`, { withCredentials: true });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setForm({ type: post.type, message: post.message, videoLink: post.videoLink || "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="my-4">
      <Card className="shadow-sm p-4 mb-4 border-0 rounded-4 bg-light">
        <h3 className="mb-3">{editingId ? "✏️ Edit Your Post" : "📝 Share Something with Campus"}</h3>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>📌 Type</Form.Label>
                <Form.Control
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Announcement, Question..."
                  required
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>💬 Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What's on your mind?"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>🎥 Video Link (optional)</Form.Label>
            <Form.Control
              name="videoLink"
              value={form.videoLink}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary">
              {editingId ? "Update Post" : "Add Post"}
            </Button>
            {editingId && (
              <Button variant="secondary" onClick={() => { setEditingId(null); setForm({ type: "", message: "", videoLink: "" }); }}>
                Cancel
              </Button>
            )}
          </div>
        </Form>
      </Card>

      <h4 className="mb-3">📚 My Posts</h4>
      {posts.length === 0 && <p className="text-muted">No posts yet. Start by adding something!</p>}
      {posts.map((post) => (
        <Card key={post._id} className="mb-3 shadow-sm border-0 rounded-4 p-3">
          <Row>
            <Col>
              <Badge bg="info" className="mb-2">{post.type}</Badge>
              <p className="mb-1">{post.message}</p>
              {post.videoLink && (
                <a href={post.videoLink} target="_blank" rel="noreferrer">▶️ Watch Video</a>
              )}
            </Col>
            <Col xs="auto" className="d-flex align-items-start justify-content-end gap-2">
              <Button size="sm" variant="outline-primary" onClick={() => handleEdit(post)}>Edit</Button>
              <Button size="sm" variant="outline-danger" onClick={() => handleDelete(post._id)}>Delete</Button>
            </Col>
          </Row>
        </Card>
      ))}
    </Container>
  );
}

export default Feed;
