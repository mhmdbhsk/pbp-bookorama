import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function POST(request: Request) {
  const req = await request.json();

  try {
    const category = await prisma.categories.create({
      data: {
        name: req.name,
      },
    });

    return NextResponse.json({
      data: category,
      status: 'success',
      message: 'Category created successfully',
    });
  } catch (e) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Server sedang mengalami gangguan`,
        fullMessage: e,
      },
      { status: 500 }
    );
  }
}
