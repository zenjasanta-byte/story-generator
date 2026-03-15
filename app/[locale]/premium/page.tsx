"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getLegalTranslations, SUPPORT_EMAIL_PLACEHOLDER } from "@/lib/legalContent";
import { normalizeLanguageCode, type SupportedLanguage } from "@/lib/narrationVoices";
import { SITE_NAME } from "@/lib/siteConfig";

type PremiumPageTranslations = {
  badge: string;
  title: string;
  subtitle: string;
  introLine1: string;
  introLine2: string;
  backToStories: string;
  featuresLabel: string;
  featureTextTitle: string;
  featureTextText: string;
  featureImagesTitle: string;
  featureImagesText: string;
  featureAudioTitle: string;
  featureAudioText: string;
  featureExportsTitle: string;
  featureExportsText: string;
  featureUnlimitedTitle: string;
  featureUnlimitedText: string;
  featureAllPremiumTitle: string;
  featureAllPremiumText: string;
  compareTitle: string;
  compareFreeLabel: string;
  comparePremiumLabel: string;
  compareTextStories: string;
  compareStoryImages: string;
  compareAudioNarration: string;
  compareDownloads: string;
  compareAllFeatures: string;
  compareStoryCount: string;
  yes: string;
  no: string;
  textOnly: string;
  stories3: string;
  unlimited: string;
  monthlyPlan: string;
  yearlyPlan: string;
  monthlyPriceLine: string;
  yearlyPriceLine: string;
  bestValue: string;
  savePercent: string;
  recommendedTitle: string;
  freePlanTitle: string;
  freePlanDescription: string;
  planName: string;
  planDescription: string;
  upgradeButton: string;
  redirectingToCheckout: string;
  manageSubscriptionButton: string;
  openingPortal: string;
  manageSubscriptionNote: string;
  paymentNextStep: string;
  checkoutError: string;
  portalError: string;
};

const premiumPageTranslations: Record<SupportedLanguage, PremiumPageTranslations> = {
  ru: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Откройте все волшебные возможности",
    introLine1: "Бесплатный план подходит для знакомства: 3 истории и только текст.",
    introLine2: "Оплата проходит безопасно через Stripe Checkout, а активной подпиской можно управлять в Stripe Customer Portal.",
    backToStories: "Вернуться к историям",
    featuresLabel: "ЧТО ОТКРЫВАЕТ PREMIUM",
    featureTextTitle: "Неограниченные истории",
    featureTextText: "Создавайте столько историй, сколько нужно, без остановки после третьей.",
    featureImagesTitle: "Иллюстрации к историям",
    featureImagesText: "Премиум добавляет обложку и иллюстрации страниц, которых нет в бесплатном плане.",
    featureAudioTitle: "Скачать аудио",
    featureAudioText: "Слушайте полную озвучку истории и сохраняйте аудио для чтения перед сном.",
    featureExportsTitle: "PDF и ZIP экспорт",
    featureExportsText: "Скачивайте историю в PDF или весь комплект одним ZIP-архивом.",
    featureUnlimitedTitle: "Все платные функции",
    featureUnlimitedText: "Доступ ко всем улучшениям Premium без дополнительных ограничений.",
    featureAllPremiumTitle: "Лучшее семейное чтение",
    featureAllPremiumText: "Больше магии, больше удобства и полноценный формат для чтения, просмотра и прослушивания.",
    compareTitle: "СРАВНЕНИЕ ПЛАНОВ",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Текстовые истории",
    compareStoryImages: "Иллюстрации к историям",
    compareAudioNarration: "Аудио-озвучка",
    compareDownloads: "PDF / ZIP экспорт",
    compareAllFeatures: "Все Premium-возможности",
    compareStoryCount: "Количество историй",
    yes: "Да",
    no: "Нет",
    textOnly: "Только текст",
    stories3: "3 истории",
    unlimited: "Без лимита",
    monthlyPlan: "Ежемесячно",
    yearlyPlan: "Ежегодно",
    monthlyPriceLine: "$9 / месяц",
    yearlyPriceLine: "$59 / год",
    bestValue: "Лучшая цена",
    savePercent: "Экономия 40%",
    recommendedTitle: "RECOMMENDED PLAN",
    freePlanTitle: "Free",
    freePlanDescription: "Для быстрого старта: до 3 историй и только текст без дорогих дополнений.",
    planName: "Premium",
    planDescription: "Полный опыт: безлимитные истории, изображения, озвучка, PDF / ZIP и все Premium-функции.",
    upgradeButton: "Оформить Premium",
    redirectingToCheckout: "Переход к оплате...",
    manageSubscriptionButton: "Управлять подпиской",
    openingPortal: "Открываем кабинет подписки...",
    manageSubscriptionNote: "Изменяйте способ оплаты, управляйте подпиской или отменяйте её через Stripe Customer Portal.",
    paymentNextStep: "Оплата проходит через Stripe Checkout.",
    checkoutError: "Не удалось открыть Stripe Checkout. Попробуйте ещё раз.",
    portalError: "Не удалось открыть управление подпиской. Попробуйте ещё раз."
  },
  en: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Unlock all magical features",
    introLine1: "Free is great for trying the app: 3 stories and text only.",
    introLine2: "Checkout is handled securely with Stripe, and active subscriptions can be managed in the Stripe Customer Portal.",
    backToStories: "Back to stories",
    featuresLabel: "WHAT PREMIUM UNLOCKS",
    featureTextTitle: "Unlimited stories",
    featureTextText: "Generate as many stories as you want without stopping at the third one.",
    featureImagesTitle: "Story images",
    featureImagesText: "Premium adds a cover image and page illustrations that free users do not get.",
    featureAudioTitle: "Download audio",
    featureAudioText: "Listen to full narration and keep the audio for bedtime reading anytime.",
    featureExportsTitle: "PDF and ZIP exports",
    featureExportsText: "Download the story as a PDF or save the full bundle as a ZIP pack.",
    featureUnlimitedTitle: "All premium tools",
    featureUnlimitedText: "Unlock every Premium feature with no extra gates inside the app.",
    featureAllPremiumTitle: "The full experience",
    featureAllPremiumText: "More magic, more comfort, and a richer family reading experience across every format.",
    compareTitle: "PLAN COMPARISON",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Text stories",
    compareStoryImages: "Story images",
    compareAudioNarration: "Audio narration",
    compareDownloads: "PDF / ZIP exports",
    compareAllFeatures: "All premium features",
    compareStoryCount: "Story count",
    yes: "Yes",
    no: "No",
    textOnly: "Text only",
    stories3: "3 stories",
    unlimited: "Unlimited",
    monthlyPlan: "Monthly",
    yearlyPlan: "Yearly",
    monthlyPriceLine: "$9 / month",
    yearlyPriceLine: "$59 / year",
    bestValue: "Best value",
    savePercent: "Save 40%",
    recommendedTitle: "RECOMMENDED PLAN",
    freePlanTitle: "Free",
    freePlanDescription: "A simple starting point: up to 3 stories and text only, without the expensive extras.",
    planName: "Premium",
    planDescription: "The complete experience: unlimited stories, images, narration, PDF / ZIP, and every premium feature.",
    upgradeButton: "Upgrade to Premium",
    redirectingToCheckout: "Redirecting to checkout...",
    manageSubscriptionButton: "Manage Subscription",
    openingPortal: "Opening subscription portal...",
    manageSubscriptionNote: "Update payment details, manage your plan, or cancel anytime in the Stripe Customer Portal.",
    paymentNextStep: "Payments are handled with Stripe Checkout.",
    checkoutError: "Could not open Stripe Checkout. Please try again.",
    portalError: "Could not open subscription management. Please try again."
  },
  es: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Desbloquea todas las funciones mágicas",
    introLine1: "Free sirve para probar la app: 3 historias y solo texto.",
    introLine2: "El pago se gestiona con Stripe Checkout y las suscripciones activas se administran en Stripe Customer Portal.",
    backToStories: "Volver a las historias",
    featuresLabel: "LO QUE DESBLOQUEA PREMIUM",
    featureTextTitle: "Historias ilimitadas",
    featureTextText: "Genera todas las historias que quieras sin detenerte en la tercera.",
    featureImagesTitle: "Imagenes de la historia",
    featureImagesText: "Premium agrega portada e ilustraciones de paginas que no existen en el plan Free.",
    featureAudioTitle: "Descargar audio",
    featureAudioText: "Escucha la narracion completa y guarda el audio para leer antes de dormir.",
    featureExportsTitle: "Exportaciones PDF y ZIP",
    featureExportsText: "Descarga la historia en PDF o guarda el paquete completo en un ZIP.",
    featureUnlimitedTitle: "Todas las funciones premium",
    featureUnlimitedText: "Activa cada mejora Premium sin bloqueos extra dentro de la app.",
    featureAllPremiumTitle: "La experiencia completa",
    featureAllPremiumText: "Mas magia, mas comodidad y una experiencia familiar mas rica en todos los formatos.",
    compareTitle: "COMPARACION DE PLANES",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Historias de texto",
    compareStoryImages: "Imagenes de la historia",
    compareAudioNarration: "Narracion en audio",
    compareDownloads: "Exportaciones PDF / ZIP",
    compareAllFeatures: "Todas las funciones premium",
    compareStoryCount: "Cantidad de historias",
    yes: "Sí",
    no: "No",
    textOnly: "Solo texto",
    stories3: "3 historias",
    unlimited: "Ilimitado",
    monthlyPlan: "Mensual",
    yearlyPlan: "Anual",
    monthlyPriceLine: "$9 / mes",
    yearlyPriceLine: "$59 / ano",
    bestValue: "Mejor valor",
    savePercent: "Ahorra 40%",
    recommendedTitle: "PLAN RECOMENDADO",
    freePlanTitle: "Free",
    freePlanDescription: "Un inicio simple: hasta 3 historias y solo texto, sin extras costosos.",
    planName: "Premium",
    planDescription: "La experiencia completa: historias ilimitadas, imagenes, narracion, PDF / ZIP y todas las funciones premium.",
    upgradeButton: "Mejorar a Premium",
    redirectingToCheckout: "Redirigiendo al pago...",
    manageSubscriptionButton: "Gestionar suscripción",
    openingPortal: "Abriendo portal de suscripción...",
    manageSubscriptionNote: "Actualiza tu pago, gestiona el plan o cancélalo cuando quieras desde Stripe Customer Portal.",
    paymentNextStep: "El pago se realiza con Stripe Checkout.",
    checkoutError: "No se pudo abrir Stripe Checkout. Inténtalo de nuevo.",
    portalError: "No se pudo abrir la gestión de la suscripción. Inténtalo de nuevo."
  },
  de: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Schalte alle magischen Funktionen frei",
    introLine1: "Free ist ideal zum Ausprobieren: 3 Geschichten und nur Text.",
    introLine2: "Die Bezahlung läuft über Stripe Checkout und aktive Abos lassen sich im Stripe Customer Portal verwalten.",
    backToStories: "Zurück zu den Geschichten",
    featuresLabel: "WAS PREMIUM FREISCHALTET",
    featureTextTitle: "Unbegrenzte Geschichten",
    featureTextText: "Erstelle so viele Geschichten, wie du moechtest, ohne Stopp nach der dritten.",
    featureImagesTitle: "Geschichtenbilder",
    featureImagesText: "Premium fuegt Cover und Seitenillustrationen hinzu, die es im Free-Plan nicht gibt.",
    featureAudioTitle: "Audio herunterladen",
    featureAudioText: "Hoere die komplette Erzaehlung und speichere das Audio fuer spaeter.",
    featureExportsTitle: "PDF- und ZIP-Exporte",
    featureExportsText: "Lade die Geschichte als PDF oder das komplette Paket als ZIP herunter.",
    featureUnlimitedTitle: "Alle Premium-Funktionen",
    featureUnlimitedText: "Schalte jede Premium-Erweiterung ohne weitere Sperren in der App frei.",
    featureAllPremiumTitle: "Das volle Erlebnis",
    featureAllPremiumText: "Mehr Magie, mehr Komfort und ein vollstaendigeres Familienleseerlebnis in jedem Format.",
    compareTitle: "PLANVERGLEICH",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Textgeschichten",
    compareStoryImages: "Geschichtenbilder",
    compareAudioNarration: "Audio-Erzaehlung",
    compareDownloads: "PDF / ZIP-Exporte",
    compareAllFeatures: "Alle Premium-Funktionen",
    compareStoryCount: "Anzahl der Geschichten",
    yes: "Ja",
    no: "Nein",
    textOnly: "Nur Text",
    stories3: "3 Geschichten",
    unlimited: "Unbegrenzt",
    monthlyPlan: "Monatlich",
    yearlyPlan: "Jaehrlich",
    monthlyPriceLine: "$9 / Monat",
    yearlyPriceLine: "$59 / Jahr",
    bestValue: "Bestes Angebot",
    savePercent: "40% sparen",
    recommendedTitle: "EMPFOHLENER PLAN",
    freePlanTitle: "Free",
    freePlanDescription: "Ein einfacher Start: bis zu 3 Geschichten und nur Text, ohne teure Extras.",
    planName: "Premium",
    planDescription: "Das komplette Erlebnis: unbegrenzte Geschichten, Bilder, Erzaehlung, PDF / ZIP und alle Premium-Funktionen.",
    upgradeButton: "Zu Premium wechseln",
    redirectingToCheckout: "Weiterleitung zum Checkout...",
    manageSubscriptionButton: "Abo verwalten",
    openingPortal: "Abo-Portal wird geöffnet...",
    manageSubscriptionNote: "Aktualisiere Zahlungsdaten, verwalte dein Abo oder kündige jederzeit im Stripe Customer Portal.",
    paymentNextStep: "Die Zahlung läuft über Stripe Checkout.",
    checkoutError: "Stripe Checkout konnte nicht geöffnet werden. Bitte versuche es erneut.",
    portalError: "Die Abo-Verwaltung konnte nicht geöffnet werden. Bitte versuche es erneut."
  },
  fr: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Débloquez toutes les fonctionnalités magiques",
    introLine1: "Free est ideal pour essayer l'app : 3 histoires et texte uniquement.",
    introLine2: "Le paiement passe par Stripe Checkout et les abonnements actifs se gèrent dans le Stripe Customer Portal.",
    backToStories: "Retour aux histoires",
    featuresLabel: "CE QUE PREMIUM DEBLOQUE",
    featureTextTitle: "Histoires illimitees",
    featureTextText: "Genere autant d'histoires que tu veux sans t'arreter a la troisieme.",
    featureImagesTitle: "Images de l'histoire",
    featureImagesText: "Premium ajoute une couverture et des illustrations de pages absentes du plan Free.",
    featureAudioTitle: "Télécharger l’audio",
    featureAudioText: "Ecoute la narration complete et garde l'audio pour le rituel du soir.",
    featureExportsTitle: "Exports PDF et ZIP",
    featureExportsText: "Telecharge l'histoire en PDF ou tout le pack dans une archive ZIP.",
    featureUnlimitedTitle: "Toutes les fonctions premium",
    featureUnlimitedText: "Active chaque avantage Premium sans autre blocage dans l'app.",
    featureAllPremiumTitle: "L'experience complete",
    featureAllPremiumText: "Plus de magie, plus de confort et une experience familiale plus riche dans tous les formats.",
    compareTitle: "COMPARAISON DES OFFRES",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Histoires texte",
    compareStoryImages: "Images de l'histoire",
    compareAudioNarration: "Narration audio",
    compareDownloads: "Exports PDF / ZIP",
    compareAllFeatures: "Toutes les fonctions premium",
    compareStoryCount: "Nombre d’histoires",
    yes: "Oui",
    no: "Non",
    textOnly: "Texte uniquement",
    stories3: "3 histoires",
    unlimited: "Illimité",
    monthlyPlan: "Mensuel",
    yearlyPlan: "Annuel",
    monthlyPriceLine: "$9 / mois",
    yearlyPriceLine: "$59 / an",
    bestValue: "Meilleure valeur",
    savePercent: "Economise 40%",
    recommendedTitle: "OFFRE RECOMMANDÉE",
    freePlanTitle: "Free",
    freePlanDescription: "Un point de depart simple : jusqu'a 3 histoires et texte uniquement, sans extras couteux.",
    planName: "Premium",
    planDescription: "L'experience complete : histoires illimitees, images, narration, PDF / ZIP et toutes les fonctions premium.",
    upgradeButton: "Passer à Premium",
    redirectingToCheckout: "Redirection vers le paiement...",
    manageSubscriptionButton: "Gérer l'abonnement",
    openingPortal: "Ouverture du portail d'abonnement...",
    manageSubscriptionNote: "Mettez à jour votre paiement, gérez votre offre ou résiliez à tout moment dans le Stripe Customer Portal.",
    paymentNextStep: "Le paiement passe par Stripe Checkout.",
    checkoutError: "Impossible d’ouvrir Stripe Checkout. Veuillez réessayer.",
    portalError: "Impossible d’ouvrir la gestion de l’abonnement. Veuillez réessayer."
  },
  it: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Sblocca tutte le funzioni magiche",
    introLine1: "Free e perfetto per provare l'app: 3 storie e solo testo.",
    introLine2: "Il pagamento passa tramite Stripe Checkout e gli abbonamenti attivi si gestiscono nello Stripe Customer Portal.",
    backToStories: "Torna alle storie",
    featuresLabel: "COSA SBLOCCA PREMIUM",
    featureTextTitle: "Storie illimitate",
    featureTextText: "Genera tutte le storie che vuoi senza fermarti alla terza.",
    featureImagesTitle: "Immagini della storia",
    featureImagesText: "Premium aggiunge copertina e illustrazioni delle pagine che il piano Free non include.",
    featureAudioTitle: "Scarica audio",
    featureAudioText: "Ascolta la narrazione completa e conserva l'audio per i momenti della buonanotte.",
    featureExportsTitle: "Esportazioni PDF e ZIP",
    featureExportsText: "Scarica la storia in PDF o salva tutto il pacchetto in un archivio ZIP.",
    featureUnlimitedTitle: "Tutte le funzioni premium",
    featureUnlimitedText: "Sblocca ogni vantaggio Premium senza altri limiti dentro l'app.",
    featureAllPremiumTitle: "L'esperienza completa",
    featureAllPremiumText: "Piu magia, piu comodita e un'esperienza di lettura familiare piu ricca in ogni formato.",
    compareTitle: "CONFRONTO TRA PIANI",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Storie testuali",
    compareStoryImages: "Immagini della storia",
    compareAudioNarration: "Narrazione audio",
    compareDownloads: "Esportazioni PDF / ZIP",
    compareAllFeatures: "Tutte le funzioni premium",
    compareStoryCount: "Numero di storie",
    yes: "Sì",
    no: "No",
    textOnly: "Solo testo",
    stories3: "3 storie",
    unlimited: "Illimitato",
    monthlyPlan: "Mensile",
    yearlyPlan: "Annuale",
    monthlyPriceLine: "$9 / mese",
    yearlyPriceLine: "$59 / anno",
    bestValue: "Miglior valore",
    savePercent: "Risparmia 40%",
    recommendedTitle: "PIANO CONSIGLIATO",
    freePlanTitle: "Free",
    freePlanDescription: "Un inizio semplice: fino a 3 storie e solo testo, senza extra costosi.",
    planName: "Premium",
    planDescription: "L'esperienza completa: storie illimitate, immagini, narrazione, PDF / ZIP e tutte le funzioni premium.",
    upgradeButton: "Passa a Premium",
    redirectingToCheckout: "Reindirizzamento al pagamento...",
    manageSubscriptionButton: "Gestisci abbonamento",
    openingPortal: "Apertura del portale abbonamento...",
    manageSubscriptionNote: "Aggiorna il pagamento, gestisci il piano o annulla quando vuoi nel portale clienti Stripe.",
    paymentNextStep: "Il pagamento passa tramite Stripe Checkout.",
    checkoutError: "Impossibile aprire Stripe Checkout. Riprova.",
    portalError: "Impossibile aprire la gestione dell'abbonamento. Riprova."
  },
  pt: {
    badge: "Premium",
    title: "Premium",
    subtitle: "Desbloqueie todos os recursos mágicos",
    introLine1: "Free e ideal para experimentar: 3 historias e apenas texto.",
    introLine2: "O pagamento passa pelo Stripe Checkout e assinaturas ativas podem ser geridas no Stripe Customer Portal.",
    backToStories: "Voltar às histórias",
    featuresLabel: "O QUE O PREMIUM DESBLOQUEIA",
    featureTextTitle: "Historias ilimitadas",
    featureTextText: "Gera quantas historias quiseres sem parar na terceira.",
    featureImagesTitle: "Imagens da historia",
    featureImagesText: "O Premium adiciona capa e ilustracoes de paginas que o plano Free nao inclui.",
    featureAudioTitle: "Baixar áudio",
    featureAudioText: "Ouve a narracao completa e guarda o audio para a leitura da noite.",
    featureExportsTitle: "Exportacoes PDF e ZIP",
    featureExportsText: "Baixa a historia em PDF ou guarda o pacote completo num ZIP.",
    featureUnlimitedTitle: "Todos os recursos premium",
    featureUnlimitedText: "Ativa todas as melhorias Premium sem novos bloqueios dentro da app.",
    featureAllPremiumTitle: "A experiencia completa",
    featureAllPremiumText: "Mais magia, mais conforto e uma experiencia familiar mais rica em todos os formatos.",
    compareTitle: "COMPARACAO DE PLANOS",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "Historias em texto",
    compareStoryImages: "Imagens da historia",
    compareAudioNarration: "Narracao em audio",
    compareDownloads: "Exportacoes PDF / ZIP",
    compareAllFeatures: "Todos os recursos premium",
    compareStoryCount: "Quantidade de histórias",
    yes: "Sim",
    no: "Não",
    textOnly: "Apenas texto",
    stories3: "3 historias",
    unlimited: "Ilimitado",
    monthlyPlan: "Mensal",
    yearlyPlan: "Anual",
    monthlyPriceLine: "$9 / mes",
    yearlyPriceLine: "$59 / ano",
    bestValue: "Melhor valor",
    savePercent: "Poupa 40%",
    recommendedTitle: "PLANO RECOMENDADO",
    freePlanTitle: "Free",
    freePlanDescription: "Um ponto de partida simples: ate 3 historias e apenas texto, sem extras caros.",
    planName: "Premium",
    planDescription: "A experiencia completa: historias ilimitadas, imagens, narracao, PDF / ZIP e todos os recursos premium.",
    upgradeButton: "Fazer upgrade para Premium",
    redirectingToCheckout: "Redirecionando para o pagamento...",
    manageSubscriptionButton: "Gerir assinatura",
    openingPortal: "Abrindo portal da assinatura...",
    manageSubscriptionNote: "Atualize o pagamento, gerencie o plano ou cancele quando quiser no Stripe Customer Portal.",
    paymentNextStep: "O pagamento é feito com Stripe Checkout.",
    checkoutError: "Não foi possível abrir o Stripe Checkout. Tente novamente.",
    portalError: "Não foi possível abrir a gestão da assinatura. Tente novamente."
  },
  zh: {
    badge: "Premium",
    title: "Premium",
    subtitle: "解锁所有神奇功能",
    introLine1: "Free 适合先体验：3 个故事，且只有文字。",
    introLine2: "支付通过 Stripe Checkout 安全完成，已开通的订阅可在 Stripe Customer Portal 中管理。",
    backToStories: "返回故事",
    featuresLabel: "PREMIUM 解锁内容",
    featureTextTitle: "无限故事",
    featureTextText: "想生成多少故事都可以，不会在第三个故事后停止。",
    featureImagesTitle: "故事图片",
    featureImagesText: "Premium 会加入封面和分页插图，Free 计划不包含这些内容。",
    featureAudioTitle: "下载音频",
    featureAudioText: "收听完整旁白，并把音频保存下来用于睡前陪读。",
    featureExportsTitle: "PDF 和 ZIP 导出",
    featureExportsText: "可将故事下载为 PDF，或将完整内容打包成 ZIP。",
    featureUnlimitedTitle: "全部高级功能",
    featureUnlimitedText: "一次解锁所有 Premium 功能，不再遇到额外限制。",
    featureAllPremiumTitle: "完整体验",
    featureAllPremiumText: "更多魔法、更多便利，以及覆盖阅读、观看和收听的完整家庭体验。",
    compareTitle: "方案对比",
    compareFreeLabel: "Free",
    comparePremiumLabel: "Premium",
    compareTextStories: "文字故事",
    compareStoryImages: "故事图片",
    compareAudioNarration: "音频旁白",
    compareDownloads: "PDF / ZIP 导出",
    compareAllFeatures: "全部高级功能",
    compareStoryCount: "故事数量",
    yes: "是",
    no: "否",
    textOnly: "仅文字",
    stories3: "3 个故事",
    unlimited: "无限",
    monthlyPlan: "月付",
    yearlyPlan: "年付",
    monthlyPriceLine: "$9 / 月",
    yearlyPriceLine: "$59 / 年",
    bestValue: "最佳选择",
    savePercent: "立省 40%",
    recommendedTitle: "推荐方案",
    freePlanTitle: "Free",
    freePlanDescription: "适合先试用：最多 3 个故事，且只有文字，不包含高成本附加内容。",
    planName: "Premium",
    planDescription: "完整体验：无限故事、图片、旁白、PDF / ZIP，以及全部 Premium 功能。",
    upgradeButton: "升级到 Premium",
    redirectingToCheckout: "正在跳转到支付...",
    manageSubscriptionButton: "管理订阅",
    openingPortal: "正在打开订阅中心...",
    manageSubscriptionNote: "你可以在 Stripe Customer Portal 中更新支付方式、管理套餐或随时取消订阅。",
    paymentNextStep: "支付通过 Stripe Checkout 完成。",
    checkoutError: "无法打开 Stripe Checkout，请重试。",
    portalError: "无法打开订阅管理，请重试。"
  }
};

export default function PremiumPage() {
  const params = useParams<{ locale: string }>();
  const currentLocale = String(params.locale || "en");
  const currentLanguageCode = useMemo(() => normalizeLanguageCode(currentLocale), [currentLocale]);
  const tPremium = useMemo(() => premiumPageTranslations[currentLanguageCode] || premiumPageTranslations.en, [currentLanguageCode]);
  const legalFooter = useMemo(() => getLegalTranslations(currentLanguageCode).footer, [currentLanguageCode]);
  const [plan, setPlan] = useState<"month" | "year">("month");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const premiumFeatures = useMemo(
    () => [
      { title: tPremium.featureTextTitle, text: tPremium.featureTextText },
      { title: tPremium.featureImagesTitle, text: tPremium.featureImagesText },
      { title: tPremium.featureAudioTitle, text: tPremium.featureAudioText },
      { title: tPremium.featureExportsTitle, text: tPremium.featureExportsText },
      { title: tPremium.featureUnlimitedTitle, text: tPremium.featureUnlimitedText },
      { title: tPremium.featureAllPremiumTitle, text: tPremium.featureAllPremiumText }
    ],
    [tPremium]
  );

  const comparisonRows = useMemo(
    () => [
      { label: tPremium.compareTextStories, free: tPremium.textOnly, premium: tPremium.yes },
      { label: tPremium.compareStoryImages, free: tPremium.no, premium: tPremium.yes },
      { label: tPremium.compareAudioNarration, free: tPremium.no, premium: tPremium.yes },
      { label: tPremium.compareDownloads, free: tPremium.no, premium: tPremium.yes },
      { label: tPremium.compareAllFeatures, free: tPremium.no, premium: tPremium.yes },
      { label: tPremium.compareStoryCount, free: tPremium.stories3, premium: tPremium.unlimited }
    ],
    [tPremium]
  );

  const storiesHref = useMemo(() => `/${currentLocale}`, [currentLocale]);

  useEffect(() => {
    let cancelled = false;

    async function loadPremiumStatus() {
      try {
        const response = await fetch("/api/premium/status", { cache: "no-store" });
        const payload = await response.json();
        if (!cancelled) {
          setIsPremium(Boolean(payload?.isPremium));
        }
      } catch {
        if (!cancelled) {
          setIsPremium(false);
        }
      }
    }

    void loadPremiumStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpgrade() {
    if (checkoutLoading) return;

    setCheckoutLoading(true);
    setCheckoutError(null);
    setPortalError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: currentLocale, plan })
      });

      const payload = await response.json();
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || tPremium.checkoutError);
      }

      window.location.href = payload.url;
    } catch (error: unknown) {
      setCheckoutError(error instanceof Error ? error.message : tPremium.checkoutError);
      setCheckoutLoading(false);
    }
  }

  async function handleOpenPortal() {
    if (portalLoading) return;

    setPortalLoading(true);
    setPortalError(null);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: currentLocale })
      });

      const payload = await response.json();
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || tPremium.portalError);
      }

      window.location.href = payload.url;
    } catch (error: unknown) {
      setPortalError(error instanceof Error ? error.message : tPremium.portalError);
      setPortalLoading(false);
    }
  }

  return (
    <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb left-[4%] top-[6%]" />
        <div className="hero-orb hero-orb-alt right-[6%] top-[12%]" />
        <span className="fairy-sparkle left-[18%] top-[18%]" />
        <span className="fairy-sparkle right-[20%] top-[24%]" style={{ animationDelay: "0.7s" }} />
        <span className="fairy-sparkle left-[28%] top-[42%]" style={{ animationDelay: "1.3s" }} />
      </div>

      <header className="glass-card animate-fade-up overflow-hidden rounded-[32px] border border-white/50 bg-gradient-to-br from-[#fff7ec]/95 via-[#fff1fb]/95 to-[#eef6ff]/92 p-8 shadow-[0_24px_56px_rgba(117,84,164,0.2)] sm:p-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#ffd9b8] bg-[#fff8ef] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9b5d2d]">
          {tPremium.badge}
          <span>✦</span>
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-[#38234b] sm:text-5xl">{tPremium.title}</h1>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#8d618c]">{SITE_NAME}</p>
        <p className="mt-3 text-lg font-medium text-[#5f4d73]">{tPremium.subtitle}</p>
        <p className="mt-4 max-w-3xl text-base leading-7 text-[#6a5a7f]">
          {tPremium.introLine1} {tPremium.introLine2}
        </p>
        {!isPremium ? (
          <div className="mt-6 rounded-[24px] border border-[#ead9f7] bg-white/75 p-4 shadow-[0_10px_24px_rgba(129,94,174,0.08)]">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPlan("month")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${plan === "month" ? "border-[#c9a7ff] bg-gradient-to-br from-[#fff3f6] to-[#eef4ff] shadow-[0_10px_22px_rgba(140,108,196,0.16)]" : "border-[#ead9f7] bg-white/80 hover:bg-white"}`}
              >
                <p className="text-sm font-bold text-[#4a325f]">{tPremium.monthlyPlan}</p>
                <p className="mt-1 text-sm text-[#6e5a82]">{tPremium.monthlyPriceLine}</p>
              </button>
              <button
                type="button"
                onClick={() => setPlan("year")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${plan === "year" ? "border-[#c9a7ff] bg-gradient-to-br from-[#fff1ea] to-[#eef4ff] shadow-[0_10px_22px_rgba(140,108,196,0.16)]" : "border-[#ead9f7] bg-white/80 hover:bg-white"}`}
              >
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#4a325f]">{tPremium.yearlyPlan}</p>
                  <span className="rounded-full bg-[#fff0d9] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#a7642d]">{tPremium.savePercent}</span>
                </div>
                <p className="mt-1 text-sm text-[#6e5a82]">{tPremium.yearlyPriceLine} - {tPremium.bestValue}</p>
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={storiesHref} className="storybook-button storybook-button-soft px-5 py-3 text-sm">
            {tPremium.backToStories}
          </Link>
          {!isPremium ? (
            <button type="button" onClick={() => void handleUpgrade()} disabled={checkoutLoading} className="storybook-button storybook-button-primary px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70">
              {checkoutLoading ? tPremium.redirectingToCheckout : tPremium.upgradeButton}
            </button>
          ) : (
            <button type="button" onClick={() => void handleOpenPortal()} disabled={portalLoading} className="storybook-button rounded-full border border-[#d7c6f7] bg-white/80 px-6 py-3 text-sm font-semibold text-[#69478b] shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
              {portalLoading ? tPremium.openingPortal : tPremium.manageSubscriptionButton}
            </button>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#6a5a7f]">
          <Link href={`/${currentLocale}/support`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
            {legalFooter.support}
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL_PLACEHOLDER}`} className="font-semibold text-[#7a3f6e] transition hover:text-[#4f2750]">
            {SUPPORT_EMAIL_PLACEHOLDER}
          </a>
        </div>
        {isPremium ? <p className="mt-4 text-sm text-[#6a5a7f]">{tPremium.manageSubscriptionNote}</p> : null}
        {checkoutError ? <p className="mt-4 text-sm font-semibold text-[#9f4967]">{checkoutError}</p> : null}
        {portalError ? <p className="mt-2 text-sm font-semibold text-[#9f4967]">{portalError}</p> : null}
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {premiumFeatures.map((feature) => (
          <article key={feature.title} className="glass-card rounded-[24px] border border-[#f1d4ba] bg-gradient-to-br from-[#fffaf2] via-[#fff3fb] to-[#f3f7ff] p-5 shadow-[0_14px_32px_rgba(132,96,177,0.14)]">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a5f2f]">{tPremium.featuresLabel}</p>
            <h2 className="mt-3 text-xl font-bold text-[#3c2952]">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#6b5a80]">{feature.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="glass-card rounded-[28px] border border-[#ecd3b9] bg-gradient-to-br from-[#fffaf4] to-[#f7f0ff] p-6 shadow-[0_18px_38px_rgba(118,82,157,0.16)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8f5a2e]">{tPremium.compareTitle}</p>
          <div className="mt-5 grid grid-cols-[1.4fr,0.6fr,0.6fr] items-center gap-3 px-1 text-xs font-bold uppercase tracking-[0.14em] text-[#8a6fa3]">
            <p />
            <p className="text-center">{tPremium.compareFreeLabel}</p>
            <p className="text-center">{tPremium.comparePremiumLabel}</p>
          </div>
          <div className="mt-3 space-y-3">
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.4fr,0.6fr,0.6fr] items-center gap-3 rounded-2xl border border-[#f1decc] bg-white/70 px-4 py-3 text-sm">
                <p className="font-semibold text-[#4b365f]">{row.label}</p>
                <p className="text-center font-medium text-[#8a6a47]">{row.free}</p>
                <p className="text-center font-bold text-[#8a53c6]">{row.premium}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="glass-card rounded-[28px] border border-[#e6c4ff] bg-gradient-to-br from-[#fff6f1] via-[#fff1fb] to-[#edf3ff] p-6 shadow-[0_18px_38px_rgba(138,102,188,0.2)]">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b57a7]">{tPremium.recommendedTitle}</p>
          <div className="mt-4 rounded-[24px] border border-[#f1decc] bg-white/75 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#3b2551]">{tPremium.freePlanTitle}</h2>
              <span className="rounded-full border border-[#e9d8bf] bg-[#fff8ef] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a5f2f]">
                {tPremium.compareFreeLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#695a7f]">{tPremium.freePlanDescription}</p>
          </div>
          <div className="mt-4 rounded-[24px] border border-[#edccff] bg-white/80 p-5 shadow-[0_12px_24px_rgba(136,96,184,0.14)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-[#3b2551]">{tPremium.planName}</h2>
              <span className="rounded-full bg-gradient-to-r from-[#fff0d9] to-[#ffe6bf] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#a7642d]">
                {tPremium.bestValue}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#695a7f]">{tPremium.planDescription}</p>
            {!isPremium ? (
              <button type="button" onClick={() => void handleUpgrade()} disabled={checkoutLoading} className="storybook-button storybook-button-primary mt-5 w-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70">
                {checkoutLoading ? tPremium.redirectingToCheckout : tPremium.upgradeButton}
              </button>
            ) : (
              <button type="button" onClick={() => void handleOpenPortal()} disabled={portalLoading} className="storybook-button mt-5 w-full rounded-full border border-[#d7c6f7] bg-white/80 px-6 py-3 text-sm font-semibold text-[#69478b] shadow-[0_10px_22px_rgba(118,82,157,0.14)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70">
                {portalLoading ? tPremium.openingPortal : tPremium.manageSubscriptionButton}
              </button>
            )}
            <p className="mt-3 text-xs font-medium text-[#8a6fa3]">{isPremium ? tPremium.manageSubscriptionNote : tPremium.paymentNextStep}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
