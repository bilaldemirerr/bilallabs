import { AuthProvider } from "@/components/kpss/AuthProvider";

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
