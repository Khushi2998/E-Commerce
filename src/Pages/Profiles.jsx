import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import api from "../api/api";
import { IoPerson } from "react-icons/io5";
import { toast } from "sonner";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("profile");
        setUser(res.data); // update context
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          contact: res.data.contact || "",
          address: res.data.address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          pincode: res.data.pincode || ""
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <h2>Please login</h2>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await api.put("profile", formData);
      setUser(response.data); // update context
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed", err);
      toast.error("Profile update failed");
    }
  };

  return (
    <div className="page profile-page">
      <h2>My Profile</h2>

      <div className="profile-card">
        <div className="profile-header">
          <IoPerson size={25} />
          <div>
            <h3>{user.name || "Your Name"}</h3>
            <p className="email">{user.email}</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="profile-info">
              <p><span>Contact:</span> {user.contact || "Not added"}</p>
              <p><span>Address:</span> {user.address || "Not added"}</p>
              <p><span>City:</span> {user.city || "Not added"}</p>
              <p><span>State:</span> {user.state || "Not added"}</p>
              <p><span>Pincode:</span> {user.pincode || "Not added"}</p>
            </div>

            <button className="primary-btn" onClick={() => setIsEditing(true)}>
              {user.contact || user.addressLine ? "Edit Profile" : "Add Details"}
            </button>
          </>
        ) : (
          <div className="edit-form">
            <label>Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} />

            <label>Contact</label>
            <input name="contact" value={formData.contact} onChange={handleChange} />

            <label>Street Address</label>
            <textarea name="addressLine" value={formData.address} onChange={handleChange} />

            <label>City</label>
            <input name="city" value={formData.city} onChange={handleChange} />

            <label>State</label>
            <input name="state" value={formData.state} onChange={handleChange} />

            <label>Pincode</label>
            <input name="pincode" value={formData.pincode} onChange={handleChange} />

            <div className="actions">
              <button className="primary-btn" onClick={handleSave}>Save</button>
              <button className="secondary-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;