/**
 * Quoted from Localizable.xcstrings localizations.pt. Nothing else is shown on /pt/invo.
 * onboarding.one.sentence
 */
export const PT_HEADLINE =
  "Orçamentos **mais rápidos,** **mais inteligentes,** **mais baratos.** Com **IA.** Conquiste mais obras com precisão.";

/** paywall.features.allTools */
export const PT_TOOLS =
  "Cada novo documento inclui itens, margem, impostos, sinais, PDF com sua marca e relatórios";

/** common.legal.privacy */
export const PT_PRIVACY = "Política de Privacidade";

/** common.legal.terms */
export const PT_TERMS = "Termos de Uso";

/** settings.support.contact */
export const PT_SUPPORT = "Contatar suporte";

export function ptPlain(value: string): string {
  return value.replaceAll("**", "");
}
