export type PasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirm: string;
};

type FieldConfig = {
  key: keyof PasswordValues;
  label: string;
  placeholder: string;
};

export const PASSWORD_FIELDS: ReadonlyArray<FieldConfig> = [
  { key: "currentPassword", label: "Current password", placeholder: "••••••••" },
  { key: "newPassword", label: "New password", placeholder: "Min. 8 characters" },
  { key: "confirm", label: "Confirm new password", placeholder: "••••••••" },
];

export const initialPasswordValues: PasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirm: "",
};
