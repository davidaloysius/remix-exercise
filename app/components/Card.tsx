import { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-white max-w-lg mx-auto my-0 p-10 rounded-md shadow-lg sm:my-10">
      {children}
    </div>
  );
}
