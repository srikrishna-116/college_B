import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const res = await axios.get("https://my-backend-c.onrender.com/api/user/checkauth",
 {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);

          const postsRes = await axios.get(
            `https://my-backend-c.onrender.com/api/posts/byemail?email=${res.data.user.email}`,
            { withCredentials: true }
          );

          const userPosts = postsRes.data.posts || [];
          setPosts(userPosts);

          await loadComments(userPosts);
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user or posts", err);
        navigate("/login");
      }
    };

    const loadComments = async (postList) => {
      const commentsMap = {};
      for (const post of postList) {
        try {
          const cmtRes = await axios.get(`https://my-backend-c.onrender.com/api/comments/
/${post._id}`);
          commentsMap[post._id] = cmtRes.data.comments || [];
        } catch (err) {
          console.error(`Error loading comments for post ${post._id}`, err);
        }
      }
      setComments(commentsMap);
    };

    fetchUserAndPosts();
  }, [navigate]);

  const handleCommentChange = (postId, value) => {
    setNewComment({ ...newComment, [postId]: value });
  };

  const submitComment = async (postId) => {
    try {
      const res = await axios.post(
        `https://my-backend-c.onrender.com/api/comments/
/${postId}`,
        { comment: newComment[postId] },
        { withCredentials: true }
      );

      const addedComment = res.data.comment;

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), addedComment],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  return (
    <Container className="mt-4">
      <h4>📄 My Posts</h4>

      {posts.length === 0 ? (
        <div className="alert alert-info">No posts available.</div>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="mb-3 p-3 shadow-sm">
            <p><strong>Type:</strong> {post.type}</p>
            <p>{post.message}</p>
            {post.videoLink && (
              <a href={post.videoLink} target="_blank" rel="noreferrer">
                ▶️ Watch Video
              </a>
            )}

            {/* Comment Section */}
            <div className="mt-3">
              <h6>💬 Comments</h6>
              {(comments[post._id] || []).map((c, idx) => (
                <div key={idx} className="border rounded p-2 mb-1 bg-light">
                  <strong>{c.authorName || "Anonymous"}</strong>: {c.text}
                  <br />
                  <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
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
          </Card>
        ))
      )}
    </Container>
  );
}

export default MyPosts;
