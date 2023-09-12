import { useCallback, useEffect, useState } from "react";
import { useAuth } from "near-social-bridge/auth";
import NewTodoForm from "./NewTodoForm";
import getTasks, { Task } from "../services/getTasks";
import storeTasks from "../services/storeTasks";

const TodoList = () => {
  const [status, setStatus] = useState<"ready" | "loading" | "saving">(
    "loading"
  );
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const auth = useAuth();

  // Fetch previous tasks
  useEffect(() => {
    if (auth.ready) {
      getTasks(auth.user?.accountId!).then((tasks) => {
        setTasks(tasks);
        setStatus("ready");
      });
    }
  }, [auth]);

  const persistUpdatedData = useCallback(
    async (tasksList?: Task[]) => {
      const updatedTasks = tasksList
        ? tasksList
        : [
            ...tasks,
            { id: Date.now(), description: taskDescription, finished: false },
          ];

      setStatus("saving");

      // Persist data
      const result = await storeTasks(updatedTasks, auth.user?.accountId!);
      if (!result.error) {
        setTasks(updatedTasks);
      }

      setTaskDescription("");
      setStatus("ready");
    },
    [taskDescription, tasks, auth]
  );

  const completeTaskHandler = (task: Task) => {
    const updatedTasks = tasks.map((taskItem) => {
      if (taskItem.id === task.id) {
        taskItem.finished = !taskItem.finished;
      }
      return taskItem;
    });

    // Persist updated data
    persistUpdatedData(updatedTasks);
  };

  const removeTaskHandler = (task: Task) => {
    const updatedTasks = tasks.filter((taskItem) => taskItem.id !== task.id);

    // Persist updated data
    persistUpdatedData(updatedTasks);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {tasks.length === 0 && status === "ready" && <p>No Tasks yet!</p>}
      {status !== "ready" ? (
        <p>{status}...</p>
      ) : (
        <>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <p
                style={{
                  margin: "0 8px 0 0",
                  opacity: task.finished ? "0.3" : "1",
                }}
              >
                {task.description}
              </p>
              <input
                style={{
                  marginRight: "8px",
                  opacity: task.finished ? "0.3" : "1",
                }}
                type="checkbox"
                checked={task.finished}
                onChange={() => completeTaskHandler(task)}
              />
              <button onClick={() => removeTaskHandler(task)}>Remove</button>
            </div>
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
  );
};

export default TodoList;
