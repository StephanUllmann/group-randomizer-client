import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from './components/Navbar';
import { useState } from 'react';
import CreateBatch from './components/CreateBatch';
import CreateProject from './components/CreateProject';
import ShuffleProject from './components/ShuffleProject';
import DeleteBatch from './components/DeleteBatch';

const queryClient = new QueryClient();

function App() {
  const [mode, setMode] = useState('Create Batch');

  return (
    <QueryClientProvider client={queryClient}>
      <main className='min-h-screen bg-gradient-to-tr from-[#f8485e] to-[#f7a400] font-josefin'>
        <Navbar mode={mode} setMode={setMode} />
        {/* <h1 className='text-center text-3xl my-8 tracking-wide'>Batch WD#38</h1> */}
        <section className='grid place-content-center'>
          {mode === 'Create Batch' && <CreateBatch />}
          {mode === 'Create Project' && <CreateProject />}
          {mode === 'Shuffle anew' && <ShuffleProject />}
          {mode === 'Delete Batch' && <DeleteBatch />}
        </section>
      </main>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  );
}

export default App;
