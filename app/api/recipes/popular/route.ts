import { NextResponse } from 'next/server';
import { getAllPopularRecipes } from '@/lib/db-utils';

export async function GET() {
  try {
    const recipes = getAllPopularRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch popular recipes' }, { status: 500 });
  }
}

