import { useState, useEffect } from 'react';
import Comment from './Comment';
import { commentAPI } from '../services/api';
import './CommentList.css';

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getAllComments();
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again later.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      setSubmitting(true);
      const response = await commentAPI.createComment(newCommentText);
      setComments([response.data, ...comments]);
      setNewCommentText('');
      setError(null);
    } catch (err) {
      setError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (id, text) => {
    try {
      const response = await commentAPI.updateComment(id, text);
      setComments(
        comments.map((comment) =>
          comment.id === id ? response.data : comment
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to update comment. Please try again.');
      console.error('Error updating comment:', err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await commentAPI.deleteComment(id);
      setComments(comments.filter((comment) => comment.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="comment-list-container">
      <header className="header">
        <h1>Comments</h1>
        <p className="subtitle">{comments.length} comments</p>
      </header>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="btn-close-error">
            ×
          </button>
        </div>
      )}

      <div className="add-comment-section">
        <h2>Add a Comment</h2>
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write your comment here..."
            className="comment-input"
            rows="4"
            disabled={submitting}
          />
          <button
            type="submit"
            className="btn-submit"
            disabled={submitting || !newCommentText.trim()}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      <div className="comments-section">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
