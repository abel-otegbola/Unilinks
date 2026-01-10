'use client';
import { type ReactNode } from "react";
import { XIcon } from "@phosphor-icons/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[400px]",
    md: "max-w-[600px]",
    lg: "max-w-[800px]",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/[0.5] backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative bg-white rounded-[12px] w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 py-3 border-b border-gray-200">
          <h2 className="md:text-[18px] text-[16px] font-medium">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-[8px] transition"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 py-3">
          {children}
        </div>
      </div>
    </div>
  );
}
