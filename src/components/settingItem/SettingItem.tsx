import { type ReactNode } from "react";
import Button from "../button/Button";

interface SettingItemProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function SettingItem({ icon, title, description, action, className = "" }: SettingItemProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center gap-3 flex-1">
        {icon && <span className="text-gray-600">{icon}</span>}
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-[0.7]">{description}</p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

interface SettingItemWithButtonProps {
  icon?: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  className?: string;
}

export function SettingItemWithButton({ 
  icon, 
  title, 
  description, 
  buttonText, 
  onButtonClick,
  className = "" 
}: SettingItemWithButtonProps) {
  return (
    <SettingItem
      icon={icon}
      title={title}
      description={description}
      action={
        <Button onClick={onButtonClick} size="small" variant="secondary">
          {buttonText}
        </Button>
      }
      className={className}
    />
  );
}
