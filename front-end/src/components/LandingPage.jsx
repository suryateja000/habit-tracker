// src/components/SimpleLandingPage.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import hero from '../public/hero.png';

export default function SimpleLandingPage() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleRegister = () => {
    navigate('/register')
  }

  const floatingTags = [
    { text: "Health", position: "bottom-38 right-25 -translate-x-1/2" },         
    { text: "Fitness", position: "top-16 left-12" },                         
    { text: "Mindfulness", position: "top-16 right-12" },                   
    { text: "Creativity", position: "top-34 left-1/4" },                     
    { text: "Inspiration", position: "top-28 right-8" },                   
    { text: "Productive", position: "top-1/2 right-10 -translate-y-1/2" },    
    { text: "Learning", position: "bottom-29 left-14 " },                    
    { text: "Focus", position: "bottom-16 right-1/4" },                      
    { text: "Growth", position: "bottom-18 left-32 -translate-x-1/2" },     
    { text: "Balance", position: "top-1/2 left-10 -translate-y-1/2" }         
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      {/* Header with Login/Signup */}
      <header className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800">
            HabitTracker
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={handleLogin}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 bg-white text-slate-700 font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md text-xs sm:text-sm md:text-base"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm md:text-base"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex items-center pt-16 sm:pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            
            {/* Left Side - Enhanced Content */}
            <div className="space-y-6 sm:space-y-8 md:space-y-10 text-center lg:text-left order-2 lg:order-1">

              {/* Main Title Section */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <h1 className="relative">
                  <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-800 leading-[0.9] tracking-tight">
                    HABIT
                  </span>
                  <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 leading-[0.9] tracking-tight">
                    TRACKER
                  </span>
                  {/* Decorative underline */}
                  <div className="absolute -bottom-2 left-0 lg:left-0 right-0 lg:right-auto h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full w-20 sm:w-24 md:w-32 mx-auto lg:mx-0"></div>
                </h1>

                {/* Enhanced Subtitle */}
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-slate-700 leading-tight">
                    Transform your daily routines into 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600"> powerful habits</span>
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4 sm:space-y-5">
                <button
                  onClick={handleRegister}
                  className="group relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-base sm:text-lg md:text-xl rounded-2xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Start Your Journey
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>

            {/* Right Side - Image with Floating Tags */}
            <div className="relative order-1 lg:order-2">
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl mx-2 sm:mx-0">
                <div className="aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                  {/* Hero Image Element */}
                  <div className="w-full h-full relative">
                    <img 
                      src={hero} 
                      alt="Habit Tracker Hero" 
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
                    />
                    {/* Optional overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-900/10 to-transparent rounded-xl sm:rounded-2xl"></div>
                  </div>
                </div>
                
                {/* Floating Tags */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {floatingTags.map((tag, index) => (
                    <div
                      key={index}
                      className={`absolute ${tag.position} animate-bounce`}
                      style={{
                        animationDelay: `${index * 0.4}s`,
                        animationDuration: '3s'
                      }}
                    >
                      <div className="bg-white text-slate-700 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium shadow-lg border border-violet-100 hover:scale-105 transition-transform duration-300 whitespace-nowrap pointer-events-auto hover:bg-violet-50">
                        {tag.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 md:-top-4 md:-left-4 w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full opacity-80 shadow-lg"></div>
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 md:-bottom-6 md:-right-6 w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full opacity-70 shadow-lg"></div>
                <div className="absolute top-1/2 -left-3 sm:-left-4 md:-left-8 w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full opacity-75 shadow-lg"></div>              
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
