import api from "./api";

export const getMyOrders = () => {
  return api.get("https://localhost:7248/api/my/orders", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};
// import api from "./api";



// ADMIN


