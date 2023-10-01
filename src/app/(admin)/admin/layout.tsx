'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useSession();
  const nav = [
    {
      label: 'Ikhtisar',
      href: '/admin',
    },
    {
      label: 'Buku',
      href: '/admin/books',
    },
    {
      label: 'Kategori',
      href: '/admin/categories',
    },
  ];
  const pathname = usePathname();
  const router = useRouter();
  const selectedNav = (item: string) => pathname === item;

  return (
    <div className='container max-w-2xl mx-auto min-h-screen flex justify-center pt-[74px]'>
      <div className='fixed top-0 w-full mx-auto border border-gray-100 bg-white/50 backdrop-blur-sm'>
        <div className='flex container mx-auto max-w-2xl py-4 justify-between items-center'>
          <div className='flex gap-4 items-center'>
            <span className='font-bold'>Bookorama</span>

            <div className='flex gap-2'>
              {nav.map((item) => (
                <Button
                  size='sm'
                  className={cn(selectedNav(item.href) && 'bg-neutral-200')}
                  variant='ghost'
                  key={item.href}
                  onClick={() => router.push(item.href)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex gap-4 items-center'>
            <Avatar>
              <AvatarFallback>{data?.user?.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <Button size='sm' onClick={() => signOut()}>
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className='py-4 w-full'>{children}</div>
    </div>
  );
}
