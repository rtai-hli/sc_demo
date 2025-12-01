'use client';

import { useEffect, useState } from 'react';
import { PopularRecipe, WheelItem } from '@/lib/types';

interface RecipeManagerProps {
  userId: string;
  wheelItems: WheelItem[];
  onWheelUpdate: () => void;
}

export default function RecipeManager({ userId, wheelItems, onWheelUpdate }: RecipeManagerProps) {
  const [popularRecipes, setPopularRecipes] = useState<PopularRecipe[]>([]);
  const [customRecipeName, setCustomRecipeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  const fetchPopularRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/popular');
      const data = await response.json();
      setPopularRecipes(data);
    } catch (err) {
      console.error('Failed to fetch popular recipes:', err);
    }
  };

  const addCustomRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRecipeName.trim()) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/recipes/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, name: customRecipeName.trim() }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add custom recipe');
      }
      
      setCustomRecipeName('');
      setSuccess('Custom recipe added successfully!');
      onWheelUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to add custom recipe');
    } finally {
      setLoading(false);
    }
  };

  const addPopularRecipe = async (recipeName: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, recipeName, sourceType: 'popular' }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add recipe to wheel');
      }
      
      setSuccess('Recipe added to wheel!');
      onWheelUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to add recipe to wheel');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWheel = async (recipeName: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch(`/api/wheel?userId=${userId}&recipeName=${encodeURIComponent(recipeName)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove recipe from wheel');
      }
      
      setSuccess('Recipe removed from wheel!');
      onWheelUpdate();
    } catch (err: any) {
      setError(err.message || 'Failed to remove recipe from wheel');
    } finally {
      setLoading(false);
    }
  };

  const isInWheel = (recipeName: string) => {
    return wheelItems.some(item => item.recipe_name === recipeName);
  };

  const canAddMore = wheelItems.length < 12;

  return (
    <div className="space-y-6">
      {/* Custom Recipe Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Add Custom Recipe</h2>
        <form onSubmit={addCustomRecipe} className="flex gap-2">
          <input
            type="text"
            value={customRecipeName}
            onChange={(e) => setCustomRecipeName(e.target.value)}
            placeholder="Enter recipe name..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading || !canAddMore}
          />
          <button
            type="submit"
            disabled={loading || !canAddMore || !customRecipeName.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
        {!canAddMore && (
          <p className="text-sm text-red-500 mt-2">Wheel is full (maximum 12 recipes)</p>
        )}
      </div>

      {/* Popular Recipes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Popular Recipes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {popularRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => addPopularRecipe(recipe.name)}
              disabled={loading || isInWheel(recipe.name) || !canAddMore}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                isInWheel(recipe.name)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : canAddMore
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {recipe.name}
              {isInWheel(recipe.name) && ' ✓'}
            </button>
          ))}
        </div>
      </div>

      {/* Current Wheel Items */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Your Wheel ({wheelItems.length}/12)
        </h2>
        {wheelItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recipes in wheel yet. Add some to get started!</p>
        ) : (
          <div className="space-y-2">
            {wheelItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium">{item.recipe_name}</span>
                  <span className="text-xs text-gray-500">({item.source_type})</span>
                </div>
                <button
                  onClick={() => removeFromWheel(item.recipe_name)}
                  disabled={loading}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}

