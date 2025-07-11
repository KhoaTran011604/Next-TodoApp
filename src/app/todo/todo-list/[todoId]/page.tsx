import TodoDisplay from "./TodoDisplay";

export type TodoData = {
  id: number;
  title: string;
  completed: boolean;
  path?: string;
};

export default async function Todo() {
  const todoData = {
    id: 1,
    title: "React JS",
    completed: false,
  };

  return (
    <div className="mt-2 grid place-content-center">
      <TodoDisplay todoData={todoData} />
    </div>
  );
}
