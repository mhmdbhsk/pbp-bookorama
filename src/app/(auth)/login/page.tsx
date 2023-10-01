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
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession, signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { data: sessionData } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: FormData) {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl,
      redirect: true,
    });

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className='mx-auto w-screen min-h-screen flex items-center justify-center'>
      <Card className='max-w-md mx-auto'>
        <CardHeader>
          <h2 className='font-semibold'>Masuk</h2>
          <CardDescription className='text-xs'>
            Masukkan kredensial anda untuk menggunakan aplikasi ini
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col'>
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

              <Button type='submit' className='mt-4'>
                Masuk
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}