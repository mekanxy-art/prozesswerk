import { formToken } from "@/lib/security";
import { safeSource } from "@/lib/validation";
import { LeadFormFields } from "./lead-form-fields";
export function LeadForm({
  error,
  source = "Website",
}: {
  error?: string;
  source?: string;
}) {
  let token = "";
  try {
    token = formToken();
  } catch {
    /* Visibly unavailable until configured. */
  }
  return (
    <LeadFormFields
      token={token}
      source={safeSource(source)}
      initialError={error}
    />
  );
}
