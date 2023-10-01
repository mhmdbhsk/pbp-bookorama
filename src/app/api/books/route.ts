import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const books = await prisma.books.findMany({});

  return NextResponse.json({
    data: books,
    status: 'success',
    message: 'Books fetched successfully',
  });
}
