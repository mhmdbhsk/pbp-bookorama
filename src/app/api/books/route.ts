import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  const books = await prisma.books.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json({
    data: books,
    status: 'success',
    message: 'Books fetched successfully',
  });
}
