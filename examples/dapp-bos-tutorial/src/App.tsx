import { useAuth } from "near-social-bridge";
import TodoList from "./components/TodoList";
import NotLoggedInWarning from "./components/NotLoggedInWarning";

function App() {
  const auth = useAuth();

  return (
    <div className="App">
      <h3>Web3 - Todo App</h3>

      {auth.user ? <TodoList /> : <NotLoggedInWarning />}
    </div>
  );
}

export default App;
