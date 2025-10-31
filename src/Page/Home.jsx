import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Navbar, Container, Nav, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://my-backend-c.onrender.com/api/user/checkauth"
, {
          withCredentials: true,
        });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPosts([]);
    setComments({});
    try {
      const res = await axios.get(
        `https://my-backend-c.onrender.com/api/posts/byemail?email=${email}`,
        { withCredentials: true }
      );
      if (res.data.posts && res.data.posts.length > 0) {
        setPosts(res.data.posts);
        const allComments = {};
        for (const post of res.data.posts) {
          const commentRes = await axios.get(
            `https://my-backend-c.onrender.com/api/comments${post._id}`,
            { withCredentials: true }
          );
          allComments[post._id] = commentRes.data.comments;
        }
        setComments(allComments);
      } else {
        setError("No posts found for this email.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching posts.");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("https://my-backend-c.onrender.com/api/user/logout", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log("Logout failed");
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const submitComment = async (postId) => {
    try {
      const res = await axios.post(
        `https://my-backend-c.onrender.com/api/comments/${postId}`,
        {
          comment: newComment[postId],
        },
        { withCredentials: true }
      );

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data.comment],
      }));
      setNewComment({ ...newComment, [postId]: '' });
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="/">
  📚 <strong>CampusConnect</strong> — Learn. Share. Connect.
</Navbar.Brand>

          <Nav className="ms-auto">
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => {
                if (user) {
                  navigate("/profile");
                } else {
                  alert("🔐 Please log in or sign up to access your profile.");
                  navigate("/login");
                }
              }}
            >
              👤 Profile
            </Button>
            <Button
              variant="outline-success"
              className="me-2"
              onClick={() => user ? navigate("/feed") : navigate("/login")}
            >
              🛠 Manage Posts
            </Button>
            <Button
              variant="outline-info"
              className="me-2"
              onClick={() => user ? navigate("/myposts") : navigate("/login")}
            >
              📄 My Posts
            </Button>
            {user && (
              <Button variant="outline-danger" onClick={handleLogout}>
                🔓 Logout
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        {user && (
          <div className="alert alert-success">
            👋 Welcome, <strong>{user.name}</strong> ({user.email})
          </div>
        )}

        {!user && (
          <div className="alert alert-info">
            Please{" "}
            <Button variant="link" onClick={() => navigate("/login")}>Login</Button> or{" "}
            <Button variant="link" onClick={() => navigate("/sinup")}>Signup</Button>{" "}
            to continue.
          </div>
        )}

        <h5>🔍 Search Posts by Email</h5>
        <form className="d-flex my-3" style={{ maxWidth: "500px" }} onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button variant="outline-primary" type="submit">Search</Button>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        {posts.length > 0 && (
          <div className="mt-4">
            <h6>📬 Posts by <span className="text-primary">{email}</span></h6>
            {posts.map((post) => (
              <div key={post._id} className="card mb-3 p-3 shadow-sm">
                <p><strong>Type:</strong> {post.type}</p>
                <p>{post.message}</p>
                {post.videoLink && (
                  <a href={post.videoLink} target="_blank" rel="noreferrer">
                    ▶️ Watch Video
                  </a>
                )}

                {user && (
                  <div className="mt-3">
                    <h6>💬 Comments</h6>
                    {(comments[post._id] || []).map((c, idx) => (
                      <div key={idx} className="border rounded p-2 mb-1 bg-light">
                        <div><strong>{c.authorName || "Anonymous"}:</strong> {c.comment}</div>
                        <small className="text-muted">
                          🕒 {new Date(c.createdAt).toLocaleString()}
                        </small>
                      </div>
                    ))}
                    <Form className="d-flex mt-2">
                      <Form.Control
                        type="text"
                        placeholder="Write a comment"
                        value={newComment[post._id] || ''}
                        onChange={(e) => handleCommentChange(post._id, e.target.value)}
                      />
                      <Button
                        variant="primary"
                        className="ms-2"
                        onClick={() => submitComment(post._id)}
                        disabled={!newComment[post._id]}
                      >
                        Send
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}

export default Home;
