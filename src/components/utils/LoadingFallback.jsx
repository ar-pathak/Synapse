import React from 'react';

const LoadingFallback = () => {
    return (
        <div className="min-h-screen bg-[#1A1B1E] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {/* Outer ring */}
                    <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
                    {/* Spinning ring */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <p className="text-white/60 text-lg">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingFallback; 