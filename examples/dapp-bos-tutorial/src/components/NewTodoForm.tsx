type Props = {
  taskDescription: string;
  onInputChange: (inputValue: string) => void;
  onAddClick: () => void;
};

const NewTodoForm: React.FC<Props> = ({
  taskDescription,
  onInputChange,
  onAddClick,
}) => (
  <div style={{ marginTop: "52px" }}>
    <label style={{ marginRight: "8px" }}>Add new task:</label>
    <input
      style={{ marginRight: "8px" }}
      placeholder="Task Description"
      value={taskDescription}
      onChange={(e) => onInputChange(e.target.value)}
    />
    <button disabled={!taskDescription} onClick={onAddClick}>
      Add
    </button>
  </div>
);

export default NewTodoForm;
