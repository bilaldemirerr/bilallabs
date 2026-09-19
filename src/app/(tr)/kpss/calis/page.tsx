import { redirect } from "next/navigation";
import { START_PATH } from "@/lib/kpss/paths";

export default function LegacyCalisRedirect() {
  redirect(START_PATH);
}
