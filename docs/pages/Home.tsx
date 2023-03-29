
// im trying to implement Dittons authFrontend in these pages


import { Link } from "react-router-dom"

export const Home = () => {
  return (
    <>
        <h1>Reptile Manager</h1>
        <p>Reptile Manager is a web application that allows users to track their reptiles and their care.</p>

      <nav>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
      </nav>
    </>
  )
}

