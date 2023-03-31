import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Create } from './pages/Create';
import { Reptile } from './pages/Reptile';
import { Feeding } from './pages/Feeding';
import { Husbandry } from './pages/Husbandry';
import { Schedule } from './pages/Schedule';
import { Root } from './pages/Root';
import './App.css';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Update } from './pages/Update';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        },
        {
          path: 'create',
          element: <Create />
        },
        {
          path: 'reptile/:id',
          element: <Reptile />
        },
        {
          path: 'reptile/:id/feeding',
          element: <Feeding />
        },
        {
          path: 'reptile/:id/husbandry',
          element: <Husbandry />
        },
        {
          path: 'reptile/:id/schedule',
          element: <Schedule />
        },
        {
          path: 'reptile/:id/update',
          element: <Update />
        },
      ]
    },
  ])

  return (
    <RouterProvider router={router}/>
  );
}

export default App
