import Image from 'next/image';
import Link from 'next/link';
import type { TodoData } from './page';

type Props = {
  todoData: TodoData;
};

export default function TodoDisplay({ todoData }: Props) {
  return (
    <div className="flex flex-col gap-4 w-64 mx-auto">
      {/* <h1 className="text-3xl text-center">{todoData.title}</h1> */}
      <Link href={`/todo/todo-list/${todoData.id}`}>
        <div className="border-2 rounded-xl overflow-hidden w-64 py-4 text-center relative">
          {todoData.title}
        </div>
      </Link>
    </div>
  );
}
