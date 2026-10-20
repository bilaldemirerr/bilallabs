import type { LocaleId } from "./locales.ts";
import { PT_PRIVACY, PT_SUPPORT, PT_TERMS } from "./pt.ts";
import type { PostCategory } from "./posts.ts";
import type { StoreCopy } from "./store.ts";

export type LandingChrome = {
  headline: string;
  priceTitle: string;
  sendTitle: string;
  trackTitle: string;
  moreTitle: string;
  /** Used when the store description has no AI bullet. */
  ai: string;
  priceNote: string;
  support: string;
  blog: string;
  /** The published posts are how-to guides. One real category, not an empty filter row. */
  guides: string;
  language: string;
  badgeAlt: string;
};

export const LANGUAGE_NAME: Record<LocaleId, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  "pt-BR": "Português (Brasil)",
  tr: "Türkçe",
  pt: "Português",
};

export const CHROME: Record<LocaleId, LandingChrome> = {
  en: {
    headline: "Create estimates, quotes, and invoices right from the jobsite.",
    priceTitle: "Price the job in line items",
    sendTitle: "Send a branded PDF",
    trackTitle: "Track what was billed and paid",
    moreTitle: "Also in the app",
    ai: "",
    priceNote: "Plan details and current prices are shown in the app.",
    support: "Support",
    blog: "Blog",
    guides: "Guides",
    language: "Language",
    badgeAlt: "Download on the App Store",
  },
  de: {
    headline: "Angebote, Kostenvoranschläge und Rechnungen direkt vom Telefon.",
    priceTitle: "Positionen, Aufschlag und Anzahlung",
    sendTitle: "Gebrandetes PDF senden",
    trackTitle: "Fakturiert, eingegangen, offen",
    moreTitle: "Ebenfalls in der App",
    ai: "Optionale KI-Unterstützung erstellt den ersten Entwurf — Sie bleiben bei der Arbeit.",
    priceNote: "Plandetails und aktuelle Preise stehen in der App.",
    support: "Support",
    blog: "Blog",
    guides: "Anleitungen",
    language: "Sprache",
    badgeAlt: "Laden im App Store",
  },
  es: {
    headline: "Presupuestos y facturas profesionales desde el teléfono.",
    priceTitle: "Partidas, recargo, IVA y anticipos",
    sendTitle: "Envía un PDF con tu marca",
    trackTitle: "Facturado, cobrado y pendiente",
    moreTitle: "También en la app",
    ai: "El asistente de IA opcional redacta el primer borrador para que tú te centres en la obra.",
    priceNote: "Los detalles del plan y los precios actuales están en la app.",
    support: "Soporte",
    blog: "Blog",
    guides: "Guías",
    language: "Idioma",
    badgeAlt: "Consíguelo en el App Store",
  },
  fr: {
    headline: "Devis, offres et factures depuis le téléphone.",
    priceTitle: "Postes, marge, TVA et acomptes",
    sendTitle: "Envoyer un PDF à votre image",
    trackTitle: "Facturé, encaissé, en attente",
    moreTitle: "Aussi dans l’app",
    ai: "L’assistance IA facultative rédige la première version — vous restez sur le chantier.",
    priceNote: "Le détail des formules et les prix actuels sont dans l’app.",
    support: "Assistance",
    blog: "Blog",
    guides: "Guides",
    language: "Langue",
    badgeAlt: "Télécharger dans l’App Store",
  },
  "pt-BR": {
    headline: "Orçamentos e faturas direto do celular.",
    priceTitle: "Itens, margem, imposto e entrada",
    sendTitle: "Envie um PDF com a sua marca",
    trackTitle: "Faturado, recebido e em aberto",
    moreTitle: "Também no app",
    ai: "O assistente de IA opcional monta o primeiro rascunho — você fica na obra.",
    priceNote: "Os detalhes do plano e os preços atuais estão no app.",
    support: "Suporte",
    blog: "Blog",
    guides: "Guias",
    language: "Idioma",
    badgeAlt: "Baixar na App Store",
  },
  tr: {
    headline: "Tahmin, teklif ve faturayı telefondan çıkarın.",
    priceTitle: "Kalem, marj, vergi ve kapora",
    sendTitle: "Markalı PDF gönderin",
    trackTitle: "Faturalanan, tahsil edilen, açık",
    moreTitle: "Uygulamada ayrıca",
    ai: "İsteğe bağlı yapay zeka desteği ilk taslağı üretir; siz işe odaklanırsınız.",
    priceNote: "Plan ayrıntıları ve güncel fiyatlar uygulamada görünür.",
    support: "Destek",
    blog: "Blog",
    guides: "Rehberler",
    language: "Dil",
    badgeAlt: "App Store’dan İndir",
  },
  pt: {
    headline: "Orçamentos, propostas e faturas a partir da obra.",
    priceTitle: "Itens, margem, imposto e sinal",
    sendTitle: "Envie um PDF com a sua marca",
    trackTitle: "Faturado, recebido e em aberto",
    moreTitle: "Também na aplicação",
    ai: "A assistência de IA opcional prepara o primeiro rascunho — o utilizador revê e envia.",
    priceNote: "Os detalhes do plano e os preços atuais estão na aplicação.",
    support: PT_SUPPORT,
    blog: "Blog",
    guides: "Guias",
    language: "Idioma",
    badgeAlt: "Descarregar na App Store",
  },
};

export type LandingSections = {
  nav: { features: string; pricing: string; faq: string };
  seeFeatures: string;
  featuresTitle: string;
  featuresLede: string;
  tabsTitle: string;
  statsTitle: string;
  /** Labels for: 3 document types, 6 PDF templates, 4 currencies, 7 languages. */
  stats: [string, string, string, string];
  pricingTitle: string;
  faqTitle: string;
  faqs: [question: string, answer: string][];
  ctaTitle: string;
  ctaLede: string;
};

export const SECTIONS: Record<LocaleId, LandingSections> = {
  en: {
    nav: { features: "Features", pricing: "Pricing", faq: "FAQ" },
    seeFeatures: "See features",
    featuresTitle: "Everything a job needs, from first number to final payment",
    featuresLede: "Invo keeps estimates, quotes, and invoices together, so the price you agreed on is the price you bill.",
    tabsTitle: "Built around how jobs actually get billed",
    statsTitle: "The short version",
    stats: ["document types", "PDF templates", "currencies", "languages"],
    pricingTitle: "Pick the plan that fits your work",
    faqTitle: "Frequently asked questions",
    faqs: [
      ["Who is Invo for?", "Contractors, handymen, and field-service pros who price and bill work on site — renovations, construction, repairs, and similar jobs."],
      ["What documents can I create?", "Estimates, quotes, and invoices. Each one is built from line items with quantity, unit, and unit cost, plus markup, sales tax, and deposits."],
      ["Can I add my logo?", "Yes. Add your logo and brand color, pick one of six templates, and sign on the device before you send the PDF."],
      ["How do I keep track of payments?", "Record deposits and payments on each document. Reports show what was billed, collected, outstanding, and overdue."],
      ["How much does Invo cost?", "Choose a weekly, monthly, annual, or lifetime plan. Current prices are shown in the app."],
      ["What does the AI do?", "It's optional. It drafts a first pass, and you review and edit everything before it's sent."],
      ["Which currencies are supported?", "USD, EUR, GBP, and TRY."],
    ],
    ctaTitle: "Your next estimate can go out today.",
    ctaLede: "Download Invo, create your first estimate on site, and send a branded PDF before you leave.",
  },
  de: {
    nav: { features: "Funktionen", pricing: "Preise", faq: "FAQ" },
    seeFeatures: "Funktionen ansehen",
    featuresTitle: "Alles für den Auftrag – vom ersten Preis bis zur Zahlung",
    featuresLede: "Kostenvoranschläge, Angebote und Rechnungen an einem Ort. Der vereinbarte Preis ist der Preis, den Sie abrechnen.",
    tabsTitle: "So wird ein Auftrag wirklich abgerechnet",
    statsTitle: "Kurz gesagt",
    stats: ["Dokumenttypen", "PDF-Vorlagen", "Währungen", "Sprachen"],
    pricingTitle: "Wählen Sie den passenden Plan",
    faqTitle: "Häufige Fragen",
    faqs: [
      ["Für wen ist Invo?", "Für Handwerker, Bauunternehmen und Servicetechniker, die vor Ort kalkulieren und abrechnen – Renovierung, Bau, Reparaturen und ähnliche Aufträge."],
      ["Welche Dokumente kann ich erstellen?", "Kostenvoranschläge, Angebote und Rechnungen. Jedes Dokument besteht aus Positionen mit Menge, Einheit und Einzelpreis, dazu Aufschlag, Steuer und Anzahlung."],
      ["Kann ich mein Logo verwenden?", "Ja. Logo und Markenfarbe hinzufügen, eine von sechs Vorlagen wählen und vor dem Versand direkt auf dem Gerät unterschreiben."],
      ["Wie behalte ich Zahlungen im Blick?", "Anzahlungen und Zahlungen werden je Dokument erfasst. Berichte zeigen, was fakturiert, eingegangen, offen und überfällig ist."],
      ["Was kostet Invo?", "Wählen Sie einen wöchentlichen, monatlichen, jährlichen oder lebenslangen Plan. Aktuelle Preise stehen in der App."],
      ["Was macht die KI?", "Sie ist optional und erstellt einen ersten Entwurf. Sie prüfen und bearbeiten alles, bevor es verschickt wird."],
      ["Welche Währungen werden unterstützt?", "USD, EUR, GBP und TRY."],
    ],
    ctaTitle: "Ihr nächster Kostenvoranschlag kann heute raus.",
    ctaLede: "Invo laden, den ersten Kostenvoranschlag vor Ort erstellen und das PDF verschicken, bevor Sie gehen.",
  },
  es: {
    nav: { features: "Funciones", pricing: "Precios", faq: "Preguntas" },
    seeFeatures: "Ver funciones",
    featuresTitle: "Todo lo que necesita una obra, del primer precio al cobro final",
    featuresLede: "Presupuestos, ofertas y facturas en un solo lugar, para que lo que acordaste sea lo que facturas.",
    tabsTitle: "Pensado para cómo se factura de verdad una obra",
    statsTitle: "En pocas palabras",
    stats: ["tipos de documento", "plantillas de PDF", "monedas", "idiomas"],
    pricingTitle: "Elige el plan que encaja con tu trabajo",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      ["¿Para quién es Invo?", "Para contratistas, reformistas y técnicos de campo que presupuestan y facturan en la obra: reformas, construcción, reparaciones y trabajos similares."],
      ["¿Qué documentos puedo crear?", "Presupuestos, ofertas y facturas. Cada uno se arma con partidas con cantidad, unidad y precio unitario, más recargo, IVA y anticipos."],
      ["¿Puedo añadir mi logotipo?", "Sí. Añade tu logotipo y color de marca, elige una de seis plantillas y firma en el dispositivo antes de enviar el PDF."],
      ["¿Cómo controlo los pagos?", "Registra anticipos y pagos en cada documento. Los informes muestran lo facturado, cobrado, pendiente y vencido."],
      ["¿Cuánto cuesta Invo?", "Elige un plan semanal, mensual, anual o vitalicio. Los precios actuales están en la app."],
      ["¿Qué hace la IA?", "Es opcional y redacta un primer borrador. Tú revisas y editas todo antes de enviarlo."],
      ["¿Qué monedas admite?", "USD, EUR, GBP y TRY."],
    ],
    ctaTitle: "Tu próximo presupuesto puede salir hoy.",
    ctaLede: "Descarga Invo, crea tu primer presupuesto en la obra y envía el PDF con tu marca antes de irte.",
  },
  fr: {
    nav: { features: "Fonctionnalités", pricing: "Tarifs", faq: "FAQ" },
    seeFeatures: "Voir les fonctionnalités",
    featuresTitle: "Tout pour un chantier, du premier chiffre au dernier paiement",
    featuresLede: "Devis, offres et factures au même endroit : le prix convenu est le prix facturé.",
    tabsTitle: "Pensé pour la façon dont un chantier se facture",
    statsTitle: "En bref",
    stats: ["types de documents", "modèles de PDF", "devises", "langues"],
    pricingTitle: "Choisissez la formule adaptée à votre activité",
    faqTitle: "Questions fréquentes",
    faqs: [
      ["À qui s’adresse Invo ?", "Aux artisans, entrepreneurs et techniciens d’intervention qui chiffrent et facturent sur place : rénovation, construction, dépannage et travaux similaires."],
      ["Quels documents puis-je créer ?", "Des devis, des offres et des factures. Chacun se compose de postes avec quantité, unité et prix unitaire, plus marge, TVA et acomptes."],
      ["Puis-je ajouter mon logo ?", "Oui. Ajoutez votre logo et votre couleur, choisissez l’un des six modèles et signez sur l’appareil avant d’envoyer le PDF."],
      ["Comment suivre les paiements ?", "Enregistrez acomptes et paiements sur chaque document. Les rapports indiquent le facturé, l’encaissé, l’en attente et l’en retard."],
      ["Combien coûte Invo ?", "Choisissez une formule hebdomadaire, mensuelle, annuelle ou à vie. Les prix actuels sont dans l’app."],
      ["Que fait l’IA ?", "Elle est facultative et rédige une première version. Vous relisez et modifiez tout avant l’envoi."],
      ["Quelles devises sont prises en charge ?", "USD, EUR, GBP et TRY."],
    ],
    ctaTitle: "Votre prochain devis peut partir aujourd’hui.",
    ctaLede: "Téléchargez Invo, créez votre premier devis sur le chantier et envoyez le PDF à votre image avant de partir.",
  },
  "pt-BR": {
    nav: { features: "Recursos", pricing: "Planos", faq: "Dúvidas" },
    seeFeatures: "Ver recursos",
    featuresTitle: "Tudo o que a obra precisa, do primeiro valor ao último pagamento",
    featuresLede: "Orçamentos, propostas e faturas no mesmo lugar, para você cobrar exatamente o que foi combinado.",
    tabsTitle: "Feito para o jeito que a obra é cobrada",
    statsTitle: "Resumindo",
    stats: ["tipos de documento", "modelos de PDF", "moedas", "idiomas"],
    pricingTitle: "Escolha o plano certo para o seu trabalho",
    faqTitle: "Perguntas frequentes",
    faqs: [
      ["Para quem é o Invo?", "Para empreiteiros, prestadores de serviço e técnicos de campo que orçam e cobram na obra: reformas, construção, reparos e trabalhos parecidos."],
      ["Quais documentos posso criar?", "Orçamentos, propostas e faturas. Cada um é montado com itens com quantidade, unidade e custo unitário, além de margem, imposto e entrada."],
      ["Posso usar meu logo?", "Sim. Adicione seu logo e a cor da marca, escolha um dos seis modelos e assine no aparelho antes de enviar o PDF."],
      ["Como acompanho os pagamentos?", "Registre entradas e pagamentos em cada documento. Os relatórios mostram o faturado, recebido, em aberto e vencido."],
      ["Quanto custa o Invo?", "Escolha um plano semanal, mensal, anual ou vitalício. Os preços atuais aparecem no app."],
      ["O que a IA faz?", "É opcional e monta um primeiro rascunho. Você revisa e edita tudo antes de enviar."],
      ["Quais moedas são aceitas?", "USD, EUR, GBP e TRY."],
    ],
    ctaTitle: "Seu próximo orçamento pode sair hoje.",
    ctaLede: "Baixe o Invo, crie o primeiro orçamento na obra e envie o PDF com a sua marca antes de ir embora.",
  },
  tr: {
    nav: { features: "Özellikler", pricing: "Planlar", faq: "SSS" },
    seeFeatures: "Özellikleri gör",
    featuresTitle: "İlk rakamdan son ödemeye kadar işin ihtiyacı olan her şey",
    featuresLede: "Tahmin, teklif ve faturalar tek yerde; anlaştığınız fiyat, faturaladığınız fiyat olur.",
    tabsTitle: "İşlerin gerçekte nasıl faturalandığına göre tasarlandı",
    statsTitle: "Kısaca",
    stats: ["belge türü", "PDF şablonu", "para birimi", "dil"],
    pricingTitle: "İşinize uyan planı seçin",
    faqTitle: "Sık sorulan sorular",
    faqs: [
      ["Invo kimler için?", "Sahada fiyat çıkarıp faturalayan müteahhitler, ustalar ve saha servis ekipleri için: tadilat, inşaat, onarım ve benzeri işler."],
      ["Hangi belgeleri oluşturabilirim?", "Tahmin, teklif ve fatura. Her biri miktar, birim ve birim fiyatlı kalemlerden oluşur; üzerine marj, vergi ve kapora eklenir."],
      ["Logomu ekleyebilir miyim?", "Evet. Logonuzu ve marka renginizi ekleyin, altı şablondan birini seçin ve PDF’i göndermeden önce imzayı cihazda alın."],
      ["Ödemeleri nasıl takip ederim?", "Kapora ve ödemeleri her belgeye kaydedin. Raporlar faturalanan, tahsil edilen, açık ve gecikmiş tutarları gösterir."],
      ["Invo ne kadar?", "Haftalık, aylık, yıllık veya ömür boyu plan seçebilirsiniz. Güncel fiyatlar uygulamada görünür."],
      ["Yapay zeka ne yapıyor?", "İsteğe bağlıdır ve ilk taslağı hazırlar. Göndermeden önce her şeyi siz kontrol edip düzenlersiniz."],
      ["Hangi para birimleri destekleniyor?", "USD, EUR, GBP ve TRY."],
    ],
    ctaTitle: "Bir sonraki teklifiniz bugün çıkabilir.",
    ctaLede: "Invo’yu indirin, ilk tahmini sahada hazırlayın ve markalı PDF’i oradan ayrılmadan gönderin.",
  },
  pt: {
    nav: { features: "Funcionalidades", pricing: "Planos", faq: "Perguntas" },
    seeFeatures: "Ver funcionalidades",
    featuresTitle: "Tudo o que a obra precisa, do primeiro valor ao último pagamento",
    featuresLede: "Orçamentos, propostas e faturas no mesmo sítio, para faturar exatamente o que foi acordado.",
    tabsTitle: "Pensado para a forma como uma obra é faturada",
    statsTitle: "Em resumo",
    stats: ["tipos de documento", "modelos de PDF", "moedas", "idiomas"],
    pricingTitle: "Escolha o plano certo para o seu trabalho",
    faqTitle: "Perguntas frequentes",
    faqs: [
      ["Para quem é o Invo?", "Para empreiteiros, técnicos e profissionais de campo que orçamentam e faturam em obra: remodelações, construção, reparações e trabalhos semelhantes."],
      ["Que documentos posso criar?", "Orçamentos, propostas e faturas. Cada um é composto por itens com quantidade, unidade e custo unitário, além de margem, imposto e sinal."],
      ["Posso usar o meu logótipo?", "Sim. Adicione o logótipo e a cor da marca, escolha um dos seis modelos e assine no dispositivo antes de enviar o PDF."],
      ["Como acompanho os pagamentos?", "Registe sinais e pagamentos em cada documento. Os relatórios mostram o faturado, recebido, em aberto e vencido."],
      ["Quanto custa o Invo?", "Escolha um plano semanal, mensal, anual ou vitalício. Os preços atuais estão na aplicação."],
      ["O que faz a IA?", "É opcional e prepara um primeiro rascunho. O utilizador revê e edita tudo antes de enviar."],
      ["Que moedas são suportadas?", "USD, EUR, GBP e TRY."],
    ],
    ctaTitle: "O seu próximo orçamento pode sair hoje.",
    ctaLede: "Descarregue o Invo, crie o primeiro orçamento em obra e envie o PDF com a sua marca antes de sair.",
  },
};

export type BlogChrome = {
  categories: Record<PostCategory, string>;
  minutes: (n: number) => string;
  toc: string;
  related: string;
  latest: string;
  postCta: string;
  rss: string;
};

export const BLOG: Record<LocaleId, BlogChrome> = {
  en: {
    categories: { comparisons: "Comparisons", estimates: "Estimates", pricing: "Pricing", invoicing: "Invoicing", payments: "Payments" },
    minutes: (n) => `${n} min read`,
    toc: "On this page",
    related: "Related guides",
    latest: "Latest guide",
    postCta: "Build your next estimate in Invo, right from the jobsite.",
    rss: "RSS feed",
  },
  de: {
    categories: { comparisons: "Vergleiche", estimates: "Kostenvoranschläge", pricing: "Kalkulation", invoicing: "Rechnungen", payments: "Zahlungen" },
    minutes: (n) => `${n} Min. Lesezeit`,
    toc: "Auf dieser Seite",
    related: "Weitere Anleitungen",
    latest: "Neueste Anleitung",
    postCta: "Erstellen Sie Ihren nächsten Kostenvoranschlag direkt vor Ort in Invo.",
    rss: "RSS-Feed",
  },
  es: {
    categories: { comparisons: "Comparativas", estimates: "Presupuestos", pricing: "Precios", invoicing: "Facturación", payments: "Cobros" },
    minutes: (n) => `${n} min de lectura`,
    toc: "En esta página",
    related: "Guías relacionadas",
    latest: "Última guía",
    postCta: "Haz tu próximo presupuesto en Invo, desde la obra.",
    rss: "Feed RSS",
  },
  fr: {
    categories: { comparisons: "Comparatifs", estimates: "Devis", pricing: "Tarification", invoicing: "Facturation", payments: "Paiements" },
    minutes: (n) => `${n} min de lecture`,
    toc: "Sur cette page",
    related: "Guides associés",
    latest: "Dernier guide",
    postCta: "Créez votre prochain devis dans Invo, depuis le chantier.",
    rss: "Flux RSS",
  },
  "pt-BR": {
    categories: { comparisons: "Comparativos", estimates: "Orçamentos", pricing: "Preços", invoicing: "Faturamento", payments: "Pagamentos" },
    minutes: (n) => `${n} min de leitura`,
    toc: "Nesta página",
    related: "Guias relacionados",
    latest: "Guia mais recente",
    postCta: "Monte seu próximo orçamento no Invo, direto da obra.",
    rss: "Feed RSS",
  },
  tr: {
    categories: { comparisons: "Karşılaştırmalar", estimates: "Tahmin", pricing: "Fiyatlandırma", invoicing: "Faturalama", payments: "Tahsilat" },
    minutes: (n) => `${n} dk okuma`,
    toc: "Bu sayfada",
    related: "İlgili rehberler",
    latest: "En yeni rehber",
    postCta: "Bir sonraki tahmininizi sahadan, Invo’da hazırlayın.",
    rss: "RSS akışı",
  },
  pt: {
    categories: { comparisons: "Comparações", estimates: "Orçamentos", pricing: "Preços", invoicing: "Faturação", payments: "Pagamentos" },
    minutes: (n) => `${n} min de leitura`,
    toc: "Nesta página",
    related: "Guias relacionados",
    latest: "Guia mais recente",
    postCta: "Prepare o próximo orçamento no Invo, a partir da obra.",
    rss: "Feed RSS",
  },
};

/** Portugal has no store listing. Same facts as the other landings, in European Portuguese. */
export const PT_STORE: StoreCopy = {
  name: "Invo",
  subtitle: "Orçamentos, faturas e cobrança",
  promo: "",
  opening: [],
  featuresHeading: "",
  bullets: [
    "Orçamentos, propostas e faturas num só lugar",
    "Itens com quantidade, unidade e custo unitário",
    "Margem, imposto, sinais e histórico de pagamentos",
    "Assinatura no dispositivo",
    "PDF com marca — logótipo, cor e seis modelos",
    "Pesquisa por título, cliente, local ou tipo de documento",
    "Relatórios: faturado, recebido, em aberto, vencido",
    "USD, EUR, GBP e TRY",
  ],
  scope: "Para remodelações, construção e trabalho de campo.",
  freeLine: "Comece com 3 orçamentos gratuitos.",
  plans: ["Semanal", "Mensal", "Anual", "Vitalício"],
  privacyLabel: PT_PRIVACY,
  termsLabel: PT_TERMS,
};

export function firstSentence(value: string): string {
  const cut = value.indexOf(". ");
  const sentence = cut === -1 ? value : value.slice(0, cut + 1);
  return sentence.replace(/:\s*$/, "");
}
