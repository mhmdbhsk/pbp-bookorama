import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const orders = await prisma.orders.findMany({});

  return NextResponse.json({
    data: orders,
    status: 'success',
    message: 'Orders fetched successfully',
  });
}
