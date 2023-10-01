'use client';

import { CategoriesDataTable } from './components/data-table-categories';
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
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const { data: sessionData } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | number | null>(null);
  const form = useForm({
    defaultValues: {
      name: '',
    },
    mode: 'all',
  });

  const {
    data: categoriesData,
    refetch: refetchCategories,
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axios.get('/api/categories');
      return res.data;
    },
  });

  const isLoading = categoriesLoading;

  const handleOpen = (value: string | number | null) => {
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
      name: '',
    });
  };

  const createSubmit = async (data: any) => {
    const body = {
      name: data.name,
    };

    try {
      await axios.post('/api/category', body);
      handleOpen(null);
      refetchCategories();
      setError(null);
      toast.success('Kategori berhasil ditambahkan!');
      resetForm();
    } catch (error: any) {
      toast.error('Kategori gagal ditambahkan!');
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
      name: data.name,
    };

    try {
      await axios.put(`/api/category/${open}`, body);
      handleOpen(null);
      refetchCategories();
      setError(null);
      toast.success('Kategori berhasil diubah!');
      resetForm();
    } catch (error: any) {
      toast.error('Kategori gagal diubah!');
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
    if (open === 'addCategory') {
      createSubmit(data);
    } else {
      editSubmit(data);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/category/${id}`);
      refetchCategories();
      toast.success('Kategori berhasil dihapus!');
      setError(null);
    } catch (error) {
      toast.success('Kategori gagal dihapus!');
      setError(null);
      console.log(error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      handleOpen(id);
      const res = await axios.get(`/api/category/${id}`);

      form.setValue('name', res.data.data.name);
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
              {open === 'addCategory' ? 'Tambah Kategori' : 'Edit Kategori'}
            </DialogTitle>

            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Kategori</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Masukkan nama kategori'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
        <h3 className='font-bold text-lg'>Daftar Kategori</h3>
        <Button size='sm' onClick={() => handleOpen('addCategory')}>
          Tambah Kategori
        </Button>
      </div>

      {!isLoading ? (
        <Card className='mt-4 p-4 pt-0'>
          <CategoriesDataTable
            handleDelete={(id) => handleDelete(id)}
            handleEdit={(id) => handleEdit(id)}
            data={categoriesData.data}
          />
        </Card>
      ) : (
        <Skeleton className='mt-4 h-96 bg-gray-200' />
      )}
    </div>
  );
}
