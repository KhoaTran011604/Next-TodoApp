import { Modal } from "@/components/Modal";
import TodoDisplay from "app/todo/todo-list/[todoId]/TodoDisplay";

export default async function Todo() {
  const todoData = {
    id: 1,
    title: "React JS",
    completed: false,
  };

  return (
    <Modal>
      <TodoDisplay todoData={todoData} />
    </Modal>
  );
}
