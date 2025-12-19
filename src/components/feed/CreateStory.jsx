import React, { useState } from 'react'
import { FaTimes, FaPalette, FaFont, FaImage, FaSmile } from 'react-icons/fa'
import { feedService } from '../../services/feedService'

const CreateStory = ({ userinfo, onStoryCreated, onClose }) => {
    const [content, setContent] = useState('')
    const [background, setBackground] = useState('#000000')
    const [textColor, setTextColor] = useState('#ffffff')
    const [font, setFont] = useState('Arial')
    const [fontSize, setFontSize] = useState(16)
    const [loading, setLoading] = useState(false)

    const backgroundOptions = [
        '#000000', '#1a1a1a', '#2d2d2d', '#404040',
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
    ]

    const fontOptions = [
        'Arial', 'Helvetica', 'Times New Roman', 'Georgia',
        'Verdana', 'Courier New', 'Impact', 'Comic Sans MS'
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) return

        setLoading(true)
        try {
            const storyData = {
                content: content.trim(),
                background,
                textColor,
                font,
                fontSize,
                mediaType: 'text'
            }

            await feedService.createStory(storyData)
            onStoryCreated?.()
            onClose?.()
        } catch (error) {
            console.error('Error creating story:', error)
            alert('Failed to create story. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Story</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Story Preview */}
                <div className="p-4">
                    <div 
                        className="w-full h-32 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                        style={{ backgroundColor: background }}
                    >
                        <div 
                            className="text-center px-4"
                            style={{
                                color: textColor,
                                fontFamily: font,
                                fontSize: `${fontSize}px`
                            }}
                        >
                            {content || 'Your story text will appear here...'}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Content Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Story Text
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                            rows="3"
                            maxLength="500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {content.length}/500 characters
                        </p>
                    </div>

                    {/* Background Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Background Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {backgroundOptions.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setBackground(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        background === color 
                                            ? 'border-blue-500 scale-110' 
                                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Text Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Text Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {['#ffffff', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57'].map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setTextColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        textColor === color 
                                            ? 'border-blue-500 scale-110' 
                                            : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Font Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font
                        </label>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        >
                            {fontOptions.map((fontOption) => (
                                <option key={fontOption} value={fontOption}>
                                    {fontOption}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Font Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Font Size: {fontSize}px
                        </label>
                        <input
                            type="range"
                            min="12"
                            max="48"
                            value={fontSize}
                            onChange={(e) => setFontSize(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!content.trim() || loading}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Story'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateStory 