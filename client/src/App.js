import { useEffect, useState } from "react";

function App() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/getUsers")
      .then(res => res.json())
      .then(data => setListOfUsers(data));

    // setListOfUsers(data);
  }, []);

  const createUserHandler = () => {
    fetch("http://localhost:3001/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).then(res => alert("new user created!"));
  };

  return (
    <>
      <div>
        {listOfUsers.map(user => {
          return (
            <div key={user._id}>
              <div>Name: {user.name}</div>
              <div>Age: {user.age}</div>
              <div>Username: {user.name}</div>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          onChange={e =>
            setNewUser(prev => {
              return { ...prev, name: e.target.value };
            })
          }
        />
        <input
          type="number"
          placeholder="Age"
          onChange={e =>
            setNewUser(prev => {
              return { ...prev, age: e.target.value };
            })
          }
        />
        <input
          type="text"
          placeholder="Username"
          onChange={e =>
            setNewUser(prev => {
              return { ...prev, username: e.target.value };
            })
          }
        />
        <button onClick={createUserHandler}>Create User</button>
      </div>
    </>
  );
}

export default App;
