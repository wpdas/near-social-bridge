import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useAuth } from "near-social-bridge";
import { get_greeting, set_greeting } from "./contract";
import { Social, Storage } from "near-social-bridge/api";

function App() {
  const [currentGreeting, setCurrentGreeting] = useState("");

  const auth = useAuth();

  useEffect(() => {
    const fetch = async () => {
      // ==== NEAR ====
      // NEAR.view
      const res = await get_greeting();
      setCurrentGreeting(res);
      console.log(res);

      // ==== Social ====
      // Social.get
      const social_get = await Social.get("wendersonpires.testnet/widget/*");
      console.log("Social Get:", social_get);

      // Social.getr
      const social_getr = await Social.getr("wendersonpires.testnet/profile");
      console.log("Social Getr:", social_getr);

      // Social.index
      const social_index = await Social.index("widget-chatv2-dev", "room", {
        limit: 1000,
        order: "desc",
      });
      console.log("Social Index:", social_index);

      // Social.set
      const data = { experimental: { test: "test" } };
      const social_set = await Social.set(data);
      console.log("Social Index:", social_set);

      // Social.keys
      const social_keys = await Social.keys(
        "wendersonpires.testnet/experimental"
      );
      console.log("Social Keys:", social_keys);

      // ==== Storage ====
      const storage_set = await Storage.set(
        "my-storage-key",
        JSON.stringify({ age: 33, name: "Wendz" })
      );
      console.log("Storage Set:", storage_set);

      const storage_get = await Storage.get("my-storage-key");
      console.log("Storage Get:", storage_get);

      const storage_privateSet = await Storage.privateSet(
        "my-storage-key-private",
        JSON.stringify({ age: 18, name: "Wendz Private" })
      );
      console.log("Storage Private Set:", storage_privateSet);

      const storage_privateGet = await Storage.privateGet(
        "my-storage-key-private"
      );
      console.log("Storage Private Get:", storage_privateGet);
    };

    // fetch();
  }, []);

  const newGreetingHandler = async () => {
    if (!auth.user) {
      console.error("You need to login first!");
      return;
    }

    const newGreeting = `Olá ${Math.round(Math.random() * 100)}`;
    await set_greeting(newGreeting);
  };

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       {currentGreeting}
    //     </a>

    //     <br />

    //     <button type="button" onClick={newGreetingHandler}>
    //       Set New Greeting
    //     </button>
    //   </header>
    // </div>

    <>
      <div>
        <h3>
          The contract says:
          {/* <span className="text-decoration-underline"> {state.greeting} </span> */}
        </h3>

        <p className="text-center py-2">
          Look at that! A greeting stored on the NEAR blockchain.
        </p>

        {/* {context.accountId ? greetingForm : notLoggedInWarning} */}
      </div>
    </>
  );
}

export default App;
