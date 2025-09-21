import React from "react";
import "../../styles/components/buttons.css";

const variantClass = {
  primary: "btn--primary",
  secondary: "btn--secondary",
  success: "btn--success",
  danger: "btn--danger",
  ghost: "btn--ghost",
  subtle: "btn--subtle",
  link: "btn--link",
};

const sizeClass = {
  sm: "btn--sm",
  md: "btn--md",
  lg: "btn--lg",
};

const Button = ({
  as: Component = "button",
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  children,
  ...rest
}) => {
  const classes = [
    "btn",
    variantClass[variant],
    sizeClass[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isButton = Component === "button";

  const finalProps = {
    className: classes,
    ...rest,
  };

  if (isButton && !finalProps.type) {
    finalProps.type = "button";
  }

  finalProps.disabled = loading || disabled;

  return (
    <Component {...finalProps}>
      {loading ? loadingText : children}
    </Component>
  );
};

export default Button;
