import { permanentRedirect } from "next/navigation";
import { LEVEL_BASE } from "@/lib/kpss/paths";

/**
 * Şimdilik tek düzey yayında, bu yüzden /kpss ile /kpss/ortaogretim ikiz
 * içerik olurdu. İkinci düzey eklendiğinde burası gerçek bir dizin sayfasına
 * dönüşecek.
 */
export default function KpssIndexPage() {
  permanentRedirect(LEVEL_BASE);
}
