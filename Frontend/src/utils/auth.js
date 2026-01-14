export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
