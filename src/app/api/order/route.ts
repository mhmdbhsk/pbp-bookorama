import prisma from '@/lib/prisma';
import { Books, Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const order = await prisma.orders.create({
      data: {
        customerId: body.userId,
        orderItems: {
          createMany: {
            data: body.cart.map((book: Books) => ({
              isbn: book.isbn,
              quantity: 1,
            })),
          },
        },
        amount: body.cart.reduce(
          (total: any, book: any) => total + book.price,
          0
        ),
      },
    });

    return NextResponse.json({
      data: order,
      status: 'success',
      message: 'Order created successfully',
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
