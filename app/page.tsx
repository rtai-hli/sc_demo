'use client';

import { useEffect, useState } from 'react';
import Wheel from '@/components/Wheel';
import RecipeManager from '@/components/RecipeManager';
import { WheelItem } from '@/lib/types';

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchWheelItems();
    }
  }, [userId]);

  const initializeUser = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setUserId(data.userId);
    } catch (error) {
      console.error('Failed to initialize user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWheelItems = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(`/api/wheel?userId=${userId}`);
      const data = await response.json();
      setWheelItems(data);
    } catch (error) {
      console.error('Failed to fetch wheel items:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            🍽️ What to Eat Today
          </h1>
          <p className="text-lg text-gray-600">
            Spin the wheel to randomly decide what to eat!
          </p>
        </header>

        {/* Main Content - Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Wheel Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:sticky lg:top-8">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <Wheel items={wheelItems} />
            </div>
          </div>

          {/* Recipe Management Section */}
          <div className="w-full lg:w-1/2">
            <RecipeManager 
              userId={userId!} 
              wheelItems={wheelItems}
              onWheelUpdate={fetchWheelItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
