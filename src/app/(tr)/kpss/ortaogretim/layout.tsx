import { AuthProvider } from "@/components/kpss/AuthProvider";

export default function OrtaogretimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
