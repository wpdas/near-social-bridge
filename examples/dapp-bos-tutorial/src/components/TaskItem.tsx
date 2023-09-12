// src/components/TaskItem
import { Task } from "../services/getTasks";

type Props = {
  task: Task;
  completeTaskHandler: (task: Task) => void;
  removeTaskHandler: (task: Task) => void;
};

const TaskItem: React.FC<Props> = ({
  task,
  completeTaskHandler,
  removeTaskHandler,
}) => {
  return (
    <div
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
  );
};

export default TaskItem;
