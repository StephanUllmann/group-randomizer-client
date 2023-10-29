import { MouseEventHandler } from 'react';

type NavbarProps = { mode: string; setMode: (mode: string) => void };

export default function Navbar({ mode, setMode }: NavbarProps) {
  const handleClick: MouseEventHandler<HTMLUListElement> = (event) => {
    const target = event.target as HTMLLIElement;
    if (target.nodeName !== 'LI') return;
    setMode(target.textContent!);
  };

  return (
    <header>
      <nav>
        <ul
          className='flex gap-5 py-7 font-bold tracking-widest justify-center'
          onClick={handleClick}>
          <li
            className={`hover:text-slate-600 cursor-pointer transition-all duration-200 ${
              mode === 'Create Batch' && 'underline underline-offset-4'
            }`}>
            Create Batch
          </li>
          <li
            className={`hover:text-slate-600 cursor-pointer transition-all duration-200 ${
              mode === 'Create Project' && 'underline underline-offset-4'
            }`}>
            Create Project
          </li>
          {/* <li
            className={`hover:text-slate-600 cursor-pointer transition-all duration-200 ${
              mode === 'Shuffle anew' && 'underline underline-offset-4'
            }`}>
            Shuffle anew
          </li> */}
          <li
            className={`hover:text-slate-600 cursor-pointer transition-all duration-200 ${
              mode === 'Delete Batch' && 'underline underline-offset-4'
            }`}>
            Delete Batch
          </li>
        </ul>
      </nav>
    </header>
  );
}
