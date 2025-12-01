import { useState, useEffect } from "react";
import "../styles/LikesModal.css";

const LikesModal = ({ projectId, isOpen, onClose }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchLikes();
    }
  }, [isOpen, projectId]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/feed/${projectId}/likes`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            ❤️ Liked by {likes.length}{" "}
            {likes.length === 1 ? "person" : "people"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : likes.length === 0 ? (
            <div className="modal-empty">
              <p>No likes yet</p>
            </div>
          ) : (
            <div className="likes-list">
              {likes.map((like) => (
                <div key={like.id} className="like-item">
                  <div className="like-user-avatar">
                    {like.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="like-user-info">
                    <div className="like-user-name">{like.user.name}</div>
                    <div className="like-user-username">
                      @{like.user.username}
                    </div>
                  </div>
                  <div className="like-date">
                    {new Date(like.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikesModal;
