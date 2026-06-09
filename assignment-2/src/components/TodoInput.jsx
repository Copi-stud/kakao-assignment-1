import { useState } from 'react'

function TodoInput({ onAddTodo }) {
  const [todoText, setTodoText] = useState('')
  const [guideMessage, setGuideMessage] = useState('')

  const handleTodoTextChange = (event) => {
    setTodoText(event.target.value)

    // 사용자가 다시 입력을 시작하면 이전 안내 메시지를 지웁니다.
    if (guideMessage) {
      setGuideMessage('')
    }
  }

  const handleTodoSubmit = (event) => {
    event.preventDefault()

    // 입력값이 비어 있으면 Todo를 생성하지 않습니다.
    if (!todoText.trim()) {
      setGuideMessage('Todo 내용을 입력한 뒤 추가해 주세요.')
      return
    }

    onAddTodo(todoText)
    setTodoText('')
    setGuideMessage('')
  }

  return (
    <form className="todo-input-form" onSubmit={handleTodoSubmit}>
      <div className="todo-input-row">
        <input
          type="text"
          className="todo-input"
          value={todoText}
          onChange={handleTodoTextChange}
          placeholder="새로운 Todo를 입력하세요"
          aria-label="새로운 Todo 입력"
        />
        <button type="submit" className="primary-button">
          추가
        </button>
      </div>

      {guideMessage && <p className="guide-message">{guideMessage}</p>}
    </form>
  )
}

export default TodoInput
