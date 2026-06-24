export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  due_date: string | null;
};

export type TodoFilter = "all" | "active" | "completed";
export type TodoServerFilter = Exclude<TodoFilter, "all">;
