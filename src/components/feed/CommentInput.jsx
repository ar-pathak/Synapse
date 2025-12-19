import React, { useState, useRef, useEffect } from 'react';
import { FaSmile, FaTimes, FaReply } from 'react-icons/fa';

const CommentInput = ({ userinfo, onSubmit, placeholder = "Write a comment...", loading = false, parentComment = null, replyTo = null, onCancel }) => {
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const textareaRef = useRef(null);

  const emojis = ['😊', '❤️', '👍', '🔥', '👏', '🎉', '💯', '😍', '🤔', '😂', '😭', '😡', '🤯', '🥳', '😎', '🤩'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() || loading) return;
    
    const commentData = {
      content: content.trim(),
      isAnonymous,
      parentCommentId: parentComment?._id,
      replyToUserId: replyTo?._id
    };
    
    onSubmit(commentData);
    setContent('');
    setIsAnonymous(false);
    setShowEmoji(false);
  };

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmoji(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Reply Header */}
        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
            <FaReply className="w-3 h-3" />
            <span>Replying to</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {replyTo.fullName || replyTo.username}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex gap-3">
          <img
            src={userinfo?.avatar || "https://i.pravatar.cc/150"}
            alt="Avatar"
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          
          <div className="flex-1 space-y-2">
            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                Post anonymously
              </label>
            </div>

            {/* Text Input */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={loading}
                maxLength={2000}
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {content.length}/2000
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Emoji Picker */}
                <button
                  type="button"
                  onClick={() => setShowEmoji(!showEmoji)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={loading}
                >
                  <FaSmile className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2">
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!content.trim() || loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>

            {/* Emoji Picker Dropdown */}
            {showEmoji && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentInput; 