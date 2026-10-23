export type LeadFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  process: string;
  challenge: string;
  contactWay: string;
};
export type LeadFormState = {
  status: "idle" | "error";
  code?: string;
  message?: string;
  token?: string;
  values?: LeadFormValues;
  fieldErrors?: Partial<Record<keyof LeadFormValues, string>>;
};
export const emptyLeadValues: LeadFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  process: "Noch offen",
  challenge: "",
  contactWay: "E-Mail",
};
