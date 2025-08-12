"use client"
import React from 'react';
import { Shield, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Icon container */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4 animate-bounce">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            
            {/* Error code */}
            <div className="text-6xl font-bold text-white mb-2 tracking-tight">
              4<span className="text-red-400">0</span>3
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h1>
            
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed">
              You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
            </p>
          </div>

          {/* Warning section */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-400 font-semibold text-sm mb-1">
                  Restricted Area
                </h3>
                <p className="text-yellow-200 text-xs leading-relaxed">
                  This page requires special permissions. If you need access, please request authorization from your system administrator.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/30 flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-xs">
              Error Code: UNAUTHORIZED_ACCESS_403
            </p>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-ping animation-delay-1000"></div>
        <div className="absolute top-1/2 -right-4 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-ping animation-delay-2000"></div>
      </div>
    </div>
  );
}