import { NextResponse } from 'next/server';
import { getUserCustomRecipes, createCustomRecipeAndAddToWheel } from '@/lib/db-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const recipes = getUserCustomRecipes(userId);
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch custom recipes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, name } = await request.json();
    
    if (!userId || !name) {
      return NextResponse.json({ error: 'User ID and name required' }, { status: 400 });
    }
    
    createCustomRecipeAndAddToWheel(userId, name);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create custom recipe' }, { status: 400 });
  }
}

