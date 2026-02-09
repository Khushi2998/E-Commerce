export const getToken = () => localStorage.getItem("token");

export const saveAuth = (token, roleId) => {
  localStorage.setItem("token", token);
  localStorage.setItem("roleId", roleId);
};

export const getRoleId = () =>
  Number(localStorage.getItem("roleId"));

export const isLoggedIn = () => !!getToken();

export const isAdmin = () => getRoleId() === 1;

export const isUser = () => getRoleId() === 0;

export const logout = () => localStorage.clear();
