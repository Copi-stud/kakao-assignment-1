import { getTodos } from "@/app/actions";
import PageCard from "@/app/components/PageCard";
import {
  validateFilter,
  validateSearch,
  type TodoFilterSearchParams,
} from "@/app/lib/todoFilter";
import TodoDashboard from "@/app/todos/TodoDashboard";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<TodoFilterSearchParams>;
}) {
  const { filter, search } = await searchParams;
  const currentFilter = validateFilter(filter);
  const currentSearch = validateSearch(search);
  const todos = await getTodos({
    filter: currentFilter,
    search: currentSearch,
  });
  return (
    <PageCard>
      <TodoDashboard
        todos={todos}
        currentFilter={currentFilter}
        currentSearch={currentSearch}
      />
    </PageCard>
  );
}
