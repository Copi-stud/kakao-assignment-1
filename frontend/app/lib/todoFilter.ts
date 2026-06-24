import type { TodoFilter, TodoServerFilter } from "@/app/types/todo";

export const TODO_SEARCH_MAX_LENGTH = 100;

export type TodoFilterSearchParams = {
  filter?: string | string[];
  search?: string | string[];
};

export type TodoQueryState = {
  filter: TodoFilter;
  search: string;
};

export function validateFilter(
  value: string | string[] | null | undefined
): TodoFilter {
  const filter = Array.isArray(value) ? value[0] : value;
  if (filter === "active" || filter === "completed") {
    return filter;
  }
  return "all";
}

export function validateSearch(
  value: string | string[] | null | undefined
): string {
  const search = Array.isArray(value) ? value[0] : value;
  return (search ?? "").trim().slice(0, TODO_SEARCH_MAX_LENGTH);
}

export function toServerFilter(
  filter: TodoFilter
): TodoServerFilter | undefined {
  return filter === "all" ? undefined : filter;
}

function todoQueryString({ filter, search }: TodoQueryState): string {
  const params = new URLSearchParams();
  const serverFilter = toServerFilter(filter);
  const normalizedSearch = validateSearch(search);

  if (serverFilter) {
    params.set("filter", serverFilter);
  }
  if (normalizedSearch) {
    params.set("search", normalizedSearch);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export function todoListHref(state: TodoQueryState): string {
  return `/todos${todoQueryString(state)}`;
}

export function todoNewHref(state: TodoQueryState): string {
  return `/todos/new${todoQueryString(state)}`;
}

export function todoEditHref(todoId: number, state: TodoQueryState): string {
  return `/todos/${todoId}${todoQueryString(state)}`;
}
