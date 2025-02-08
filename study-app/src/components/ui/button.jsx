import React from 'react';

export function Button({ className, variant = 'default', children, ...props }) {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantClasses = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 hover:bg-gray-50',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}