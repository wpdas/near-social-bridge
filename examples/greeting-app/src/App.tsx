import { useEffect, useState } from "react";
import { useAuth } from "near-social-bridge";
import * as contract from "./contract";

function App() {
  const [currentGreeting, setCurrentGreeting] = useState("loading...");
  const [greeting, setGreeting] = useState("");
  const [status, setStatus] = useState<"ready" | "pending">("ready");

  const auth = useAuth();

  useEffect(() => {
    contract.get_greeting().then((response) => setCurrentGreeting(response));
  }, []);

  const onBtnClick = async () => {
    setStatus("pending");
    await contract.set_greeting(greeting);
    setCurrentGreeting(greeting);
  };

  const onInputChange = (greetingValue: string) => {
    setGreeting(greetingValue);
    console.log(greetingValue);
  };

  const greetingForm = (
    <>
      <div className="border border-black p-3">
        {status === "pending" ? (
          <p>Saving...</p>
        ) : (
          <>
            <label style={{ marginRight: "8px" }}>Update greeting:</label>
            <input
              placeholder="Howdy"
              onChange={(e) => onInputChange(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={onBtnClick}>
              Save
            </button>
          </>
        )}
      </div>
    </>
  );

  const notLoggedInWarning = <p> Login to change the greeting </p>;

  return (
    <div className="App">
      <h3>
        The contract says:{" "}
        <span style={{ textDecoration: "underline", fontWeight: 400 }}>
          {currentGreeting}
        </span>
      </h3>

      <p>Look at that! A greeting stored on the NEAR blockchain.</p>

      {auth.user ? greetingForm : notLoggedInWarning}
    </div>
  );
}

export default App;
