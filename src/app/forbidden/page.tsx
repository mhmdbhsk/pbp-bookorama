'use client';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Forbidden() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const handleBackRoute = () => {
    if ((sessionData?.user?.role as unknown) === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/app');
    }
  };

  return (
    <div className='min-h-screen flex flex-col gap-4 items-center justify-center'>
      <span className='text-6xl font-bold'>403</span>
      <span className='text-xl font-semibold'>Akses Terlarang</span>
      <span className='text-center text-sm'>
        Silahkan akses menggunakan akun yang sesuai
      </span>

      <Button size='sm' variant='outline' onClick={handleBackRoute}>
        Kembali ke halaman utama
      </Button>
    </div>
  );
}
