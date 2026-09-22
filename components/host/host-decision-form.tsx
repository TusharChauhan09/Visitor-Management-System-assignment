import { confirmApproveForm, confirmDenyForm } from "@/app/actions/approval";
import { Button } from "@/components/ui/button";

type HostDecisionFormProps = {
  token: string;
  action: "approve" | "deny";
  label: string;
  variant?: "default" | "destructive" | "outline";
};

export function HostDecisionForm({
  token,
  action,
  label,
  variant = "default",
}: HostDecisionFormProps) {
  const formAction = action === "approve" ? confirmApproveForm : confirmDenyForm;

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <Button type="submit" size="lg" variant={variant} className="h-11 w-full sm:w-auto">
        {label}
      </Button>
    </form>
  );
}
