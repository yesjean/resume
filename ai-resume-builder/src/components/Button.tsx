import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" |"basic"| "danger" | "tab-active" | "tab-inactive";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const base = "py-2 px-4 rounded transition font-medium";

  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    basic: "text-blue-500 underline",
    danger: "text-red-500 underline",
    "tab-active": "bg-blue-600 text-white",
    "tab-inactive": "bg-gray-200 text-gray-700",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${base} ${variants[variant]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
