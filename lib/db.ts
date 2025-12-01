import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'food-wheel.db');
const db = new Database(dbPath);

// Initialize database schema
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Popular recipes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS popular_recipes (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // User custom recipes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_custom_recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // User wheel items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_wheel_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      recipe_name TEXT NOT NULL,
      source_type TEXT NOT NULL CHECK(source_type IN ('popular', 'custom')),
      color TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, recipe_name)
    )
  `);

  // Initialize popular recipes if empty
  const popularCount = db.prepare('SELECT COUNT(*) as count FROM popular_recipes').get() as { count: number };
  if (popularCount.count === 0) {
    const popularRecipes = [
      'Pizza', 'Burger', 'Sushi', 'Pasta', 'Tacos', 'Ramen',
      'Fried Chicken', 'Salad', 'Steak', 'Soup', 'Sandwich', 'Curry',
      'BBQ', 'Seafood', 'Dessert', 'Breakfast', 'Chinese Food', 'Italian Food'
    ];
    
    const insert = db.prepare('INSERT INTO popular_recipes (name) VALUES (?)');
    const insertMany = db.transaction((recipes: string[]) => {
      for (const recipe of recipes) {
        insert.run(recipe);
      }
    });
    insertMany(popularRecipes);
  }
}

// Initialize database on import
initDatabase();

export default db;

