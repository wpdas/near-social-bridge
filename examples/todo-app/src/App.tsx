import { useCallback, useEffect, useState } from "react";
import { Social, useAuth } from "near-social-bridge";

interface Task {
  id: number;
  finished: boolean;
  description: string;
}

type TasksIndex = {
  value: Task[];
}[];

function App() {
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<"ready" | "loading" | "saving">(
    "loading"
  );
  const auth = useAuth();

  useEffect(() => {
    Social.index<TasksIndex>("todo-app", "tasks", {
      limit: 1, // Always the most recent
      order: "desc",
    }).then((response) => {
      const incommingTasks = response[0].value;
      setTasks(incommingTasks);
      setStatus("ready");
    });
  }, []);

  const persistUpdatedData = useCallback(
    async (tasksList?: Task[]) => {
      const updatedTasks = tasksList
        ? tasksList
        : [
            ...tasks,
            { id: Date.now(), description: taskDescription, finished: false },
          ];

      // Update the UI first
      setTasks(updatedTasks);

      // Waits for the UI response
      setTimeout(() => {
        setStatus("saving");
      }, 300);

      // Persist data
      const result = await Social.set<{ error?: string }>({
        index: {
          "todo-app": JSON.stringify({
            key: "tasks",
            value: updatedTasks,
          }),
        },
      });

      if (result.error) {
        setStatus("ready");
        return;
      }

      // setTasks(updatedTasks);
      setTaskDescription("");
      setStatus("ready");
    },
    [taskDescription, tasks]
  );

  const onInputChange = (greetingValue: string) => {
    setTaskDescription(greetingValue);
  };

  const onBtnClick = async () => {
    // Persist updated data
    persistUpdatedData();
  };

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

  const newTodoForm = (
    <div style={{ marginTop: "52px" }}>
      <label style={{ marginRight: "8px" }}>Add new task:</label>
      <input
        style={{ marginRight: "8px" }}
        placeholder="Task Description"
        value={taskDescription}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <button onClick={onBtnClick}>Add</button>
    </div>
  );

  const notLoggedInWarning = <p> Login to view your TODO list </p>;

  const todoList = (
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
                justifyContent: "center",
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
          {newTodoForm}
        </>
      )}
    </div>
  );

  return (
    <div className="App">
      <h3>TODO List</h3>

      {auth.user ? todoList : notLoggedInWarning}
    </div>
  );
}

export default App;
