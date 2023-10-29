import { useMutation } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

export default function DeleteBatch() {
  const [batch, setBatch] = useState('');

  const mutation = useMutation({
    mutationKey: ['deleteBatch'],
    mutationFn: async (data: string) => {
      const res = await fetch(import.meta.env.VITE_API_URL + `?batch=${data}`, {
        method: 'DELETE',
      });
      const decoded = await res.json();
      return decoded;
    },
    onSettled() {
      setBatch('');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clearedBatch = batch.replace(/[/.,#?&\\]/g, '');
    mutation.mutate(clearedBatch);
  };

  return (
    <>
      <h1 className='text-center text-3xl my-8 tracking-wide'>
        Delete {batch === '' ? 'Batch' : batch}
      </h1>
      <form
        className='flex flex-col items-end gap-3 relative z-10 space-y-6'
        onSubmit={handleSubmit}>
        <label htmlFor='deleteBatch'>
          Batch
          <input
            className='ml-4 w-64 pt-2 pb-1 px-4 rounded'
            type='text'
            name='deleteBatch'
            id='deleteBatch'
            value={batch}
            onFocus={() => mutation.reset()}
            onChange={(e) => setBatch(e.target.value.toUpperCase())}
            disabled={mutation.isPending}
          />
        </label>
        {batch !== '' && (
          <button
            className='pt-2.5 pb-1.5 px-6 bg-orange-500 rounded relative before:absolute before:-z-[1] before:rounded-lg before:-inset-1 before:bg-gradient-to-br before:from-[#f8485e] before:to-[#f7a400] hover:before:-inset-[6px] hover:before:shadow-md  transition-all duration-200 before:transition-all before:duration-200 self-center'
            disabled={mutation.isPending}>
            Delete
          </button>
        )}
        {mutation.isError && (
          <h2 className='text-red-500 self-center text-xl'>
            Oops, something went wrong :(
          </h2>
        )}
        {mutation.isSuccess && (
          <h2 className='text-lime-500 self-center text-xl'>
            {mutation.data.message}
          </h2>
        )}
      </form>
    </>
  );
}
