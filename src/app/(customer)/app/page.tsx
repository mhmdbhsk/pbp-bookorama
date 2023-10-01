'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/store/cart';
import { IconPlus } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

export default function Home() {
  const [open, setOpen] = useState<string | null>(null);

  const handleOpen = (value: string | null) => {
    if (open !== null) {
      setOpen(null);
    }
    if (value) {
      setOpen(value);
    }
  };

  const { data: booksData, isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axios.get('/api/books');
      return res.data;
    },
  });
  const { data: bookData, isLoading: bookLoading } = useQuery({
    queryKey: ['book'],
    queryFn: async () => {
      const res = await axios.get(`/api/book/${open}`);
      return res.data;
    },
    enabled: open !== null,
  });

  console.log(bookData);

  const { addToCart } = useCart();

  const addToCartHandler = (book: any) => {
    if (useCart.getState().cart.some((b) => b.isbn === book.isbn)) {
      toast.error('Buku sudah ada di keranjang');
      return;
    }

    addToCart(book);
    toast.success('Berhasil menambahkan buku ke keranjang');
  };

  return (
    <div className='w-full flex flex-col p-0 gap-4'>
      <Dialog open={open !== null} onOpenChange={() => handleOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Buku</DialogTitle>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between w-full mt-4'>
                <span className='font-semibold'>Judul</span>
                {bookLoading ? (
                  <Skeleton className='h-3 w-9' />
                ) : (
                  <span>{bookData?.data.title}</span>
                )}
              </div>
              <div className='flex justify-between w-full'>
                <span className='font-semibold'>Pengarang</span>
                {bookLoading ? (
                  <Skeleton className='h-3 w-9' />
                ) : (
                  <span>{bookData?.data.author}</span>
                )}
              </div>
              <div className='flex justify-between w-full'>
                <span className='font-semibold'>Harga</span>
                {bookLoading ? (
                  <Skeleton className='h-3 w-9' />
                ) : (
                  <span>
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(bookData?.data.price)}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='flex flex-col gap-4'>
        <h3 className='font-bold text-lg'>Buku Terbaru</h3>

        <div className='flex gap-4 w-full'>
          {!booksLoading
            ? (booksData as any)?.data.slice(0, 3).map((book: any) => (
                <Card
                  key={book.isbn}
                  className='w-full flex-1 flex flex-col p-4'
                  onClick={() => handleOpen(book.isbn)}
                >
                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-col'>
                      <span className='font-semibold'>{book.title}</span>
                      <span className='text-sm text-gray-400'>
                        {book.author}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(book.price)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size='sm'
                    className='flex gap-1 mt-2'
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCartHandler(book);
                    }}
                  >
                    <IconPlus size={14} stroke={3} /> Tambah
                  </Button>
                </Card>
              ))
            : [1, 2, 3].map((book) => (
                <Skeleton key={book} className='w-full h-32 bg-gray-200' />
              ))}
        </div>
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <h3 className='font-bold text-lg'>Semua Buku</h3>

        <div className='grid grid-cols-2 gap-4'>
          {!booksLoading
            ? (booksData as any)?.data.map((book: any) => (
                <Card
                  key={book.isbn}
                  className='w-full flex-1 flex flex-col p-4'
                >
                  <div className='flex justify-between items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='font-semibold'>{book.title}</span>
                      <span className='text-sm text-gray-400'>
                        {book.author}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(book.price)}
                      </span>
                    </div>
                  </div>

                  <Button
                    size='sm'
                    className='flex gap-1 mt-2'
                    variant='outline'
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCartHandler(book);
                    }}
                  >
                    <IconPlus size={14} stroke={3} /> Tambah
                  </Button>
                </Card>
              ))
            : [1, 2, 3, 4].map((book) => (
                <Skeleton key={book} className='w-full h-32 bg-gray-200' />
              ))}
        </div>
      </div>
    </div>
  );
}
