//app/dashboard/logros/components/DynamicIcon.tsx
"use client";

import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  name: string;
  [key: string]: unknown;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<unknown>;
  return IconComponent ? <IconComponent {...props} /> : null;
};