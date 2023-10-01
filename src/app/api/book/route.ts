import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function POST(request: Request) {
  const req = await request.json();

  try {
    const book = await prisma.books.create({
      data: {
        author: req.author,
        title: req.title,
        isbn: req.isbn,
        price: req.price,
        adminId: req.adminId,
        categoryId: req.categoryId,
      },
    });

    return NextResponse.json({
      data: book,
      status: 'success',
      message: 'Book created successfully',
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError)
      if (e.code === 'P2002') {
        return NextResponse.json(
          {
            status: 'error',
            message: `Sudah ada buku dengan ISBN ${req.isbn}. Silahkan coba lagi dengan ISBN yang berbeda`,
            field: 'isbn',
          },
          { status: 400 }
        );
      }

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
