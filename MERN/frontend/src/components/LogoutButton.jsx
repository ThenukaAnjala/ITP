import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({
  children = "Logout",
  className = "",
  redirectTo = "/",
  includeBaseStyles = true,
  onLogout,
  ...props
}) => {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    if (onLogout) {
      onLogout(event);
    }

    if (event?.defaultPrevented) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate(redirectTo, { replace: true });
  };

  const combinedClassName = [includeBaseStyles ? "logout-btn" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={combinedClassName} onClick={handleLogout} {...props}>
      {children}
    </button>
  );
};

export default LogoutButton;
