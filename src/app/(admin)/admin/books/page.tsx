'use client';

import { BooksDataTable } from './components/data-table-books';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Categories } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BooksPage() {
  const { data: sessionData } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | number | null>(null);
  const form = useForm({
    defaultValues: {
      isbn: '',
      title: '',
      author: '',
      price: '',
      category: '',
    },
    mode: 'all',
  });

  const {
    data: booksData,
    refetch: refetchBooks,
    isLoading: booksLoading,
  } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const res = await axios.get('/api/books');
      return res.data;
    },
  });
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    },
  });

  const isLoading = categoriesLoading || booksLoading;

  const handleOpen = (value: string | null) => {
    resetForm();
    if (open !== null) {
      setOpen(null);
    }
    if (value) {
      setOpen(value);
    }
  };

  const resetForm = () => {
    form.reset({
      isbn: '',
      title: '',
      author: '',
      price: '',
      category: '',
    });
  };

  const createSubmit = async (data: any) => {
    const body = {
      author: data.author,
      title: data.title,
      isbn: data.isbn,
      price: Number(data.price),
      adminId: Number(sessionData?.user?.id),
      categoryId: Number(data.category),
    };

    try {
      await axios.post('/api/book', body);
      handleOpen(null);
      refetchBooks();
      setError(null);
      toast.success('Buku berhasil ditambahkan!');
      resetForm();
    } catch (error: any) {
      toast.error('Buku gagal ditambahkan!');
      if (error.response.status === 400) {
        form.setError(error?.response?.data.field, {
          type: 'manual',
          message: error?.response?.data.message,
        });
      } else {
        setError(error?.response?.data.message);
      }
    }
  };

  const editSubmit = async (data: any) => {
    const body = {
      isbn: data.isbn,
      title: data.title,
      author: data.author,
      price: Number(data.price),
      categoryId: Number(data.category),
    };

    try {
      await axios.put(`/api/book/${open}`, body);
      handleOpen(null);
      refetchBooks();
      setError(null);
      toast.success('Buku berhasil diubah!');
      resetForm();
    } catch (error: any) {
      toast.error('Buku gagal diubah!');
      if (error.response.status === 400) {
        form.setError(error?.response?.data.field, {
          type: 'manual',
          message: error?.response?.data.message,
        });
      } else {
        setError(error?.response?.data.message);
      }
    }
  };

  const onSubmit = (data: any) => {
    if (open === 'addBooks') {
      createSubmit(data);
    } else {
      editSubmit(data);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/book/${id}`);
      refetchBooks();
      toast.success('Buku berhasil dihapus!');
      setError(null);
    } catch (error) {
      toast.success('Buku gagal dihapus!');
      setError(null);
      console.log(error);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      handleOpen(id);
      const res = await axios.get(`/api/book/${id}`);

      form.setValue('isbn', res.data.data.isbn);
      form.setValue('title', res.data.data.title);
      form.setValue('author', res.data.data.author);
      form.setValue('price', res.data.data.price);
      form.setValue('category', res.data.data.categoryId.toString());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full flex flex-col p-0'>
      <Dialog open={open !== null} onOpenChange={() => handleOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {open === 'addBooks' ? 'Tambah Buku' : 'Edit Buku'}
            </DialogTitle>

            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='isbn'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ISBN</FormLabel>
                        <FormControl>
                          <Input placeholder='Masukkan ISBN buku' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul</FormLabel>
                        <FormControl>
                          <Input placeholder='Masukkan judul buku' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='author'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pengarang</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan pengarang buku'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan harga buku'
                            type='number'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {categoriesData && (
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Pilih kategori buku' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categoriesData.data.map(
                                (category: Categories) => (
                                  <SelectItem
                                    key={category.id
                                      .toString()
                                      .concat(category.name)}
                                    value={category.id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {error && (
                    <FormDescription className='text-red-500'>
                      {error}
                    </FormDescription>
                  )}

                  <Button type='submit'>Simpan</Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='flex justify-between items-center'>
        <h3 className='font-bold text-lg'>Daftar Buku</h3>
        <Button size='sm' onClick={() => handleOpen('addBooks')}>
          Tambah Buku
        </Button>
      </div>

      {!isLoading ? (
        <Card className='mt-4 p-4 pt-0'>
          <BooksDataTable
            data={booksData.data}
            handleDelete={(id) => handleDelete(id)}
            handleEdit={(id) => handleEdit(id)}
            categories={categoriesData.data}
          />
        </Card>
      ) : (
        <Skeleton className='mt-4 h-96 bg-gray-200' />
      )}
    </div>
  );
}
