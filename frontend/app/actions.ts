"use server";

import type { Todo, TodoFilter } from "@/app/types/todo";
import { toServerFilter, validateSearch } from "@/app/lib/todoFilter";

type GetTodosOptions = {
  filter?: TodoFilter;
  search?: string;
};

export async function getTodos({
  filter = "all",
  search = "",
}: GetTodosOptions = {}): Promise<Todo[]> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error("BACKEND_URL 환경변수가 설정되지 않았습니다.");
  }

  const url = new URL(`${backendUrl}/todos`);
  const serverFilter = toServerFilter(filter);
  const normalizedSearch = validateSearch(search);
  if (serverFilter) {
    url.searchParams.set("filter", serverFilter);
  }
  if (normalizedSearch) {
    url.searchParams.set("search", normalizedSearch);
  }

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Todo 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}

export async function getTodoById(id: number): Promise<Todo | undefined> {
  const todos = await getTodos();
  return todos.find((t) => t.id === id);
}
