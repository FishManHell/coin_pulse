export interface PasswordValues {
  currentPassword: string;
  newPassword: string;
  confirm: string;
}

interface FieldConfig {
  key: keyof PasswordValues;
  labelKey: "currentLabel" | "newLabel" | "confirmLabel";
  placeholderKey: "newPlaceholder" | null;
}

export const PASSWORD_FIELDS: ReadonlyArray<FieldConfig> = [
  { key: "currentPassword", labelKey: "currentLabel", placeholderKey: null },
  { key: "newPassword", labelKey: "newLabel", placeholderKey: "newPlaceholder" },
  { key: "confirm", labelKey: "confirmLabel", placeholderKey: null },
];

export const PASSWORD_PLACEHOLDER_MASK = "••••••••";

export const initialPasswordValues: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirm: "",
};
