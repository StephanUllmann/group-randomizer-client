import { FormEvent, useReducer, useRef } from 'react';
import Trash from '../assets/Trash';
import { useMutation } from '@tanstack/react-query';

type State = {
  batch: string;
  names: string[];
  currentName: string;
  namesString: string;
  responseMessage: string;
};

type Action =
  | { type: 'inputName'; payload: string }
  | { type: 'inputBatch'; payload: string }
  | { type: 'addName'; payload: string }
  | { type: 'deleteName'; payload: string }
  | { type: 'settle'; payload: string };

const initial: State = {
  batch: '',
  names: [],
  currentName: '',
  namesString: '',
  responseMessage: '',
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'inputName': {
      return { ...state, currentName: action.payload, responseMessage: '' };
    }
    case 'inputBatch': {
      return {
        ...state,
        batch: action.payload.toUpperCase(),
        responseMessage: '',
      };
    }
    case 'addName': {
      const newName =
        action.payload[0].toUpperCase() + action.payload.slice(1).toLowerCase();
      return {
        ...state,
        names: [...state.names, newName],
        currentName: '',
        namesString: [...state.names, newName].join(','),
      };
    }
    case 'deleteName': {
      const filteredNames = state.names.filter(
        (oldName: string) => oldName !== action.payload
      );
      return {
        ...state,
        names: filteredNames,
        namesString: filteredNames.join(','),
      };
    }
    case 'settle': {
      return { ...initial, responseMessage: action.payload };
    }
    default:
      throw Error('Unknown action');
  }
};

export default function CreateBatch() {
  const [state, dispatch] = useReducer(reducer, initial);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const mutation = useMutation({
    mutationKey: ['createBatch'],
    mutationFn: async (data: { batch: string; names: string }) => {
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await res.json();
    },
    onSettled: (data, error) => {
      const msg = error?.message ?? data.message;
      dispatch({ type: 'settle', payload: msg });
    },
  });

  const handleAddName = (e: FormEvent) => {
    e.preventDefault();
    if (nameRef.current)
      dispatch({ type: 'addName', payload: nameRef.current.value });
  };

  const handleSubmit = () => {
    const clearedBatch = state.batch.replace(/[/.,#?&\\]/g, '');
    // console.log(clearedBatch);
    mutation.mutate({ batch: clearedBatch, names: state.namesString });
  };

  return (
    <>
      <h1 className='text-center text-3xl my-8 tracking-wide'>
        Batch {state.batch}
      </h1>

      <div className='flex gap-10'>
        <div className='space-y-10 text-center relative z-10'>
          <form
            className='flex flex-col items-end gap-3'
            onSubmit={handleAddName}>
            <label htmlFor='batch'>
              Batch
              <input
                className='ml-4 w-64 pt-2 pb-1 px-4 rounded'
                type='text'
                name='batch'
                id='id'
                placeholder='BatchNo.'
                value={state.batch}
                onChange={(e) =>
                  dispatch({ type: 'inputBatch', payload: e.target.value })
                }
              />
            </label>
            <label htmlFor='names' className='relative'>
              Next Name
              <input
                ref={nameRef}
                className='ml-4 w-64 pt-2 pb-1 px-4 rounded'
                type='text'
                name='names'
                id='names'
                placeholder='Next name'
                value={state.currentName}
                onChange={(e) =>
                  dispatch({ type: 'inputName', payload: e.target.value })
                }
              />
              <button
                className='absolute bg-amber-500 right-0 w-10 text-2xl h-full hover:bg-amber-400 hover:text-white transition-all duration-150 rounded-tr rounded-br'
                onClick={handleAddName}>
                +
              </button>
            </label>
          </form>
          {state.batch !== '' && state.names.length > 5 && (
            <button
              className='pt-2.5 pb-1.5 px-6 bg-orange-500 rounded relative  before:absolute before:-z-[1] before:rounded-lg before:-inset-1 before:bg-gradient-to-br before:from-[#f8485e] before:to-[#f7a400] hover:before:-inset-[6px] hover:before:shadow-md  transition-all duration-200 before:transition-all before:duration-200'
              onClick={handleSubmit}
              disabled={mutation.isPending}>
              Create
            </button>
          )}
          {mutation.isError && (
            <h2 className='text-red-500 text-center text-xl translate-x-7'>
              {state.responseMessage}
            </h2>
          )}
          {mutation.isSuccess && (
            <h2 className='text-lime-500 text-center text-xl translate-x-7'>
              {state.responseMessage}
            </h2>
          )}
        </div>
        <div className='w-44'>
          <ul className='space-y-5'>
            {state.names.length > 0 &&
              state.names.map((name: string) => (
                <li
                  className='h-6 flex justify-between items-center'
                  key={'newBatch' + name}>
                  <span>{name}</span>
                  <button
                    className='h-6 w-6 hover:text-amber-800 transition-all duration-200'
                    onClick={() =>
                      dispatch({ type: 'deleteName', payload: name })
                    }>
                    <Trash />
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
