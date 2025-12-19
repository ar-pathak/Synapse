import React, { useState } from 'react';
import { 
  FaHeart, FaRegHeart, FaReply, FaTrash, FaSmile, FaPaperPlane, 
  FaEllipsisH, FaEdit, FaFlag, FaThumbtack, FaShare, FaEye,
  FaFire, FaRocket, FaEye as FaEyes, FaGrinSquintTears, FaSurprise,
  FaSadTear, FaAngry, FaHeart as FaLove, FaHandHoldingHeart,
  FaChevronDown, FaChevronUp, FaTimes, FaExclamationTriangle
} from 'react-icons/fa';
import CommentInput from './CommentInput';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../../hooks/useToast';

// Reaction Types with Icons
const REACTION_TYPES = {
  like: { icon: FaHeart, color: 'text-red-500', label: 'Like' },
  love: { icon: FaLove, color: 'text-red-600', label: 'Love' },
  haha: { icon: FaGrinSquintTears, color: 'text-yellow-500', label: 'Haha' },
  wow: { icon: FaSurprise, color: 'text-yellow-600', label: 'Wow' },
  sad: { icon: FaSadTear, color: 'text-blue-500', label: 'Sad' },
  angry: { icon: FaAngry, color: 'text-red-700', label: 'Angry' },
  care: { icon: FaHandHoldingHeart, color: 'text-pink-500', label: 'Care' },
  fire: { icon: FaFire, color: 'text-orange-500', label: 'Fire' },
  rocket: { icon: FaRocket, color: 'text-purple-500', label: 'Rocket' },
  eyes: { icon: FaEyes, color: 'text-indigo-500', label: 'Eyes' }
};

// Reaction Button Component
const ReactionButton = ({ reactionType, count, isActive, onClick, showCount = true }) => {
  const config = REACTION_TYPES[reactionType];
  const Icon = config.icon;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 hover:scale-105 ${
        isActive 
          ? `${config.color} bg-red-50 dark:bg-red-900/20` 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
      }`}
      title={config.label}
    >
      <Icon className="w-3 h-3" />
      {showCount && count > 0 && (
        <span className="text-xs font-medium">{count}</span>
      )}
    </button>
  );
};

// Thread Line Component
const ThreadLine = ({ depth = 0, isLast = false }) => {
  return (
    <div className="flex">
      {Array.from({ length: depth }).map((_, index) => (
        <div key={index} className="w-8 flex justify-center">
          <div className="w-px bg-gray-300 dark:bg-gray-600 h-full"></div>
        </div>
      ))}
      {depth > 0 && (
        <div className="w-8 flex justify-center">
          <div className={`w-px bg-gray-300 dark:bg-gray-600 ${isLast ? 'h-4' : 'h-full'}`}></div>
        </div>
      )}
    </div>
  );
};

// Comment Item Component
const CommentItem = ({ 
  comment, 
  userinfo, 
  onLike, 
  onReply, 
  onDelete, 
  onEdit, 
  onReport, 
  onPin, 
  canModerate,
  depth = 0,
  showReplies = false,
  onToggleReplies
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState(comment.userReaction);
  const [reactionCounts, setReactionCounts] = useState(comment.reactionCounts || {});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { showToast } = useToast();

  const handleReaction = async (reactionType) => {
    try {
      const response = await onLike(comment._id, reactionType);
      setUserReaction(response.userReaction);
      setReactionCounts(response.reactionCounts);
      setShowReactions(false);
    } catch (error) {
      showToast('Failed to react to comment', 'error');
    }
  };

  const handleReply = async (replyData) => {
    setIsSubmitting(true);
    try {
      await onReply(comment._id, replyData);
      setShowReplyInput(false);
      showToast('Reply posted successfully', 'success');
    } catch (error) {
      showToast('Failed to post reply', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onEdit(comment._id, { content: editContent.trim() });
      setIsEditing(false);
      showToast('Comment updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment._id);
      setShowDeleteModal(false);
      showToast('Comment deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete comment', 'error');
    }
  };

  const handleReport = async () => {
    try {
      await onReport(comment._id, { reason: 'inappropriate' });
      setShowOptions(false);
      showToast('Comment reported successfully', 'success');
    } catch (error) {
      showToast('Failed to report comment', 'error');
    }
  };

  const handlePin = async () => {
    try {
      await onPin(comment._id);
      setShowOptions(false);
      showToast(comment.isPinned ? 'Comment unpinned' : 'Comment pinned', 'success');
    } catch (error) {
      showToast('Failed to pin comment', 'error');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / (1000 * 60));
    
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  const hasReplies = comment.replyCount > 0;

  return (
    <>
      <div className={`flex ${depth > 0 ? 'ml-4' : ''}`}>
        {/* Thread Line */}
        {depth > 0 && (
          <ThreadLine depth={depth} isLast={!hasReplies} />
        )}
        
        <div className={`flex-1 ${depth > 0 ? 'border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
          <div className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
            comment.isPinned ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-l-yellow-500' : ''
          }`}>
            <div className="flex gap-3">
              <img
                src={comment.user?.avatar || "https://i.pravatar.cc/150"}
                alt={comment.user?.fullName || "User"}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                {/* Comment Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {comment.isAnonymous ? 'Anonymous' : (comment.user?.fullName || "Anonymous")}
                    </span>
                    
                    {comment.user?.verified && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                    
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(comment.createdAt)}
                    </span>
                    
                    {comment.isEdited && (
                      <span className="text-xs text-gray-400">(edited)</span>
                    )}
                    
                    {comment.isPinned && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                        <FaThumbtack className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>

                  {/* Options Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FaEllipsisH className="w-3 h-3" />
                    </button>

                    {showOptions && (
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
                        {comment.user?._id === userinfo?.id && (
                          <>
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setEditContent(comment.content);
                                setShowOptions(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDeleteModal(true)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                              <FaTrash className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        )}
                        
                        {comment.user?._id !== userinfo?.id && (
                          <button
                            onClick={handleReport}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FaFlag className="w-3 h-3" />
                            Report
                          </button>
                        )}
                        
                        {canModerate && (
                          <button
                            onClick={handlePin}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FaThumbtack className="w-3 h-3" />
                            {comment.isPinned ? 'Unpin' : 'Pin'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply To */}
                {comment.replyTo && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Replying to <span className="font-medium">{comment.replyTo.fullName || comment.replyTo.username}</span>
                  </div>
                )}

                {/* Comment Content */}
                {isEditing ? (
                  <div className="mb-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      maxLength={2000}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleEdit}
                        disabled={!editContent.trim() || isSubmitting}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    
                    {/* Media */}
                    {comment.media && comment.media.length > 0 && (
                      <div className="mt-2 flex gap-2">
                        {comment.media.map((item, index) => (
                          <div key={index} className="relative">
                            {item.type === 'image' && (
                              <img
                                src={item.url}
                                alt={item.alt || 'Media'}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            {item.type === 'video' && (
                              <video
                                src={item.url}
                                className="w-16 h-16 object-cover rounded-lg"
                                controls
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Hashtags */}
                    {comment.hashtags && comment.hashtags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {comment.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Like Button */}
                    <button
                      onClick={() => handleReaction('like')}
                      className={`flex items-center gap-1 transition-colors ${
                        userReaction === 'like' 
                          ? 'text-red-500' 
                          : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500'
                      }`}
                    >
                      {userReaction === 'like' ? (
                        <FaHeart className="w-3 h-3" />
                      ) : (
                        <FaRegHeart className="w-3 h-3" />
                      )}
                      <span className="text-xs">{reactionCounts.like || 0}</span>
                    </button>

                    {/* Reaction Picker */}
                    <div className="relative">
                      <button
                        onClick={() => setShowReactions(!showReactions)}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <FaSmile className="w-3 h-3" />
                        {totalReactions > 0 && (
                          <span className="text-xs">{totalReactions}</span>
                        )}
                      </button>

                      {showReactions && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10">
                          <div className="grid grid-cols-5 gap-1">
                            {Object.entries(REACTION_TYPES).map(([type, config]) => (
                              <ReactionButton
                                key={type}
                                reactionType={type}
                                count={reactionCounts[type] || 0}
                                isActive={userReaction === type}
                                onClick={() => handleReaction(type)}
                                showCount={false}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reply Button */}
                    <button
                      onClick={() => setShowReplyInput(!showReplyInput)}
                      className="flex items-center gap-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    >
                      <FaReply className="w-3 h-3" />
                      <span className="text-xs">Reply</span>
                    </button>

                    {/* Share Button */}
                    <button className="flex items-center gap-1 text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-400 transition-colors">
                      <FaShare className="w-3 h-3" />
                      <span className="text-xs">Share</span>
                    </button>
                  </div>

                  {/* View Count */}
                  {comment.viewCount > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaEye className="w-3 h-3" />
                      {comment.viewCount}
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                {showReplyInput && (
                  <div className="mt-3">
                    <CommentInput
                      userinfo={userinfo}
                      onSubmit={handleReply}
                      placeholder={`Reply to ${comment.user?.fullName || "user"}...`}
                      loading={isSubmitting}
                      parentComment={comment}
                      replyTo={comment.user}
                      onCancel={() => setShowReplyInput(false)}
                    />
                  </div>
                )}

                {/* Replies Toggle */}
                {hasReplies && onToggleReplies && (
                  <div className="mt-3">
                    <button
                      onClick={onToggleReplies}
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {showReplies ? (
                        <>
                          <FaChevronUp className="w-3 h-3" />
                          Hide {comment.replyCount} repl{comment.replyCount === 1 ? 'y' : 'ies'}
                        </>
                      ) : (
                        <>
                          <FaChevronDown className="w-3 h-3" />
                          Show {comment.replyCount} repl{comment.replyCount === 1 ? 'y' : 'ies'}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default CommentItem; 