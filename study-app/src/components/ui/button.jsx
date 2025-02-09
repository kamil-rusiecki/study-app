import React from 'react';
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: "bg-purple-600 text-white hover:bg-purple-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  outline: "bg-transparent border border-gray-200 hover:bg-gray-50",
  ghost: "bg-transparent hover:bg-gray-50",
  link: "text-purple-600 hover:text-purple-700 hover:underline",
  back: "text-purple-600 hover:text-purple-700 flex items-center"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg"
};

export const Button = React.forwardRef(({ 
  className, 
  variant = "primary",
  size = "md",
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "rounded-lg font-normal transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";