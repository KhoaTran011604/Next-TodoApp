import Link from 'next/link';
import TodoDisplay from './todo-list/[todoId]/TodoDisplay';
export default async function Home() {
  const data = [
    {
      id: 1,
      title: 'React JS',
      completed: false,
    },
    {
      id: 2,
      title: 'Next JS',
      completed: true,
    },
    {
      id: 3,
      title: 'Java',
      completed: false,
    },
    {
      id: 4,
      title: 'HTML',
      completed: true,
    },
    {
      id: 5,
      title: 'Python',
      completed: false,
    },
  ];

  return (
    <main className="flex flex-col items-center gap-8 pb-8">
      <Link href={`/todo-list/add`}>Add</Link>
      {/* Hiển thị danh sách ở đây */}
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <TodoDisplay key={item.id} todoData={item} />
        ))}
      </div>
    </main>
  );
}
