import React, { useState, useEffect, useCallback } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import { feedService } from '../../services/feedService';
import { useToast } from '../../hooks/useToast';

// Main Comment Section Component
const CommentSection = ({ postId, userinfo }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sort: 'newest',
    filter: 'all',
    reaction: null,
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalComments: 0,
    hasMore: false
  });
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [commentReplies, setCommentReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const { showToast } = useToast();

  // Fetch comments with filters
  const fetchComments = useCallback(async (page = 1, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort: filters.sort,
        filter: filters.filter,
        ...(filters.reaction && { reaction: filters.reaction }),
        ...(filters.search && { search: filters.search })
      });

      const response = await feedService.getComments(postId, params.toString());
      
      if (reset) {
        setComments(response.comments || []);
      } else {
        setComments(prev => [...prev, ...(response.comments || [])]);
      }
      
      setPagination(response.pagination || {});
      setError(null);
        } catch (err) {
      setError('Failed to load comments');
      console.error('Error fetching comments:', err);
        } finally {
      setLoading(false);
    }
  }, [postId, filters]);

    useEffect(() => {
    if (postId) {
      fetchComments(1, true);
    }
  }, [postId, filters]);

  // Add new comment
  const handleAddComment = async (commentData) => {
    setSubmitting(true);
    try {
      await feedService.addComment(postId, commentData);
      await fetchComments(1, true); // Refresh comments
      showToast('Comment posted successfully', 'success');
        } catch (error) {
      showToast('Failed to post comment', 'error');
      console.error('Error adding comment:', error);
        } finally {
      setSubmitting(false);
    }
  };

    // Like/unlike comment
  const handleLikeComment = async (commentId, reactionType = 'like') => {
        try {
      const response = await feedService.toggleCommentReaction(commentId, reactionType);
            
            setComments(prevComments => 
                prevComments.map(comment => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
              userReaction: response.userReaction,
              reactionCounts: response.reactionCounts
            };
                        }
          return comment;
                })
      );
      
      return response;
        } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  // Reply to comment
  const handleReplyComment = async (commentId, replyData) => {
    try {
      await feedService.addComment(postId, {
        ...replyData,
        parentCommentId: commentId
      });
      await fetchComments(1, true); // Refresh comments
    } catch (error) {
      console.error('Error replying to comment:', error);
      throw error;
    }
  };

  // Edit comment
  const handleEditComment = async (commentId, editData) => {
    try {
      const response = await feedService.updateComment(commentId, editData);
      
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, ...response };
          }
          return comment;
        })
      );
      
      return response;
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  };

    // Delete comment
    const handleDeleteComment = async (commentId) => {
    try {
      await feedService.deleteComment(commentId);
      setComments(prevComments => prevComments.filter(c => c._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  // Report comment
  const handleReportComment = async (commentId, reportData) => {
    try {
      await feedService.reportComment(commentId, reportData);
    } catch (error) {
      console.error('Error reporting comment:', error);
      throw error;
    }
  };

  // Pin/unpin comment
  const handlePinComment = async (commentId) => {
    try {
      const response = await feedService.pinComment(commentId);
      
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, isPinned: response.isPinned };
          }
          return comment;
        })
      );
      
      return response;
    } catch (error) {
      console.error('Error pinning comment:', error);
      throw error;
    }
  };

  // Load replies for a comment
  const loadReplies = async (commentId) => {
    if (commentReplies[commentId]) return; // Already loaded
    
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      const response = await feedService.getCommentReplies(commentId);
      setCommentReplies(prev => ({ ...prev, [commentId]: response.replies || [] }));
    } catch (error) {
      showToast('Failed to load replies', 'error');
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // Toggle replies visibility
  const toggleReplies = async (commentId) => {
    const isExpanded = expandedReplies.has(commentId);
    
    if (!isExpanded) {
      // Load replies if not already loaded
      await loadReplies(commentId);
    }
    
    setExpandedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Load more comments
  const loadMore = () => {
    if (pagination.hasMore && !loading) {
      fetchComments(pagination.currentPage + 1);
    }
  };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Comment Input */}
            <CommentInput
                userinfo={userinfo}
        onSubmit={handleAddComment}
        loading={submitting}
      />

      {/* Filters */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {pagination.totalComments} comment{pagination.totalComments !== 1 ? 's' : ''}
          </h3>
          
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="top">Top</option>
              <option value="trending">Trending</option>
            </select>

            {/* Filter Dropdown */}
            <select
              value={filters.filter}
              onChange={(e) => setFilters(prev => ({ ...prev, filter: e.target.value }))}
              className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300"
            >
              <option value="all">All</option>
              <option value="top">Top</option>
              <option value="replies">Replies</option>
              <option value="media">Media</option>
            </select>
          </div>
        </div>
      </div>

            {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
        </div>
            ) : error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 text-sm">{error}</p>
                            <button
            onClick={() => fetchComments(1, true)}
            className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                            >
            Try again
                            </button>
                    </div>
      ) : comments.length > 0 ? (
                    <div>
          <div className="max-h-96 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment._id}>
                            <CommentItem
                                comment={comment}
                                userinfo={userinfo}
                  onLike={handleLikeComment}
                  onReply={handleReplyComment}
                  onDelete={handleDeleteComment}
                  onEdit={handleEditComment}
                  onReport={handleReportComment}
                  onPin={handlePinComment}
                  canModerate={true} // TODO: Check user permissions
                  depth={0}
                  showReplies={expandedReplies.has(comment._id)}
                  onToggleReplies={() => toggleReplies(comment._id)}
                />
                
                {/* Show Replies */}
                {expandedReplies.has(comment._id) && (
                  <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {loadingReplies[comment._id] ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading replies...</p>
                      </div>
                    ) : commentReplies[comment._id] ? (
                      commentReplies[comment._id].map((reply) => (
                        <CommentItem
                          key={reply._id}
                          comment={reply}
                          userinfo={userinfo}
                          onLike={handleLikeComment}
                          onReply={handleReplyComment}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                          onReport={handleReportComment}
                          onPin={handlePinComment}
                          canModerate={true}
                          depth={1}
                          showReplies={false}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No replies yet
                      </div>
                    )}
                  </div>
                )}
              </div>
                        ))}
                    </div>
          
          {/* Load More */}
          {pagination.hasMore && (
            <div className="p-4 text-center">
                        <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        >
                {loading ? 'Loading...' : 'Load more comments'}
                        </button>
            </div>
                    )}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
  );
};

export default CommentSection; 