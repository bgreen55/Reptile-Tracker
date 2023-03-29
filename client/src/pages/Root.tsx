import { Outlet, useLocation } from "react-router-dom";

export const Root = () => {
    const location = useLocation()
    let name = "Home";
    if (location.pathname !== '/') {
      name = location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2);
    }
  
    return (
      <div>
        <nav className="navbar">{name}</nav>
        {/* Adds children router elements */}
        <Outlet />
      </div>
    )
  }