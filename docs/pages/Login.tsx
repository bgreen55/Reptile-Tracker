import { useContext, useState } from "react";
import { AuthContext } from "../contexts/auth";
import { useApi } from "../hooks/useApi";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("");
  const api = useApi();
  const setToken = useContext(AuthContext);

  async function signUp() {
    const body = {
      email,
      password
    }

    const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}/users`, body)

    if (resultBody.token) {
      setToken(resultBody.token)
    }
  }

  return (

    <form className="signup-form">
      <label>
        Email
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" />
      </label>
      <label>
        Password
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" />
      </label>
      <button type="button" onClick={signUp}>Sign up</button>
    </form>


 
  )
}



    // <h1>Login</h1>
    // <input type="text" id="email" name="email" placeholder="Email" />
    // <input type="password" id="password" name="password" placeholder="Password" />
    // <button onclick="pullData()">Login</button>
    
    // <a href="/signup">Signup</a>
    // <a href="/">Home</a>