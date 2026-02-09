import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate,useLocation } from "react-router-dom";
import { getCartCount } from "../api/cartApi";
import { FaShoppingCart, FaHome, FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "./AuthContext";
import { CartContext } from "./CartContext";
import { getWishlistFromDb } from "../api/wishlistapi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount,fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const Location=useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);

  const menuRef = useRef(null);
  const typingRef = useRef(false);
  const searchTimeout = useRef(null);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "Admin";

  /* ---------------- SEARCH ---------------- */
  const handleSearchChange = (e) => {
    typingRef.current = true;
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!typingRef.current) return; // only run when user types

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    const q = search.trim();

    searchTimeout.current = setTimeout(() => {
      if (q.length > 0) {
        navigate(`/search?query=${encodeURIComponent(q)}`, { replace: true });
      }
    }, 400);

    return () => clearTimeout(searchTimeout.current);
  }, [search, navigate]);

  useEffect(() => {
    fetchCartCount();

    const handler = () => fetchCartCount();

    window.addEventListener("cartUpdated", handler);

    return () => window.removeEventListener("cartUpdated", handler);
  }, []);


  /* ---------------- DROPDOWN ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- WISHLIST ---------------- */
  useEffect(() => {
    if (!isLoggedIn) return setWishlistCount(0);

    const loadWishlist = async () => {
      try {
        const res = await getWishlistFromDb();
        setWishlistCount(res.data.length);
      } catch {
        setWishlistCount(0);
      }
    };

    loadWishlist();

    const reload = () => loadWishlist();
    window.addEventListener("wishlistUpdated", reload);
    return () => window.removeEventListener("wishlistUpdated", reload);
  }, [isLoggedIn]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.png" alt="logo" />
      </div>

      {/* Search */}
      <form className="nav-search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />
        <button type="submit">🔍</button>
      </form>

      {/* Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/"><FaHome /></NavLink>
        </li>

        {!isLoggedIn ? (
          <>
            <li><NavLink to="/login" state={{ from: location.pathname }}>Login</NavLink></li>
            <li><NavLink to="/register">Register</NavLink></li>
          </>
        ) : (
          <li className="profile-menu" ref={menuRef}>
            <button onClick={() => setOpen(!open)}>
              <CgProfile />
              <span>{user.name}</span>
            </button>

            {open && (
              <div className="dropdown">
                <NavLink to="/profile" onClick={() => setOpen(false)}>My Profile</NavLink>
                {!isAdmin && (<NavLink to="/orders" onClick={() => setOpen(false)}>My Orders</NavLink>)}
                {isAdmin && <NavLink to="/dashboard/products" onClick={() => setOpen(false)}>Admin Panel</NavLink>}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        )}

        {!isAdmin && (
          <>
            <li>
              <NavLink to="/wishlist" className="wishlist">
                <FaRegHeart />
                {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="cart">
                <FaShoppingCart />
                {isLoggedIn && cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;