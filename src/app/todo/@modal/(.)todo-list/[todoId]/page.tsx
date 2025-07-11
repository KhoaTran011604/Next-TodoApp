import { Modal } from '@/components/Modal';
import TodoDisplay from 'app/todo/todo-list/[todoId]/TodoDisplay';

type Props = {
  params: {
    todoId: string;
  };
};

export default async function Todo({ params: { todoId } }: Props) {
  const todoData = {
    id: 1,
    title: 'React JS',
    completed: false,
  };

  return (
    <Modal>
      <TodoDisplay todoData={todoData} />
    </Modal>
  );
}
