import { notFound } from "next/navigation";
import { getTodoById } from "@/app/actions";
import PageCard from "@/app/components/PageCard";
import {
  todoListHref,
  validateFilter,
  validateSearch,
  type TodoFilterSearchParams,
} from "@/app/lib/todoFilter";
import EditTodoForm from "@/app/todos/[todoId]/EditTodoForm";

export default async function EditTodoPage({
  params,
  searchParams,
}: {
  params: Promise<{ todoId: string }>;
  searchParams: Promise<TodoFilterSearchParams>;
}) {
  const { todoId } = await params;
  const { filter, search } = await searchParams;
  const todo = await getTodoById(parseInt(todoId, 10));

  if (!todo) {
    notFound();
  }

  return (
    <PageCard>
      <div>
        <p className="text-sm font-bold text-[#672be0] mb-2">Productivity</p>
        <h1 className="text-3xl font-extrabold text-[#171321] mb-6">할 일 수정</h1>
        <EditTodoForm
          todo={todo}
          returnHref={todoListHref({
            filter: validateFilter(filter),
            search: validateSearch(search),
          })}
        />
      </div>
    </PageCard>
  );
}
