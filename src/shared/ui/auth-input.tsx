import type { ChangeEvent } from "react";
import { Input } from "@/shared/ui/input";

type Props = {
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const AuthInput = ({ label, type, placeholder, required, value, onChange }: Props) => (
  <div>
    <label className="block text-sm text-text-secondary mb-1.5">{label}</label>
    <Input
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="h-auto rounded-xl py-3 bg-bg placeholder:text-text-muted"
    />
  </div>
);
