'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Orders } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
require('dayjs/locale/id');
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
dayjs.locale('id');

dayjs().format('L LT');

export default function OrdersPage() {
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await axios.get('/api/orders');
      return res.data;
    },
  });

  const [open, setOpen] = useState<string | null>(null);

  const handleOpen = (value: string | null) => {
    if (open !== null) {
      setOpen(null);
    }
    if (value) {
      setOpen(value);
    }
  };

  return (
    <div className='w-full flex flex-col p-0'>
      <Dialog open={open !== null} onOpenChange={() => handleOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='flex flex-col gap-4 w-full'>
        <h3 className='font-bold text-lg'>Semua Pesanan</h3>

        <div className='flex flex-col gap-4'>
          {!ordersLoading
            ? (ordersData as any)?.data.map((order: Orders) => (
                <Card
                  key={order.id}
                  className='w-full flex-1 flex flex-col p-4'
                >
                  <div className='flex justify-between items-center gap-4'>
                    <div className='flex flex-col'>
                      <span className='font-semibold'>
                        {dayjs(order.date).format('L LT')}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        }).format(order.amount)}
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            : [1, 2, 3, 4].map((order) => (
                <Skeleton key={order} className='w-full h-32 bg-gray-200' />
              ))}
        </div>
      </div>
    </div>
  );
}
