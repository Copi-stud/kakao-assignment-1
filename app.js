const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const message = document.querySelector("#message");
const filterTabs = document.querySelector("#filter-tabs");
const previousWeekButton = document.querySelector("#previous-week-button");
const nextWeekButton = document.querySelector("#next-week-button");
const selectedDateText = document.querySelector("#selected-date-text");
const weekDays = document.querySelector("#week-days");

const TODO_STORAGE_KEY = "daily-todo-list";

let todos = [];
let currentFilter = "all";
let selectedDate = createDateKey(new Date());

// 안내 메시지를 화면에 표시하고, 내용이 없으면 메시지 영역을 비웁니다.
function showMessage(messageText) {
  message.textContent = messageText;
}

// Todo의 고유 id를 만들어 수정, 완료, 삭제할 항목을 구분합니다.
function createTodoId() {
  return Date.now().toString();
}

// todos 배열을 JSON 문자열로 변환해 로컬스토리지에 저장합니다.
function saveTodos() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에 저장된 JSON 문자열을 배열로 복원합니다.
function loadTodos() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  return JSON.parse(savedTodos);
}

// 날짜 객체를 Todo에 저장하기 좋은 YYYY-MM-DD 형식의 문자열로 바꿉니다.
function createDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 형식의 문자열을 로컬 날짜 객체로 변환합니다.
function createDateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

// 선택된 날짜가 포함된 주의 월요일 날짜를 계산합니다.
function getMondayOfSelectedWeek() {
  const selectedDateObject = createDateFromKey(selectedDate);
  const dayOfWeek = selectedDateObject.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  selectedDateObject.setDate(selectedDateObject.getDate() + mondayOffset);

  return selectedDateObject;
}

// 특정 날짜에 저장된 Todo 개수를 계산해 주간 뷰에 표시합니다.
function getTodoCountByDate(dateKey) {
  return todos.filter((todo) => todo.date === dateKey).length;
}

// 선택된 날짜를 사용자가 읽기 쉬운 형식으로 화면에 표시합니다.
function updateSelectedDateText() {
  const selectedDateObject = createDateFromKey(selectedDate);
  const formattedDate = selectedDateObject.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  selectedDateText.textContent = formattedDate;
}

// 주간 뷰에 월요일부터 일요일까지의 날짜 버튼을 그립니다.
function renderWeekDays() {
  const todayDateKey = createDateKey(new Date());
  const mondayOfWeek = getMondayOfSelectedWeek();

  weekDays.innerHTML = "";

  for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
    const date = new Date(mondayOfWeek);

    date.setDate(mondayOfWeek.getDate() + dayIndex);

    const dateKey = createDateKey(date);
    const weekDayButton = document.createElement("button");
    const weekDayName = document.createElement("span");
    const weekDayNumber = document.createElement("span");
    const weekDayCount = document.createElement("span");

    weekDayButton.className = "week-day-button";
    weekDayButton.type = "button";
    weekDayButton.dataset.date = dateKey;
    weekDayButton.setAttribute("aria-label", `${dateKey} Todo ${getTodoCountByDate(dateKey)}개`);

    if (dateKey === selectedDate) {
      weekDayButton.classList.add("selected");
    }

    if (dateKey === todayDateKey) {
      weekDayButton.classList.add("today");
    }

    weekDayName.className = "week-day-name";
    weekDayName.textContent = date.toLocaleDateString("ko-KR", { weekday: "short" });

    weekDayNumber.className = "week-day-number";
    weekDayNumber.textContent = date.getDate();

    weekDayCount.className = "week-day-count";
    weekDayCount.textContent = `${getTodoCountByDate(dateKey)}개`;

    weekDayButton.append(weekDayName, weekDayNumber, weekDayCount);
    weekDays.append(weekDayButton);
  }
}

// 이전 주 또는 다음 주 버튼 클릭 시 선택된 날짜를 7일 단위로 이동합니다.
function moveSelectedWeek(dayOffset) {
  const selectedDateObject = createDateFromKey(selectedDate);

  selectedDateObject.setDate(selectedDateObject.getDate() + dayOffset);
  selectedDate = createDateKey(selectedDateObject);

  updateSelectedDateText();
  renderWeekDays();
  showMessage("");
  renderTodos();
}

// 주간 뷰의 날짜를 클릭하면 해당 날짜의 Todo 목록으로 이동합니다.
function selectDate(dateKey) {
  selectedDate = dateKey;

  updateSelectedDateText();
  renderWeekDays();
  showMessage("");
  renderTodos();
}

// 현재 선택된 날짜와 필터에 맞는 Todo만 골라 화면에 표시할 목록을 만듭니다.
function getFilteredTodos() {
  const selectedDateTodos = todos.filter((todo) => todo.date === selectedDate);

  if (currentFilter === "completed") {
    return selectedDateTodos.filter((todo) => todo.isCompleted);
  }

  if (currentFilter === "active") {
    return selectedDateTodos.filter((todo) => !todo.isCompleted);
  }

  return selectedDateTodos;
}

// 클릭한 필터 탭이 선택되어 보이도록 active 클래스와 접근성 속성을 갱신합니다.
function updateFilterTabStyles() {
  const filterButtons = filterTabs.querySelectorAll(".filter-tab");

  filterButtons.forEach((filterButton) => {
    const isSelectedFilter = filterButton.dataset.filter === currentFilter;

    filterButton.classList.toggle("active", isSelectedFilter);
    filterButton.setAttribute("aria-selected", isSelectedFilter.toString());
  });
}

// 현재 todos 배열을 기준으로 Todo 목록 화면을 다시 그립니다.
function renderTodos() {
  todoList.innerHTML = "";

  getFilteredTodos().forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";
    todoItem.dataset.todoId = todo.id;

    if (todo.isCompleted) {
      todoItem.classList.add("completed");
    }

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const editButton = document.createElement("button");
    editButton.className = "todo-button edit-button";
    editButton.type = "button";
    editButton.textContent = "수정";

    const completeButton = document.createElement("button");
    completeButton.className = "todo-button complete-button";
    completeButton.type = "button";
    completeButton.textContent = todo.isCompleted ? "취소" : "완료";

    const deleteButton = document.createElement("button");
    deleteButton.className = "todo-button delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    todoActions.append(editButton, completeButton, deleteButton);
    todoItem.append(todoText, todoActions);
    todoList.append(todoItem);
  });
}

// 입력값을 검증한 뒤 새 Todo를 todos 배열에 추가합니다.
function addTodo(todoText) {
  const trimmedTodoText = todoText.trim();

  if (!trimmedTodoText) {
    showMessage("할 일을 입력한 뒤 추가해 주세요.");
    return;
  }

  todos.push({
    id: createTodoId(),
    text: trimmedTodoText,
    isCompleted: false,
    date: selectedDate,
  });

  todoInput.value = "";
  showMessage("");
  saveTodos();
  renderWeekDays();
  renderTodos();
}

// 선택한 Todo의 내용을 prompt로 입력받아 수정합니다.
function editTodo(todoId) {
  const targetTodo = todos.find((todo) => todo.id === todoId);

  if (!targetTodo) {
    return;
  }

  const editedText = window.prompt("수정할 내용을 입력하세요.", targetTodo.text);

  if (editedText === null) {
    return;
  }

  const trimmedEditedText = editedText.trim();

  if (!trimmedEditedText) {
    showMessage("수정할 내용은 비워둘 수 없습니다.");
    return;
  }

  targetTodo.text = trimmedEditedText;
  showMessage("");
  saveTodos();
  renderWeekDays();
  renderTodos();
}

// 선택한 Todo의 완료 상태를 반대로 바꿉니다.
function toggleTodoCompletion(todoId) {
  todos = todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }

    return {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
  });

  showMessage("");
  saveTodos();
  renderWeekDays();
  renderTodos();
}

// 선택한 Todo를 목록에서 삭제합니다.
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  showMessage("");
  saveTodos();
  renderWeekDays();
  renderTodos();
}

// Todo 추가 폼이 제출되면 기본 새로고침을 막고 Todo를 생성합니다.
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

// 이전 주 버튼은 선택된 날짜를 7일 전으로 이동합니다.
previousWeekButton.addEventListener("click", () => {
  moveSelectedWeek(-7);
});

// 다음 주 버튼은 선택된 날짜를 7일 뒤로 이동합니다.
nextWeekButton.addEventListener("click", () => {
  moveSelectedWeek(7);
});

// 주간 날짜 버튼을 클릭하면 해당 날짜를 선택합니다.
weekDays.addEventListener("click", (event) => {
  const clickedWeekDayButton = event.target.closest(".week-day-button");

  if (!clickedWeekDayButton) {
    return;
  }

  selectDate(clickedWeekDayButton.dataset.date);
});

// 필터 탭을 클릭하면 현재 필터 상태를 변경하고 목록을 다시 그립니다.
filterTabs.addEventListener("click", (event) => {
  const clickedFilterTab = event.target.closest(".filter-tab");

  if (!clickedFilterTab) {
    return;
  }

  currentFilter = clickedFilterTab.dataset.filter;
  updateFilterTabStyles();
  renderTodos();
});

// 목록 영역에서 발생한 버튼 클릭을 구분해 수정, 완료, 삭제 기능을 실행합니다.
todoList.addEventListener("click", (event) => {
  const clickedButton = event.target.closest("button");

  if (!clickedButton) {
    return;
  }

  const todoItem = clickedButton.closest(".todo-item");
  const todoId = todoItem.dataset.todoId;

  if (clickedButton.classList.contains("edit-button")) {
    editTodo(todoId);
    return;
  }

  if (clickedButton.classList.contains("complete-button")) {
    toggleTodoCompletion(todoId);
    return;
  }

  if (clickedButton.classList.contains("delete-button")) {
    deleteTodo(todoId);
  }
});

todos = loadTodos();
updateSelectedDateText();
renderWeekDays();
renderTodos();
