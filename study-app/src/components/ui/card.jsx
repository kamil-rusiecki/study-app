import React from 'react';

export function Card({ className, children, ...props }) {
  return (
    <div className={`bg-white shadow-lg rounded-lg ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={`p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h2 className={`text-2xl font-bold ${className || ''}`} {...props}>
      {children}
    </h2>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={`p-6 pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  );
}