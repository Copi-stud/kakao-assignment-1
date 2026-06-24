"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Todo, TodoFilter } from "@/app/types/todo";
import {
  TODO_SEARCH_MAX_LENGTH,
  todoEditHref,
  todoListHref,
  todoNewHref,
  validateSearch,
} from "@/app/lib/todoFilter";
import ToggleCompleteButton from "@/app/todos/ToggleCompleteButton";
import DeleteButton from "@/app/todos/DeleteButton";
import {
  today,
  moveDateBy,
  getWeekStartDate,
  getWeekDates,
  getDayLabel,
  formatDateDisplay,
} from "@/app/lib/dateUtils";

const UNDATED_KEY = "undated";

const FILTER_TABS: { status: TodoFilter; label: string }[] = [
  { status: "all", label: "전체" },
  { status: "active", label: "진행 중" },
  { status: "completed", label: "완료" },
];

interface Props {
  todos: Todo[];
  currentFilter: TodoFilter;
  currentSearch: string;
}

export default function TodoDashboard({
  todos,
  currentFilter,
  currentSearch,
}: Props) {
  const router = useRouter();
  const todayDate = today();
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [weekStartDate, setWeekStartDate] = useState(() =>
    getWeekStartDate(todayDate)
  );
  const [searchInput, setSearchInput] = useState(currentSearch);

  const queryState = {
    filter: currentFilter,
    search: currentSearch,
  };

  const isUndatedSelected = selectedDate === UNDATED_KEY;
  const weekDates = getWeekDates(weekStartDate);
  const undatedCount = todos.filter((t) => t.due_date === null).length;

  const dateFilteredTodos = isUndatedSelected
    ? todos.filter((t) => t.due_date === null)
    : todos.filter((t) => t.due_date === selectedDate);

  const filteredTodos = dateFilteredTodos;
  const newTodoHref = todoNewHref(queryState);

  function getEditTodoHref(todoId: number): string {
    return todoEditHref(todoId, queryState);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchInput(currentSearch);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [currentSearch]);

  useEffect(() => {
    const normalizedSearch = validateSearch(searchInput);
    if (normalizedSearch === currentSearch) return;

    const timeoutId = window.setTimeout(() => {
      router.replace(
        todoListHref({
          filter: currentFilter,
          search: normalizedSearch,
        }),
        { scroll: false }
      );
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [currentFilter, currentSearch, router, searchInput]);

  function selectDate(dateText: string) {
    setSelectedDate(dateText);
    setWeekStartDate(getWeekStartDate(dateText));
  }

  function moveToPreviousDate() {
    if (isUndatedSelected) return;
    const prev = moveDateBy(selectedDate, -1);
    setSelectedDate(prev);
    setWeekStartDate(getWeekStartDate(prev));
  }

  function moveToNextDate() {
    if (isUndatedSelected) return;
    const next = moveDateBy(selectedDate, 1);
    setSelectedDate(next);
    setWeekStartDate(getWeekStartDate(next));
  }

  function moveToPreviousWeek() {
    const prev = moveDateBy(weekStartDate, -7);
    setWeekStartDate(prev);
    setSelectedDate(prev);
  }

  function moveToNextWeek() {
    const next = moveDateBy(weekStartDate, 7);
    setWeekStartDate(next);
    setSelectedDate(next);
  }

  function goToToday() {
    setSelectedDate(todayDate);
    setWeekStartDate(getWeekStartDate(todayDate));
  }

  function getCountByDate(dateText: string): number {
    return todos.filter((t) => t.due_date === dateText).length;
  }

  const displayDate = isUndatedSelected
    ? "날짜 미분류"
    : formatDateDisplay(selectedDate);

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-bold text-[#672be0] mb-2">Productivity</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-[#171321] leading-tight">
              오늘의 Todo
            </h1>
            <p className="mt-3 text-base text-[#746f80]">
              날짜를 선택하고 할 일을 관리해보세요.
            </p>
          </div>
          <Link
            href={newTodoHref}
            className="shrink-0 mt-1 h-11 px-5 inline-flex items-center bg-[#672be0] text-white text-sm font-bold rounded-lg transition-transform hover:-translate-y-0.5"
          >
            Todo 추가
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        <button
          type="button"
          onClick={moveToPreviousDate}
          disabled={isUndatedSelected}
          className="min-h-[42px] px-4 border border-[#dcd7eb] rounded-lg bg-white text-[#672be0] text-[15px] font-extrabold transition-all hover:border-[#672be0] hover:bg-[#f7f3ff] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          이전
        </button>

        <div className="flex-1 min-h-[42px] flex items-center justify-center gap-2 px-4 border border-[#e2ddee] rounded-lg bg-[#fbfaff]">
          <time
            dateTime={isUndatedSelected ? undefined : selectedDate}
            className="text-lg font-extrabold text-[#252033]"
          >
            {displayDate}
          </time>
          {!isUndatedSelected && selectedDate !== todayDate && (
            <button
              type="button"
              onClick={goToToday}
              className="text-xs text-[#672be0] font-bold underline underline-offset-2 cursor-pointer"
            >
              오늘로
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={moveToNextDate}
          disabled={isUndatedSelected}
          className="min-h-[42px] px-4 border border-[#dcd7eb] rounded-lg bg-white text-[#672be0] text-[15px] font-extrabold transition-all hover:border-[#672be0] hover:bg-[#f7f3ff] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          다음
        </button>
      </div>

      <section className="mb-[18px]" aria-label="주간 보기">
        <div className="flex items-center gap-2.5 mb-2.5">
          <button
            type="button"
            onClick={moveToPreviousWeek}
            className="min-h-[38px] px-3.5 border border-[#dcd7eb] rounded-lg bg-white text-[#672be0] text-sm font-extrabold transition-all hover:border-[#672be0] hover:bg-[#f7f3ff] hover:-translate-y-0.5"
          >
            이전 주차
          </button>
          <strong className="flex-1 text-base text-center text-[#252033] min-w-0">
            {weekStartDate} 주간
          </strong>
          <button
            type="button"
            onClick={moveToNextWeek}
            className="min-h-[38px] px-3.5 border border-[#dcd7eb] rounded-lg bg-white text-[#672be0] text-sm font-extrabold transition-all hover:border-[#672be0] hover:bg-[#f7f3ff] hover:-translate-y-0.5"
          >
            다음 주차
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {weekDates.map((dateText) => {
            const count = getCountByDate(dateText);
            const isToday = dateText === todayDate;
            const isSelected = dateText === selectedDate && !isUndatedSelected;

            return (
              <button
                key={dateText}
                type="button"
                onClick={() => selectDate(dateText)}
                className={[
                  "min-h-[72px] flex flex-col items-center justify-center gap-1.5 p-2.5 border rounded-lg",
                  "transition-all duration-200 cursor-pointer hover:-translate-y-0.5",
                  isSelected
                    ? "border-[#672be0] bg-[#672be0] text-white shadow-[0_10px_22px_rgba(103,43,224,0.24)]"
                    : isToday
                    ? "border-[#672be0] bg-[#f7f3ff] text-[#672be0] hover:bg-[#ede5fc]"
                    : "border-[#e2ddee] bg-white text-[#5e5870] hover:border-[#672be0] hover:text-[#672be0]",
                ].join(" ")}
              >
                <span className="text-xs font-bold opacity-80">
                  {getDayLabel(dateText)}
                </span>
                <time dateTime={dateText} className="text-sm font-extrabold">
                  {dateText.slice(5)}
                </time>
                <span className="text-xs font-bold">{count}개</span>
              </button>
            );
          })}
        </div>

        {undatedCount > 0 && (
          <button
            type="button"
            onClick={() => setSelectedDate(UNDATED_KEY)}
            className={[
              "mt-2 w-full min-h-[38px] px-4 border rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5",
              isUndatedSelected
                ? "border-[#672be0] bg-[#672be0] text-white"
                : "border-[#dcd7eb] bg-white text-[#746f80] hover:border-[#672be0] hover:text-[#672be0]",
            ].join(" ")}
          >
            날짜 미분류 ({undatedCount})
          </button>
        )}
      </section>

      <div className="mb-[18px]">
        <label
          htmlFor="todo-search"
          className="block text-sm font-bold text-[#4c3f66] mb-2"
        >
          검색
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-[#dcd7eb] bg-white px-3 focus-within:border-[#672be0] focus-within:ring-4 focus-within:ring-[rgba(103,43,224,0.12)]">
          <input
            id="todo-search"
            type="search"
            value={searchInput}
            maxLength={TODO_SEARCH_MAX_LENGTH}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Todo 검색어를 입력하세요"
            className="min-h-[44px] flex-1 bg-transparent text-[#171321] outline-none placeholder:text-[#9a93aa]"
          />
          {searchInput && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setSearchInput("")}
              className="min-h-[32px] px-2 text-sm font-bold text-[#672be0] rounded-md transition-colors hover:bg-[#f7f3ff]"
            >
              지우기
            </button>
          )}
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-1.5 mb-[18px] p-1.5 rounded-lg bg-[#f1eef9]"
        role="tablist"
        aria-label="Todo 상태 필터"
      >
        {FILTER_TABS.map((tab) => {
          const isSelected = currentFilter === tab.status;
          return (
            <Link
              key={tab.status}
              role="tab"
              aria-selected={isSelected}
              href={todoListHref({
                filter: tab.status,
                search: currentSearch,
              })}
              className={[
                "min-h-[40px] rounded-md text-[15px] font-bold transition-all inline-flex items-center justify-center",
                isSelected
                  ? "bg-[#672be0] text-white shadow-[0_8px_18px_rgba(103,43,224,0.2)]"
                  : "bg-transparent text-[#5e5870] hover:text-[#672be0]",
              ].join(" ")}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {filteredTodos.length === 0 ? (
        <div className="py-8 px-4 border border-dashed border-[#d8d1ec] rounded-lg bg-[#fbfaff] text-center">
          <p className="text-[#857e96]">
            {currentSearch
              ? "검색어와 날짜 조건에 맞는 Todo가 없습니다."
              : isUndatedSelected
              ? "날짜 미분류 Todo가 없습니다."
              : `${displayDate}에 해당하는 Todo가 없습니다.`}
          </p>
          <Link
            href={newTodoHref}
            className="mt-3 inline-block text-sm font-bold text-[#672be0] underline underline-offset-2"
          >
            Todo 추가
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={[
                "grid grid-cols-[auto_1fr_auto] items-center gap-3 min-h-[62px] p-3 border rounded-lg",
                todo.completed
                  ? "border-[#ece8f5] bg-[#f7f4ff]"
                  : "border-[#ece8f5] bg-[#fbfaff]",
              ].join(" ")}
            >
              <ToggleCompleteButton
                todoId={todo.id}
                completed={todo.completed}
              />
              <span
                className={[
                  "min-w-0 [overflow-wrap:anywhere]",
                  todo.completed
                    ? "text-[#8b849c] line-through"
                    : "text-[#252033]",
                ].join(" ")}
              >
                {todo.title}
              </span>
              <div className="flex flex-wrap justify-end gap-2">
                <Link
                  href={getEditTodoHref(todo.id)}
                  className="min-h-[34px] px-3 inline-flex items-center text-sm font-bold bg-[#f1eef9] text-[#4c3f66] rounded-lg transition-transform hover:-translate-y-0.5"
                >
                  수정
                </Link>
                <DeleteButton todoId={todo.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
