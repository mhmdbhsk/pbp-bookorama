import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const categories = await prisma.categories.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return NextResponse.json({
    data: categories,
    status: 'success',
    message: 'Categories fetched successfully',
  });
}
