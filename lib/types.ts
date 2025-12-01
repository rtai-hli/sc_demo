export interface User {
  id: string;
  created_at: string;
}

export interface PopularRecipe {
  id: number;
  name: string;
}

export interface CustomRecipe {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
}

export interface WheelItem {
  id: number;
  user_id: string;
  recipe_name: string;
  source_type: 'popular' | 'custom';
  color: string;
  created_at: string;
}

// Color palette for wheel segments
export const WHEEL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52BE80',
  '#EC7063', '#5DADE2'
];

