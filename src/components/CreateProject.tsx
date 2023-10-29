import { useMutation } from '@tanstack/react-query';
import { FormEvent, useReducer } from 'react';

type State = {
  batch: string;
  project: string;
  groups: string[][];
  message: string;
};

type Action =
  | { type: 'inputBatch'; payload: string }
  | { type: 'inputProject'; payload: string }
  | { type: 'setGroups'; payload: string[][] }
  | { type: 'setMessage'; payload: string };

const initial: State = {
  batch: '',
  project: '',
  groups: [['']],
  message: '',
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'inputProject': {
      return { ...state, project: action.payload };
    }
    case 'inputBatch': {
      return { ...state, batch: action.payload };
    }
    case 'setGroups': {
      return { ...state, groups: action.payload };
    }
    case 'setMessage': {
      return { ...state, message: action.payload };
    }

    default:
      throw Error('Unknown action');
  }
};

export default function CreateProject() {
  const [state, dispatch] = useReducer(reducer, initial);

  const mutation = useMutation({
    mutationKey: ['createProject'],
    mutationFn: async () => {
      const clearedBatch = state.batch.replace(/[/.,#?&\\]/g, '');
      const res = await fetch(
        import.meta.env.VITE_API_URL +
          `?project=${state.project}&batch=${clearedBatch}`,
        {
          method: 'PUT',
        }
      );
      const data = await res.json();
      return data;
    },
    onSuccess(data) {
      if (data.groups) dispatch({ type: 'setGroups', payload: data.groups });
      else if (data.message)
        dispatch({ type: 'setMessage', payload: data.message });
    },
    onError(error) {
      if (error.message)
        dispatch({ type: 'setMessage', payload: error.message });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <h1 className='text-center text-3xl my-8 tracking-wide'>
        {state.project || state.batch
          ? `${state.project} of ${state.batch}`
          : 'New Project'}
      </h1>
      <form className='flex gap-5 relative z-10' onSubmit={handleSubmit}>
        <label htmlFor='project'>
          Project
          <input
            type='text'
            name='project'
            id='project'
            className='ml-4 w-64 pt-2 pb-1 px-4 rounded'
            value={state.project}
            onChange={(e) =>
              dispatch({ type: 'inputProject', payload: e.target.value })
            }
          />
        </label>
        <button
          className='pt-2.5 pb-1.5 px-6 bg-orange-500 rounded relative  before:absolute before:-z-[1] before:rounded-lg before:-inset-1 before:bg-gradient-to-br before:from-[#f8485e] before:to-[#f7a400] hover:before:-inset-[6px] hover:before:shadow-md  transition-all duration-200 before:transition-all before:duration-200  disabled:invisible '
          disabled={state.project === '' || state.batch === ''}>
          Create
        </button>
        <label htmlFor='existingBatch'>
          <input
            type='text'
            name='existingBatch'
            id='existingBatch'
            className='mr-4 w-64 pt-2 pb-1 px-4 rounded text-right'
            value={state.batch}
            onChange={(e) =>
              dispatch({ type: 'inputBatch', payload: e.target.value })
            }
          />
          Batch
        </label>
      </form>
      <div className='flex mt-12 justify-evenly'>
        {mutation.isSuccess &&
          state.groups.map((group, ind) => (
            <div key={'group' + (ind + 1)} className='flex flex-col'>
              <h2 className='underline mb-4'>Group {ind + 1}</h2>
              <ul>
                {group.map((member, memInd) => (
                  <li
                    key={member}
                    className='animate-fadeIn opacity-0'
                    style={{
                      animationDelay: `${
                        (ind + 1) * 350 + (memInd + 1) * 1700 - 2000
                      }ms`,
                    }}>
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </>
  );
}
