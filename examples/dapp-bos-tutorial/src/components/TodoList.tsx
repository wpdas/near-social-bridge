// src/components/TodoList.tsx
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from 'near-social-bridge/auth'
import NewTodoForm from './NewTodoForm'
import TaskItem from './TaskItem'
import getTasks, { Task } from '../services/getTasks'
import storeTasks from '../services/storeTasks'

const TodoList = () => {
  const [status, setStatus] = useState<'ready' | 'loading' | 'saving'>('loading')
  const [taskDescription, setTaskDescription] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const auth = useAuth()

  // Fetch previous tasks
  useEffect(() => {
    if (auth.ready) {
      getTasks(auth.user?.accountId!).then((tasks) => {
        setTasks(tasks)
        setStatus('ready')
      })
    }
  }, [auth])

  const persistUpdatedData = useCallback(
    async (tasksList?: Task[]) => {
      const updatedTasks = tasksList
        ? tasksList
        : [...tasks, { id: Date.now(), description: taskDescription, finished: false }]
      setStatus('saving')
      // Persist data
      const result = await storeTasks(updatedTasks, auth.user?.accountId!)
      if (!result.error) {
        setTasks(updatedTasks)
      }
      setTaskDescription('')
      setStatus('ready')
    },
    [taskDescription, tasks, auth]
  )

  const completeTaskHandler = (task: Task) => {
    const updatedTasks = tasks.map((taskItem) => {
      if (taskItem.id === task.id) {
        taskItem.finished = !taskItem.finished
      }
      return taskItem
    })

    // Persist updated data
    persistUpdatedData(updatedTasks)
  }

  const removeTaskHandler = (task: Task) => {
    const updatedTasks = tasks.filter((taskItem) => taskItem.id !== task.id)
    // Persist updated data
    persistUpdatedData(updatedTasks)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
      {tasks.length === 0 && status === 'ready' && <p>No Tasks yet!</p>}
      {status !== 'ready' ? (
        <p>{status}...</p>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              completeTaskHandler={completeTaskHandler}
              removeTaskHandler={removeTaskHandler}
            />
          ))}
          <br />
          <NewTodoForm
            taskDescription={taskDescription}
            onInputChange={(inputValue) => setTaskDescription(inputValue)}
            onAddClick={() => persistUpdatedData()}
          />
        </>
      )}
    </div>
  )
}

export default TodoList
