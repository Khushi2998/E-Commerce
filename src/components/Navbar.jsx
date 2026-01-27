import React, { useContext, useState, useEffect,useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHome, FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { getWishlistFromDb } from "../api/wishlistapi";
import { getWishlist } from "../admin/WishlistStorage";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount, fetchCartCount } = useContext(CartContext);
  const menuRef=useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  /* 🔍 Search debounce */
  useEffect(() => {
    if (!search.trim()) return;

    const timer = setTimeout(() => {
      navigate(`/search?query=${search}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, navigate]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  /* 🛒 Cart count */
  useEffect(() => {
    if (user) fetchCartCount();
  }, [user, fetchCartCount]);

  /* ❤️ Wishlist count */
  useEffect(() => {
    const loadWishlistCount = async () => {
      if (isLoggedIn) {
        const res = await getWishlistFromDb();
        setWishlistCount(res.data.length);
      } else {
        setWishlistCount(getWishlist().length);
      }
    };

    loadWishlistCount();
  }, [isLoggedIn]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/logo.png" alt="logo" />
      </div>

      <form
        className="nav-search"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <ul className="nav-links">
        <li>
          <NavLink to="/">
            <FaHome />
          </NavLink>
        </li>

        {!user ? (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        ) : (
          <li className="profile-menu" ref={menuRef}>
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              <CgProfile />
              <span>{user.name}</span>
            </button>

            {open && (
              <div className="dropdown">
                <NavLink to="/profile" onClick={() => setOpen(false)}>
                  My Profile
                </NavLink>

                <NavLink to="/orders" onClick={() => setOpen(false)}>
                  My Orders
                </NavLink>

                {user.role === "Admin" && (
                  <NavLink
                    to="/dashboard/products"
                    onClick={() => setOpen(false)}
                  >
                    Admin Panel
                  </NavLink>
                )}

                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        )}

        <li>
          <NavLink to="/wishlist" className="wishlist">
            <FaRegHeart />
            </NavLink>
        </li>

        <li>
          <NavLink to="/cart" className="cart">
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
