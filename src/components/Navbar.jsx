import React,{useContext,useState} from 'react'
import {NavLink,useNavigate} from 'react-router-dom'
import { FaShoppingCart } from "react-icons/fa";
import { AuthContext } from './AuthContext';
import { CgProfile } from "react-icons/cg";
import Profile from "../Pages/Profiles"
import Orders from "../Pages/Orders";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav>
      <div className="logo">
        <img src="/logo.png" alt="logo" />
      </div>

      <ul>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>

        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <div className="profile-menu">
            <div
              className="profile-trigger"
              onClick={() => setOpen(!open)}
            >
              {/* <img
                src={user.profileImage || "/avatar.png"}
                alt="profile"
                className="avatar"
              /> */}
              <CgProfile />
              <span>{user.name}</span>
            </div>

            {open && (
              <div className="dropdown">
                <NavLink to="/profile" onClick={() => setOpen(false)}>
                  My Profile
                </NavLink>
                <NavLink to="/orders" onClick={() => setOpen(false)}>
                  My Orders
                </NavLink>
                <button className='drop-btn' onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}

        <NavLink to="/cart" className="cart">
          Cart <FaShoppingCart />
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navbar;

