import TodoItem from './TodoItem'

function TodoList({
  todos,
  onUpdateTodo,
  onToggleTodoCompletion,
  onDeleteTodo,
}) {
  if (todos.length === 0) {
    return (
      <div className="empty-todo">
        <p>조건에 맞는 Todo가 없습니다.</p>
      </div>
    )
  }

  return (
    <ul className="todo-list" aria-label="Todo 목록">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onToggleTodoCompletion={onToggleTodoCompletion}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  )
}

export default TodoList
