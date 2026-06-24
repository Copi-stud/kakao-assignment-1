import PageCard from "@/app/components/PageCard";
import {
  todoListHref,
  validateFilter,
  validateSearch,
  type TodoFilterSearchParams,
} from "@/app/lib/todoFilter";
import CreateTodoForm from "@/app/todos/new/CreateTodoForm";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<TodoFilterSearchParams>;
}) {
  const { filter, search } = await searchParams;
  const returnHref = todoListHref({
    filter: validateFilter(filter),
    search: validateSearch(search),
  });

  return (
    <PageCard>
      <div>
        <p className="text-sm font-bold text-[#672be0] mb-2">Productivity</p>
        <h1 className="text-3xl font-extrabold text-[#171321] mb-6">새 할 일 추가</h1>
        <CreateTodoForm returnHref={returnHref} />
      </div>
    </PageCard>
  );
}
