export const REGISTER_KEYS = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
} as const;

export type RegisterFieldKey = (typeof REGISTER_KEYS)[keyof typeof REGISTER_KEYS];

export const INPUT_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
} as const;

export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];

export interface Field<K extends string = string> {
  key: K;
  label: string;
  type: InputType;
  placeholder: string;
}

export const REGISTER_FIELDS: Field<RegisterFieldKey>[] = [
  { key: REGISTER_KEYS.NAME,     label: "Full name", type: INPUT_TYPES.TEXT,     placeholder: "John Doe" },
  { key: REGISTER_KEYS.EMAIL,    label: "Email",     type: INPUT_TYPES.EMAIL,    placeholder: "you@example.com" },
  { key: REGISTER_KEYS.PASSWORD, label: "Password",  type: INPUT_TYPES.PASSWORD, placeholder: "Min. 8 characters" },
];
