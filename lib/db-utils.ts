import db from './db';
import { v4 as uuidv4 } from 'uuid';
import { WHEEL_COLORS } from './types';

// User management
export function getOrCreateUserId(): string {
  // Try to get existing user ID from database
  const user = db.prepare('SELECT id FROM users LIMIT 1').get() as { id: string } | undefined;
  
  if (user) {
    return user.id;
  }
  
  // Create new user
  const newUserId = uuidv4();
  db.prepare('INSERT INTO users (id) VALUES (?)').run(newUserId);
  return newUserId;
}

// Popular recipes
export function getAllPopularRecipes() {
  return db.prepare('SELECT * FROM popular_recipes ORDER BY name').all();
}

// Custom recipes
export function getUserCustomRecipes(userId: string) {
  return db.prepare('SELECT * FROM user_custom_recipes WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export function createCustomRecipe(userId: string, name: string) {
  // Check if custom recipe already exists for this user
  const existing = db.prepare('SELECT id FROM user_custom_recipes WHERE user_id = ? AND name = ?').get(userId, name);
  if (existing) {
    throw new Error('Custom recipe already exists');
  }
  
  const result = db.prepare('INSERT INTO user_custom_recipes (user_id, name) VALUES (?, ?)').run(userId, name);
  return result.lastInsertRowid;
}

// Wheel items
export function getUserWheelItems(userId: string) {
  return db.prepare('SELECT * FROM user_wheel_items WHERE user_id = ? ORDER BY created_at ASC').all(userId);
}

export function addRecipeToWheel(userId: string, recipeName: string, sourceType: 'popular' | 'custom') {
  // Check if already in wheel
  const existing = db.prepare('SELECT id FROM user_wheel_items WHERE user_id = ? AND recipe_name = ?').get(userId, recipeName);
  if (existing) {
    throw new Error('Recipe already in wheel');
  }
  
  // Check wheel limit (max 12)
  const count = db.prepare('SELECT COUNT(*) as count FROM user_wheel_items WHERE user_id = ?').get(userId) as { count: number };
  if (count.count >= 12) {
    throw new Error('Wheel can only have a maximum of 12 recipes');
  }
  
  // Assign color based on current count
  const color = WHEEL_COLORS[count.count % WHEEL_COLORS.length];
  
  const result = db.prepare('INSERT INTO user_wheel_items (user_id, recipe_name, source_type, color) VALUES (?, ?, ?, ?)')
    .run(userId, recipeName, sourceType, color);
  
  return result.lastInsertRowid;
}

export function removeRecipeFromWheel(userId: string, recipeName: string) {
  return db.prepare('DELETE FROM user_wheel_items WHERE user_id = ? AND recipe_name = ?').run(userId, recipeName);
}

export function createCustomRecipeAndAddToWheel(userId: string, name: string) {
  // Create custom recipe
  createCustomRecipe(userId, name);
  // Add to wheel
  addRecipeToWheel(userId, name, 'custom');
}

