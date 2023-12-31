'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function AppPage() {
  const { data } = useSession();

  if (!data) {
    return redirect('/login');
  }

  if (data) {
    if ((data?.user?.role as unknown) === 'ADMIN') {
      return redirect('/admin');
    } else {
      return redirect('/app');
    }
  }

  return (
    <div className='flex flex-col gap-3 items-center h-screen justify-center'>
      <svg
        className='-ml-1 mr-3 h-14 w-14 animate-spin'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
        />
      </svg>

      <span>Memuat...</span>
    </div>
  );
}
