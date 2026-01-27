import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import api from "../api/api"
import { IoPerson } from "react-icons/io5";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  if (!user) return <h2>Please login</h2>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  try {
    const response = await api.put("profile", {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });

    setUser(response.data); 
    setIsEditing(false);
  } catch (err) {
    console.error("Profile update failed", err);
    alert("Profile update failed");
  }
};


  return (
    <div className="page profile-page">
  <h2>My Profile</h2>

  <div className="profile-card">
    <div className="profile-header">
      <IoPerson size={25}/>
       
      
      <div>
        <h3>{user.name || "Your Name"}</h3>
        <p className="email">{user.email}</p>
      </div>
    </div>

    {!isEditing ? (
      <>
        <div className="profile-info">
          <p><span>Phone</span>{user.phone || "Not added"}</p>
          <p><span>Address</span>{user.address || "Not added"}</p>
        </div>

        <button className="primary-btn" onClick={() => setIsEditing(true)}>
          {user.phone || user.address ? "Edit Profile" : "Add Details"}
        </button>
      </>
    ) : (
      <div className="edit-form">
        <label>Full Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <div className="actions">
          <button className="primary-btn" onClick={handleSave}>Save</button>
          <button className="secondary-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default Profile;
