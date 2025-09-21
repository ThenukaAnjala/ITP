import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  to,
  step = -1,
  children = "Back",
  className = "",
  includeBaseStyles = true,
  onClick,
  ...props
}) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) return;

    if (to) {
      navigate(to);
    } else {
      navigate(step);
    }
  };

  const combinedClassName = [includeBaseStyles ? "back-btn" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={combinedClassName} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default BackButton;
