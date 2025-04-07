import React from 'react';
import { Droplets, Cloud, Waves } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-blue-900 bg-opacity-90 z-50">
      <div className="text-center">
        {/* Main water animation */}
        <div className="relative h-32 w-32 flex items-center justify-center">
          {/* Outer ripple */}
          <div className="absolute w-32 h-32 rounded-full border-4 border-blue-300 opacity-30 animate-ping"></div>
          
          {/* Middle ripple */}
          <div className="absolute w-24 h-24 rounded-full border-4 border-blue-400 opacity-50 animate-ping" style={{ animationDelay: '300ms' }}></div>
          
          {/* Inner ripple */}
          <div className="absolute w-16 h-16 rounded-full border-4 border-blue-500 opacity-70 animate-ping" style={{ animationDelay: '600ms' }}></div>
          
          {/* Center droplet icon */}
          <Droplets 
            className="relative text-blue-400 animate-bounce" 
            size={40} 
            strokeWidth={2} 
          />
        </div>
        
        {/* Waves animation */}
        <div className="flex justify-center mt-8 space-x-4">
          <Waves 
            className="text-blue-400 animate-pulse" 
            size={24} 
            style={{ animationDelay: '0ms' }} 
          />
          <Waves 
            className="text-blue-300 animate-pulse" 
            size={24} 
            style={{ animationDelay: '300ms' }} 
          />
          <Waves 
            className="text-blue-200 animate-pulse" 
            size={24} 
            style={{ animationDelay: '600ms' }} 
          />
        </div>
        
        {/* Clouds - floating effect */}
        <div className="relative h-24 w-full mt-4">
          <Cloud 
            className="absolute left-1/4 text-blue-200 opacity-70 animate-pulse" 
            size={20} 
            style={{ animationDuration: '3s' }} 
          />
          <Cloud 
            className="absolute left-1/2 text-blue-200 opacity-70 animate-pulse" 
            size={16} 
            style={{ animationDuration: '4s', animationDelay: '1s' }} 
          />
          <Cloud 
            className="absolute right-1/4 text-blue-200 opacity-70 animate-pulse" 
            size={24} 
            style={{ animationDuration: '5s', animationDelay: '2s' }} 
          />
        </div>
        
        {/* Loading text */}
        <p className="text-2xl font-medium text-blue-100">
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>L</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '50ms' }}>o</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '100ms' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '150ms' }}>d</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>i</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '250ms' }}>n</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>g</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '350ms' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '400ms' }}>.</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '450ms' }}>.</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
