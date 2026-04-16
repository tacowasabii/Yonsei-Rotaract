export type SignupFormValues = {
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  name: string;
  department: string;
  generation: string;
  workplace: string;
};

export const GENERATION_OPTIONS = [
  ...Array.from({ length: 15 }, (_, i) => `${57.5 - i * 0.5}기`),
  "46~50기",
  "41~45기",
  "31~40기",
  "21~30기",
  "11~20기",
  "1~10기",
];
