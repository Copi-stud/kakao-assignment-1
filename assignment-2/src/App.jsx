import { useEffect, useState } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import './App.css'

const FILTER_TABS = [
  { status: 'all', label: '전체' },
  { status: 'active', label: '진행 중' },
  { status: 'completed', label: '완료' },
]

const TODO_STORAGE_KEY = 'todos'
const WEEK_START_STORAGE_KEY = 'weekStartDate'

const formatDateToTodoDate = (date) => {
  // Todo의 date 값은 항상 YYYY-MM-DD 형식의 문자열로 저장합니다.
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const createDateFromText = (dateText) => {
  // YYYY-MM-DD 문자열을 로컬 시간 기준 Date 객체로 변환합니다.
  return new Date(`${dateText}T00:00:00`)
}

const getMovedDate = (dateText, dayAmount) => {
  // 현재 날짜를 기준으로 원하는 일수만큼 이동한 날짜 문자열을 계산합니다.
  const nextDate = createDateFromText(dateText)
  nextDate.setDate(nextDate.getDate() + dayAmount)

  return formatDateToTodoDate(nextDate)
}

const getWeekStartDate = (dateText) => {
  // 월요일을 한 주의 시작일로 보고 해당 주의 시작 날짜를 계산합니다.
  const date = createDateFromText(dateText)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day

  date.setDate(date.getDate() + mondayOffset)

  return formatDateToTodoDate(date)
}

const getWeekDates = (weekStartDate) => {
  // 주 시작일을 기준으로 7일치 날짜 배열을 만듭니다.
  return Array.from({ length: 7 }, (_, dayIndex) =>
    getMovedDate(weekStartDate, dayIndex),
  )
}

const loadStoredTodos = () => {
  try {
    // 첫 렌더링 때 localStorage에 저장된 Todo JSON 데이터를 불러옵니다.
    const storedTodos = localStorage.getItem(TODO_STORAGE_KEY)

    if (!storedTodos) {
      return []
    }

    const parsedTodos = JSON.parse(storedTodos)

    return Array.isArray(parsedTodos) ? parsedTodos : []
  } catch {
    // 잘못된 JSON 데이터가 있어도 앱이 깨지지 않도록 빈 배열을 사용합니다.
    return []
  }
}

const loadStoredWeekStartDate = () => {
  // 저장된 주 시작일이 있으면 사용하고, 없으면 오늘이 포함된 주의 시작일을 사용합니다.
  const todayDate = formatDateToTodoDate(new Date())
  const storedWeekStartDate = localStorage.getItem(WEEK_START_STORAGE_KEY)

  return storedWeekStartDate || getWeekStartDate(todayDate)
}

const loadInitialSelectedDate = () => {
  // 저장된 주간 뷰가 있으면 그 주의 시작 날짜를 선택해 일간 뷰와 연결합니다.
  const storedWeekStartDate = localStorage.getItem(WEEK_START_STORAGE_KEY)

  return storedWeekStartDate || formatDateToTodoDate(new Date())
}

function App() {
  const todayDate = formatDateToTodoDate(new Date())
  const [todos, setTodos] = useState(loadStoredTodos)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState(loadInitialSelectedDate)
  const [weekStartDate, setWeekStartDate] = useState(loadStoredWeekStartDate)

  useEffect(() => {
    // todos가 변경될 때마다 JSON 문자열로 변환해 localStorage에 저장합니다.
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    // 주간 뷰 위치도 새로고침 후 유지되도록 localStorage에 저장합니다.
    localStorage.setItem(WEEK_START_STORAGE_KEY, weekStartDate)
  }, [weekStartDate])

  const addTodo = (todoText) => {
    const trimmedTodoText = todoText.trim()

    // 입력값 앞뒤 공백을 제거한 뒤 현재 선택된 날짜를 포함한 Todo 객체를 생성합니다.
    const newTodo = {
      id: crypto.randomUUID(),
      text: trimmedTodoText,
      isCompleted: false,
      date: selectedDate,
    }

    setTodos((currentTodos) => [newTodo, ...currentTodos])
  }

  const updateTodo = (todoId, nextTodoText) => {
    const trimmedTodoText = nextTodoText.trim()

    // 선택한 Todo만 새 텍스트로 교체하고 나머지는 그대로 유지합니다.
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, text: trimmedTodoText } : todo,
      ),
    )
  }

  const toggleTodoCompletion = (todoId) => {
    // 선택한 Todo의 완료 상태를 완료/미완료로 전환합니다.
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? { ...todo, isCompleted: !todo.isCompleted }
          : todo,
      ),
    )
  }

  const deleteTodo = (todoId) => {
    // 선택한 Todo를 목록에서 제거합니다.
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    )
  }

  const selectDate = (dateText) => {
    // 주간 뷰에서 날짜를 클릭하면 일간 뷰의 선택 날짜도 함께 변경합니다.
    setSelectedDate(dateText)
    setWeekStartDate(getWeekStartDate(dateText))
  }

  const moveToPreviousDate = () => {
    const previousDate = getMovedDate(selectedDate, -1)

    setSelectedDate(previousDate)
    setWeekStartDate(getWeekStartDate(previousDate))
  }

  const moveToNextDate = () => {
    const nextDate = getMovedDate(selectedDate, 1)

    setSelectedDate(nextDate)
    setWeekStartDate(getWeekStartDate(nextDate))
  }

  const moveToPreviousWeek = () => {
    const previousWeekStartDate = getMovedDate(weekStartDate, -7)

    setWeekStartDate(previousWeekStartDate)
    setSelectedDate(previousWeekStartDate)
  }

  const moveToNextWeek = () => {
    const nextWeekStartDate = getMovedDate(weekStartDate, 7)

    setWeekStartDate(nextWeekStartDate)
    setSelectedDate(nextWeekStartDate)
  }

  const getTodoCountByDate = (dateText) => {
    // 주간 뷰 날짜별 Todo 개수를 계산합니다.
    return todos.filter((todo) => todo.date === dateText).length
  }

  const weekDates = getWeekDates(weekStartDate)

  const filteredTodos = todos.filter((todo) => {
    // 선택된 날짜의 Todo만 먼저 남긴 뒤 상태 필터를 적용합니다.
    if (todo.date !== selectedDate) {
      return false
    }

    if (filterStatus === 'active') {
      return !todo.isCompleted
    }

    if (filterStatus === 'completed') {
      return todo.isCompleted
    }

    return true
  })

  return (
    <main className="todo-app">
      <section className="todo-panel" aria-labelledby="todo-title">
        <div className="todo-header">
          <p className="todo-eyebrow">Productivity</p>
          <h1 id="todo-title">Todo List</h1>
          <p className="todo-description">
            할 일을 추가하고, 인라인으로 수정하고, 완료한 일을 명확하게 표시해 보세요.
          </p>
        </div>

        <TodoInput onAddTodo={addTodo} />

        <div className="date-navigation" aria-label="Todo 날짜 선택">
          <button
            type="button"
            className="date-move-button"
            onClick={moveToPreviousDate}
          >
            이전
          </button>
          <time className="selected-date" dateTime={selectedDate}>
            {selectedDate}
          </time>
          <button
            type="button"
            className="date-move-button"
            onClick={moveToNextDate}
          >
            다음
          </button>
        </div>

        <section className="weekly-view" aria-label="Todo 주간 뷰">
          <div className="week-navigation">
            <button
              type="button"
              className="week-move-button"
              onClick={moveToPreviousWeek}
            >
              이전 주차
            </button>
            <strong className="week-title">{weekStartDate} 주간</strong>
            <button
              type="button"
              className="week-move-button"
              onClick={moveToNextWeek}
            >
              다음 주차
            </button>
          </div>

          <div className="week-date-list">
            {weekDates.map((dateText) => {
              const todoCount = getTodoCountByDate(dateText)
              const isToday = dateText === todayDate
              const isSelectedDate = dateText === selectedDate

              return (
                <button
                  key={dateText}
                  type="button"
                  className={[
                    'week-date-button',
                    isToday ? 'today' : '',
                    isSelectedDate ? 'selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectDate(dateText)}
                >
                  <time dateTime={dateText}>{dateText.slice(5)}</time>
                  <span>{todoCount}개</span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="filter-tabs" role="tablist" aria-label="Todo 상태 필터">
          {FILTER_TABS.map((filterTab) => {
            const isSelectedFilter = filterStatus === filterTab.status

            return (
              <button
                key={filterTab.status}
                type="button"
                role="tab"
                className={`filter-tab ${isSelectedFilter ? 'selected' : ''}`}
                aria-selected={isSelectedFilter}
                onClick={() => setFilterStatus(filterTab.status)}
              >
                {filterTab.label}
              </button>
            )
          })}
        </div>

        <TodoList
          todos={filteredTodos}
          onUpdateTodo={updateTodo}
          onToggleTodoCompletion={toggleTodoCompletion}
          onDeleteTodo={deleteTodo}
        />
      </section>
    </main>
  )
}

export default App
