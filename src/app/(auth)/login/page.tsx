'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Alert } from '@/components/ui/alert';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl,
    });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className='mx-auto w-screen min-h-screen flex items-center justify-center flex-col gap-4'>
      <span className='font-bold text-2xl'>Bookorama</span>
      <Card className='max-w-md mx-auto'>
        <CardHeader className='pb-3'>
          <h2 className='font-semibold'>Masuk</h2>
          <CardDescription className='text-xs'>
            Masukkan kredensial anda untuk menggunakan aplikasi ini
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Masukkan email anda' {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kata Sandi</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Masukkan kata sandi anda'
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {!!error && <p className='text-error'>ERROR: {error}</p>}

              <Button loading={isLoading} type='submit' className='mt-4 w-full'>
                Masuk
              </Button>
            </form>
          </Form>

          <Alert className='max-w-md mx-auto p-4 flex flex-col text-sm gap-2'>
            <p className='text-sm'>Akun untuk mencoba aplikasi ini:</p>

            <div className='flex flex-col gap-2'>
              <span className='font-bold'>Admin</span>
              <div className='flex flex-col'>
                <span>
                  <b>
                    <code>admin@test.com</code>
                  </b>{' '}
                  /{' '}
                  <b>
                    <code>admin</code>
                  </b>
                </span>
                <span></span>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-bold'>Customer</span>
              <div className='flex flex-col'>
                <span>
                  <b>
                    <code>user@test.com</code>
                  </b>{' '}
                  /{' '}
                  <b>
                    <code>user</code>
                  </b>
                </span>
                <span></span>
              </div>
            </div>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
