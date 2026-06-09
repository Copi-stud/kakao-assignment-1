import { useState } from 'react'

function TodoItem({
  todo,
  onUpdateTodo,
  onToggleTodoCompletion,
  onDeleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editingTodoText, setEditingTodoText] = useState(todo.text)
  const [editGuideMessage, setEditGuideMessage] = useState('')

  const completionButtonText = todo.isCompleted ? '완료됨' : '완료하기'

  const startEditingTodo = () => {
    setEditingTodoText(todo.text)
    setEditGuideMessage('')
    setIsEditing(true)
  }

  const cancelEditingTodo = () => {
    // 수정 취소 시 입력값을 원래 Todo 내용으로 되돌립니다.
    setEditingTodoText(todo.text)
    setEditGuideMessage('')
    setIsEditing(false)
  }

  const handleEditingTodoTextChange = (event) => {
    setEditingTodoText(event.target.value)

    if (editGuideMessage) {
      setEditGuideMessage('')
    }
  }

  const saveEditedTodo = (event) => {
    event.preventDefault()

    // 수정 중 Todo 내용이 빈 값으로 저장되지 않게 막습니다.
    if (!editingTodoText.trim()) {
      setEditGuideMessage('수정할 내용을 입력해 주세요.')
      return
    }

    onUpdateTodo(todo.id, editingTodoText)
    setIsEditing(false)
    setEditGuideMessage('')
  }

  return (
    <li className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}>
      <button
        type="button"
        className="complete-button"
        onClick={() => onToggleTodoCompletion(todo.id)}
        aria-label={
          todo.isCompleted ? 'Todo 미완료로 변경' : 'Todo 완료 처리'
        }
      >
        <span className="complete-button-icon">
          {todo.isCompleted ? '✓' : ''}
        </span>
        <span>{completionButtonText}</span>
      </button>

      {isEditing ? (
        <form className="todo-edit-form" onSubmit={saveEditedTodo}>
          <input
            type="text"
            className="todo-edit-input"
            value={editingTodoText}
            onChange={handleEditingTodoTextChange}
            aria-label="Todo 수정 입력"
            autoFocus
          />
          {editGuideMessage && (
            <p className="guide-message edit-guide-message">
              {editGuideMessage}
            </p>
          )}
          <div className="todo-action-group">
            <button type="submit" className="small-button save-button">
              저장
            </button>
            <button
              type="button"
              className="small-button ghost-button"
              onClick={cancelEditingTodo}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <span className="todo-text">{todo.text}</span>
          <div className="todo-action-group">
            <button
              type="button"
              className="small-button ghost-button"
              onClick={startEditingTodo}
            >
              수정
            </button>
            <button
              type="button"
              className="small-button danger-button"
              onClick={() => onDeleteTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default TodoItem
