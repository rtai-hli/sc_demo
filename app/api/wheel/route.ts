import { NextResponse } from 'next/server';
import { getUserWheelItems, addRecipeToWheel, removeRecipeFromWheel } from '@/lib/db-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const items = getUserWheelItems(userId);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wheel items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, recipeName, sourceType } = await request.json();
    
    if (!userId || !recipeName || !sourceType) {
      return NextResponse.json({ error: 'User ID, recipe name, and source type required' }, { status: 400 });
    }
    
    addRecipeToWheel(userId, recipeName, sourceType);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add recipe to wheel' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const recipeName = searchParams.get('recipeName');
    
    if (!userId || !recipeName) {
      return NextResponse.json({ error: 'User ID and recipe name required' }, { status: 400 });
    }
    
    removeRecipeFromWheel(userId, recipeName);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to remove recipe from wheel' }, { status: 400 });
  }
}

