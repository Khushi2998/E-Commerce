import { useContext } from "react";
import { AuthContext } from "../components/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <h2>Please login</h2>;

  return (
    <div className="page">
      <h2>My Profile</h2>
      <img
        src={user.profileImage || "/avatar.png"}
        alt="profile"
        width={120}
      />
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
    </div>
  );
};

export default Profile;
