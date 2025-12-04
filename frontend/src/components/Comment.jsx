import { useState } from 'react';
import './Comment.css';

const Comment = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSave = async () => {
    if (editText.trim()) {
      await onUpdate(comment.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-author-section">
          {comment.image && (
            <img
              src={comment.image}
              alt={comment.author}
              className="comment-avatar"
            />
          )}
          {!comment.image && (
            <div className="comment-avatar-placeholder">
              {comment.author.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="comment-meta">
            <h3 className="comment-author">{comment.author}</h3>
            <p className="comment-date">{formatDate(comment.date)}</p>
          </div>
        </div>
        <div className="comment-actions">
          {!isEditing && (
            <>
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit
              </button>
              <button onClick={handleDelete} className="btn-delete">
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="comment-edit-form">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="comment-textarea"
              rows="4"
            />
            <div className="comment-edit-actions">
              <button onClick={handleSave} className="btn-save">
                Save
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
      </div>

      <div className="comment-footer">
        <span className="comment-likes">👍 {comment.likes} likes</span>
      </div>
    </div>
  );
};

export default Comment;
