export type UiLanguage = "en" | "ru" | "es" | "de" | "fr" | "it" | "pt" | "zh";

type FormTranslations = {
  quickPresets: string;
  presetBedtime: string;
  presetFriendship: string;
  presetEducational: string;
  labels: {
    childName: string;
    age: string;
    gender: string;
    mainCharacter: string;
    theme: string;
    language: string;
    length: string;
    style: string;
  };
  placeholders: {
    childName: string;
    gender: string;
    mainCharacter: string;
    theme: string;
  };
  helperLanguage: string;
  buttons: {
    generate: string;
    generating: string;
    sampleData: string;
  };
  lengthOptions: {
    short: string;
    medium: string;
    long: string;
  };
  styleOptions: {
    bedtime: string;
    educational: string;
    adventure: string;
    friendship: string;
  };
  languageNames: Record<string, string>;
};

type HomeTranslations = {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  historyButton: string;
  metrics: {
    safeTitle: string;
    safeValue: string;
    safeSubtitle: string;
    langTitle: string;
    langValue: string;
    langSubtitle: string;
    saveTitle: string;
    saveValue: string;
    saveSubtitle: string;
  };
  loadingTitle: string;
  loadingSubtitle: string;
  errors: {
    generateFailed: string;
    serviceBusy: string;
    copyFailed: string;
    pdfFailed: string;
    freeLimitReached: string;
    premiumRequired: string;
    dailyLimitReached: string;
    rateLimitExceeded: string;
    verificationRequired: string;
    verificationFailed: string;
    unexpected: string;
  };
  subscription: {
    manageButton: string;
    opening: string;
    activeDescription: string;
    portalFailed: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    freeLabel: string;
    premiumLabel: string;
    freeStories: string;
    freeTextOnly: string;
    premiumUnlimited: string;
    premiumImages: string;
    premiumAudio: string;
    premiumExports: string;
    startPremium: string;
  };
};

type EmptyStateTranslations = {
  title: string;
  subtitle: string;
};

type ReaderTranslations = {
  headerLabel: string;
  coverFallback: string;
  coverSubtitle: string;
  coverForPrefix: string;
  startReading: string;
  pageOf: string;
  illustrationsReady: string;
  pageLabel: string;
  illustrationUnavailable: string;
  previous: string;
  next: string;
  backToCover: string;
  moralLabel: string;
  copyStory: string;
  copied: string;
  downloadTxt: string;
  downloadPdf: string;
  generateAnother: string;
  listenToStory: string;
  listenToFullStory: string;
  generatingAudio: string;
  generatingFullStoryAudio: string;
  playAudio: string;
  pauseAudio: string;
  restartAudio: string;
  audioReady: string;
  audioFailed: string;
  listenToThisPage: string;
  generatingThisPageAudio: string;
  thisPageReady: string;
  thisPageFailed: string;
  narrationFastHint: string;
  narrationFullHint: string;
  premiumOnlyFeature: string;
  upgradeToPremium: string;
};

export type UiTranslations = {
  form: FormTranslations;
  home: HomeTranslations;
  emptyState: EmptyStateTranslations;
  reader: ReaderTranslations;
};

const en: UiTranslations = {
  form: {
    quickPresets: "Quick Story Sparks",
    presetBedtime: "Bedtime story",
    presetFriendship: "Friendship story",
    presetEducational: "Educational story",
    labels: {
      childName: "Child name",
      age: "Age",
      gender: "Gender (optional)",
      mainCharacter: "Main character",
      theme: "Story theme",
      language: "Language",
      length: "Story length",
      style: "Style"
    },
    placeholders: {
      childName: "Enter name",
      gender: "Optional",
      mainCharacter: "e.g. moon fox",
      theme: "e.g. kindness"
    },
    helperLanguage: "Form language follows your selected story language.",
    buttons: {
      generate: "Generate Story",
      generating: "Generating...",
      sampleData: "Use sample data"
    },
    lengthOptions: {
      short: "Short",
      medium: "Medium",
      long: "Long"
    },
    styleOptions: {
      bedtime: "Bedtime",
      educational: "Educational",
      adventure: "Adventure",
      friendship: "Friendship"
    },
    languageNames: {
      English: "English",
      Russian: "Russian",
      Spanish: "Spanish",
      German: "German",
      French: "French",
      Italian: "Italian",
      Portuguese: "Portuguese",
      Chinese: "Chinese"
    }
  },
  home: {
    badge: "Moonlit Story Atelier",
    heroTitle: "Open a Magical Picture Book Made Just for Your Child",
    heroSubtitle: "Share a few details and watch a warm, whimsical bedtime adventure bloom into pages your family can read tonight.",
    historyButton: "Enchanted Story History",
    metrics: {
      safeTitle: "Gentle storytelling",
      safeValue: "Kind and child-safe",
      safeSubtitle: "Cozy scenes, no dark themes",
      langTitle: "World languages",
      langValue: "8 language UI",
      langSubtitle: "Story language drives the interface",
      saveTitle: "Family memory shelf",
      saveValue: "Last 10 books",
      saveSubtitle: "Saved safely on this device"
    },
    loadingTitle: "Sprinkling stardust across your new picture book...",
    loadingSubtitle: "Your cover and pages are arriving in a few moments.",
    errors: {
      generateFailed: "Failed to generate story",
      serviceBusy: "The story generator is temporarily busy. Please try again in a moment.",
      copyFailed: "Copy failed. Please copy manually.",
      pdfFailed: "PDF export failed. Please try again.",
      freeLimitReached: "Free story limit reached",
      premiumRequired: "Premium subscription required",
      dailyLimitReached: "You have reached today's story limit. Please try again tomorrow.",
      rateLimitExceeded: "Too many requests. Please try again in a few minutes.",
      verificationRequired: "Please complete the verification before generating a story.",
      verificationFailed: "We could not verify the request. Please try the verification again.",
      unexpected: "Unexpected error"
    },
    subscription: {
      manageButton: "Manage Subscription",
      opening: "Opening...",
      activeDescription: "Premium is active. Manage billing or cancel anytime in Stripe.",
      portalFailed: "Could not open subscription management. Please try again."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "See exactly what changes when you upgrade.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 stories",
      freeTextOnly: "Text only",
      premiumUnlimited: "Unlimited stories",
      premiumImages: "Story images",
      premiumAudio: "Audio narration",
      premiumExports: "PDF / ZIP downloads",
      startPremium: "Start Premium"
    }
  },
  emptyState: {
    title: "Your magical book is waiting",
    subtitle: "Share a few details about your little reader and we will open a warm, whimsical picture book made just for tonight."
  },
  reader: {
    headerLabel: "Tonight's Enchanted Book",
    coverFallback: "The cover painting is still shy, but the story is ready to open.",
    coverSubtitle: "A personalized picture book",
    coverForPrefix: "Made for",
    startReading: "Start Reading",
    pageOf: "Page {current} of {total}",
    illustrationsReady: "{ready}/{total} illustrations glowing",
    pageLabel: "Page",
    illustrationUnavailable: "This page has no illustration yet.",
    previous: "Previous",
    next: "Next",
    backToCover: "Back to Cover",
    moralLabel: "Gentle Moral",
    copyStory: "Copy Story",
    copied: "Copied",
    downloadTxt: "Download as TXT",
    downloadPdf: "Download Story Book (PDF)",
    generateAnother: "Generate Another Story",
    listenToStory: "Listen to Story",
    listenToFullStory: "Listen to Full Story",
    generatingAudio: "Preparing bedtime narration...",
    generatingFullStoryAudio: "Preparing full-story narration...",
    playAudio: "Play",
    pauseAudio: "Pause",
    restartAudio: "Restart",
    audioReady: "Narration is ready",
    audioFailed: "Audio narration is unavailable right now.",
    listenToThisPage: "Listen to This Page",
    generatingThisPageAudio: "Preparing page narration...",
    thisPageReady: "Page narration is ready",
    thisPageFailed: "Page narration is unavailable right now.",
    narrationFastHint: "Quick magical read-aloud for this page.",
    narrationFullHint: "Full bedtime narration for the entire book.",
    premiumOnlyFeature: "This feature is available only on Premium.",
    upgradeToPremium: "Upgrade to Premium"
  }
};

const ru: UiTranslations = {
  form: {
    quickPresets: "\u0411\u044b\u0441\u0442\u0440\u044b\u0435 \u0438\u0434\u0435\u0438",
    presetBedtime: "\u0421\u043a\u0430\u0437\u043a\u0430 \u043d\u0430 \u043d\u043e\u0447\u044c",
    presetFriendship: "\u0421\u043a\u0430\u0437\u043a\u0430 \u043e \u0434\u0440\u0443\u0436\u0431\u0435",
    presetEducational: "\u041f\u043e\u0437\u043d\u0430\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u0441\u043a\u0430\u0437\u043a\u0430",
    labels: {
      childName: "\u0418\u043c\u044f \u0440\u0435\u0431\u0435\u043d\u043a\u0430",
      age: "\u0412\u043e\u0437\u0440\u0430\u0441\u0442",
      gender: "\u041f\u043e\u043b (\u043d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e)",
      mainCharacter: "\u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0433\u0435\u0440\u043e\u0439",
      theme: "\u0422\u0435\u043c\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u0438",
      language: "\u042f\u0437\u044b\u043a",
      length: "\u0414\u043b\u0438\u043d\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u0438",
      style: "\u0421\u0442\u0438\u043b\u044c"
    },
    placeholders: {
      childName: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f",
      gender: "\u041d\u0435\u043e\u0431\u044f\u0437\u0430\u0442\u0435\u043b\u044c\u043d\u043e",
      mainCharacter: "\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u043b\u0443\u043d\u043d\u044b\u0439 \u043b\u0438\u0441\u0435\u043d\u043e\u043a",
      theme: "\u043d\u0430\u043f\u0440\u0438\u043c\u0435\u0440, \u0434\u043e\u0431\u0440\u043e\u0442\u0430"
    },
    helperLanguage: "\u042f\u0437\u044b\u043a \u0444\u043e\u0440\u043c\u044b \u043f\u043e\u0434\u0441\u0442\u0440\u0430\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043f\u043e\u0434 \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0439 \u044f\u0437\u044b\u043a \u0438\u0441\u0442\u043e\u0440\u0438\u0438.",
    buttons: {
      generate: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
      generating: "\u0421\u043e\u0437\u0434\u0430\u0451\u043c...",
      sampleData: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438\u0442\u044c \u043f\u0440\u0438\u043c\u0435\u0440\u043e\u043c"
    },
    lengthOptions: {
      short: "\u041a\u043e\u0440\u043e\u0442\u043a\u0430\u044f",
      medium: "\u0421\u0440\u0435\u0434\u043d\u044f\u044f",
      long: "\u0414\u043b\u0438\u043d\u043d\u0430\u044f"
    },
    styleOptions: {
      bedtime: "\u041f\u0435\u0440\u0435\u0434 \u0441\u043d\u043e\u043c",
      educational: "\u041f\u043e\u0437\u043d\u0430\u0432\u0430\u0442\u0435\u043b\u044c\u043d\u0430\u044f",
      adventure: "\u041f\u0440\u0438\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435",
      friendship: "\u0414\u0440\u0443\u0436\u0431\u0430"
    },
    languageNames: {
      English: "\u0410\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u0438\u0439",
      Russian: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
      Spanish: "\u0418\u0441\u043f\u0430\u043d\u0441\u043a\u0438\u0439",
      German: "\u041d\u0435\u043c\u0435\u0446\u043a\u0438\u0439",
      French: "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0438\u0439",
      Italian: "\u0418\u0442\u0430\u043b\u044c\u044f\u043d\u0441\u043a\u0438\u0439",
      Portuguese: "\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u044c\u0441\u043a\u0438\u0439",
      Chinese: "\u041a\u0438\u0442\u0430\u0439\u0441\u043a\u0438\u0439"
    }
  },
  home: {
    badge: "\u041b\u0443\u043d\u043d\u0430\u044f \u043c\u0430\u0441\u0442\u0435\u0440\u0441\u043a\u0430\u044f \u0441\u043a\u0430\u0437\u043e\u043a",
    heroTitle: "\u041e\u0442\u043a\u0440\u043e\u0439\u0442\u0435 \u0432\u043e\u043b\u0448\u0435\u0431\u043d\u0443\u044e \u043a\u043d\u0438\u0433\u0443, \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u0443\u044e \u0438\u043c\u0435\u043d\u043d\u043e \u0434\u043b\u044f \u0432\u0430\u0448\u0435\u0433\u043e \u0440\u0435\u0431\u0435\u043d\u043a\u0430",
    heroSubtitle: "\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u0434\u0435\u0442\u0430\u043b\u0435\u0439, \u0438 \u043f\u0435\u0440\u0435\u0434 \u0441\u043d\u043e\u043c \u043f\u043e\u044f\u0432\u0438\u0442\u0441\u044f \u0442\u0435\u043f\u043b\u0430\u044f, \u0434\u043e\u0431\u0440\u0430\u044f \u0438 \u0441\u043a\u0430\u0437\u043e\u0447\u043d\u0430\u044f \u0438\u0441\u0442\u043e\u0440\u0438\u044f.",
    historyButton: "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0432\u043e\u043b\u0448\u0435\u0431\u043d\u044b\u0445 \u043a\u043d\u0438\u0433",
    metrics: {
      safeTitle: "\u0411\u0435\u0440\u0435\u0436\u043d\u044b\u0435 \u0441\u044e\u0436\u0435\u0442\u044b",
      safeValue: "\u0414\u043e\u0431\u0440\u043e \u0438 \u0431\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u043e",
      safeSubtitle: "\u0411\u0435\u0437 \u043f\u0443\u0433\u0430\u044e\u0449\u0438\u0445 \u0442\u0435\u043c",
      langTitle: "\u042f\u0437\u044b\u043a\u0438 \u043c\u0438\u0440\u0430",
      langValue: "8 \u044f\u0437\u044b\u043a\u043e\u0432 UI",
      langSubtitle: "\u042f\u0437\u044b\u043a \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0437\u0430\u0434\u0430\u0451\u0442 \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441",
      saveTitle: "\u0421\u0435\u043c\u0435\u0439\u043d\u0430\u044f \u043f\u043e\u043b\u043a\u0430",
      saveValue: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 10 \u043a\u043d\u0438\u0433",
      saveSubtitle: "\u0421\u043e\u0445\u0440\u0430\u043d\u0435\u043d\u043e \u043d\u0430 \u044d\u0442\u043e\u043c \u0443\u0441\u0442\u0440\u043e\u0439\u0441\u0442\u0432\u0435"
    },
    loadingTitle: "\u041f\u043e\u0441\u044b\u043f\u0430\u0435\u043c \u043d\u043e\u0432\u0443\u044e \u043a\u043d\u0438\u0433\u0443 \u0437\u0432\u0451\u0437\u0434\u043d\u043e\u0439 \u043f\u044b\u043b\u044c\u0446\u043e\u0439...",
    loadingSubtitle: "\u041e\u0431\u043b\u043e\u0436\u043a\u0430 \u0438 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0441\u043a\u043e\u0440\u043e \u043f\u043e\u044f\u0432\u044f\u0442\u0441\u044f.",
    errors: {
      generateFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
      serviceBusy: "\u0413\u0435\u043d\u0435\u0440\u0430\u0442\u043e\u0440 \u0438\u0441\u0442\u043e\u0440\u0438\u0439 \u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437 \u0447\u0435\u0440\u0435\u0437 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043c\u0438\u043d\u0443\u0442.",
      copyFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043d\u0443\u044e.",
      pdfFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u044d\u043a\u0441\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c PDF. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",
      freeLimitReached: "\u0412\u044b \u0434\u043e\u0441\u0442\u0438\u0433\u043b\u0438 \u043b\u0438\u043c\u0438\u0442\u0430 \u0431\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0445 \u0438\u0441\u0442\u043e\u0440\u0438\u0439.",
      premiumRequired: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u0430 Premium",
      dailyLimitReached: "\u0412\u044b \u0434\u043e\u0441\u0442\u0438\u0433\u043b\u0438 \u043b\u0438\u043c\u0438\u0442\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u0439 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0437\u0430\u0432\u0442\u0440\u0430.",
      rateLimitExceeded: "\u0421\u043b\u0438\u0448\u043a\u043e\u043c \u043c\u043d\u043e\u0433\u043e \u0437\u0430\u043f\u0440\u043e\u0441\u043e\u0432. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0447\u0435\u0440\u0435\u0437 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043c\u0438\u043d\u0443\u0442.",
      verificationRequired: "\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430, \u043f\u0440\u043e\u0439\u0434\u0438\u0442\u0435 \u043f\u0440\u043e\u0432\u0435\u0440\u043a\u0443 \u043f\u0435\u0440\u0435\u0434 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0435\u043c \u0438\u0441\u0442\u043e\u0440\u0438\u0438.",
      verificationFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0437\u0430\u043f\u0440\u043e\u0441. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437.",
      unexpected: "\u041d\u0435\u043e\u0436\u0438\u0434\u0430\u043d\u043d\u0430\u044f \u043e\u0448\u0438\u0431\u043a\u0430"
    },
    subscription: {
      manageButton: "\u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0442\u044c \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u043e\u0439",
      opening: "\u041e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u043c...",
      activeDescription: "Premium \u0430\u043a\u0442\u0438\u0432\u0435\u043d. \u0423\u043f\u0440\u0430\u0432\u043b\u044f\u0439\u0442\u0435 \u043e\u043f\u043b\u0430\u0442\u043e\u0439 \u0438\u043b\u0438 \u043e\u0442\u043c\u0435\u043d\u043e\u0439 \u0432 Stripe.",
      portalFailed: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0443\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u043f\u043e\u0434\u043f\u0438\u0441\u043a\u043e\u0439. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439\u0442\u0435 \u0435\u0449\u0451 \u0440\u0430\u0437."
    },
    pricing: {
      title: "\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u043e vs Premium",
      subtitle: "\u0421\u0440\u0430\u0437\u0443 \u0432\u0438\u0434\u043d\u043e, \u0447\u0442\u043e \u0438\u043c\u0435\u043d\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0432\u0430\u0435\u0442 \u0430\u043f\u0433\u0440\u0435\u0439\u0434.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 \u0438\u0441\u0442\u043e\u0440\u0438\u0438",
      freeTextOnly: "\u0422\u043e\u043b\u044c\u043a\u043e \u0442\u0435\u043a\u0441\u0442",
      premiumUnlimited: "\u0418\u0441\u0442\u043e\u0440\u0438\u0438 \u0431\u0435\u0437 \u043b\u0438\u043c\u0438\u0442\u0430",
      premiumImages: "\u0418\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043a \u0438\u0441\u0442\u043e\u0440\u0438\u044f\u043c",
      premiumAudio: "\u0410\u0443\u0434\u0438\u043e-\u043e\u0437\u0432\u0443\u0447\u043a\u0430",
      premiumExports: "PDF / ZIP \u0441\u043a\u0430\u0447\u0438\u0432\u0430\u043d\u0438\u0435",
      startPremium: "\u041d\u0430\u0447\u0430\u0442\u044c Premium"
    }
  },
  emptyState: {
    title: "\u0412\u0430\u0448\u0430 \u0432\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043a\u043d\u0438\u0433\u0430 \u0436\u0434\u0451\u0442",
    subtitle: "\u0420\u0430\u0441\u0441\u043a\u0430\u0436\u0438\u0442\u0435 \u043d\u0435\u043c\u043d\u043e\u0433\u043e \u043e \u044e\u043d\u043e\u043c \u0447\u0438\u0442\u0430\u0442\u0435\u043b\u0435, \u0438 \u043c\u044b \u043e\u0442\u043a\u0440\u043e\u0435\u043c \u0442\u0451\u043f\u043b\u0443\u044e \u0441\u043a\u0430\u0437\u043e\u0447\u043d\u0443\u044e \u043a\u043d\u0438\u0433\u0443 \u0438\u043c\u0435\u043d\u043d\u043e \u0434\u043b\u044f \u044d\u0442\u043e\u0433\u043e \u0432\u0435\u0447\u0435\u0440\u0430."
  },
  reader: {
    headerLabel: "\u0412\u043e\u043b\u0448\u0435\u0431\u043d\u0430\u044f \u043a\u043d\u0438\u0433\u0430 \u043d\u0430 \u0441\u0435\u0433\u043e\u0434\u043d\u044f",
    coverFallback: "\u041e\u0431\u043b\u043e\u0436\u043a\u0430 \u0435\u0449\u0451 \u0441\u0442\u0435\u0441\u043d\u044f\u0435\u0442\u0441\u044f, \u043d\u043e \u0438\u0441\u0442\u043e\u0440\u0438\u044f \u0443\u0436\u0435 \u0433\u043e\u0442\u043e\u0432\u0430.",
    coverSubtitle: "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u043a\u043d\u0438\u0433\u0430 \u0441 \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u044f\u043c\u0438",
    coverForPrefix: "\u0414\u043b\u044f",
    startReading: "\u041d\u0430\u0447\u0430\u0442\u044c \u0447\u0438\u0442\u0430\u0442\u044c",
    pageOf: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430 {current} \u0438\u0437 {total}",
    illustrationsReady: "\u0418\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438: {ready}/{total}",
    pageLabel: "\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430",
    illustrationUnavailable: "\u0414\u043b\u044f \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0438\u043b\u043b\u044e\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442.",
    previous: "\u041d\u0430\u0437\u0430\u0434",
    next: "\u0414\u0430\u043b\u044c\u0448\u0435",
    backToCover: "\u041a \u043e\u0431\u043b\u043e\u0436\u043a\u0435",
    moralLabel: "\u0414\u043e\u0431\u0440\u0430\u044f \u043c\u043e\u0440\u0430\u043b\u044c",
    copyStory: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    copied: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u043e",
    downloadTxt: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c TXT",
    downloadPdf: "\u0421\u043a\u0430\u0447\u0430\u0442\u044c \u043a\u043d\u0438\u0433\u0443 (PDF)",
    generateAnother: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0435\u0449\u0451 \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    listenToStory: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    listenToFullStory: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c \u0432\u0441\u044e \u0438\u0441\u0442\u043e\u0440\u0438\u044e",
    generatingAudio: "\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043e\u0437\u0432\u0443\u0447\u043a\u0443 \u043f\u0435\u0440\u0435\u0434 \u0441\u043d\u043e\u043c...",
    generatingFullStoryAudio: "\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043e\u0437\u0432\u0443\u0447\u043a\u0443 \u0432\u0441\u0435\u0439 \u0438\u0441\u0442\u043e\u0440\u0438\u0438...",
    playAudio: "\u0412\u043e\u0441\u043f\u0440\u043e\u0438\u0437\u0432\u0435\u0441\u0442\u0438",
    pauseAudio: "\u041f\u0430\u0443\u0437\u0430",
    restartAudio: "\u0421\u043d\u0430\u0447\u0430\u043b\u0430",
    audioReady: "\u041e\u0437\u0432\u0443\u0447\u043a\u0430 \u0433\u043e\u0442\u043e\u0432\u0430",
    audioFailed: "\u041e\u0437\u0432\u0443\u0447\u043a\u0430 \u0441\u0435\u0439\u0447\u0430\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430.",
    listenToThisPage: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c \u044d\u0442\u0443 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443",
    generatingThisPageAudio: "\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043e\u0437\u0432\u0443\u0447\u043a\u0443 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b...",
    thisPageReady: "\u041e\u0437\u0432\u0443\u0447\u043a\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0433\u043e\u0442\u043e\u0432\u0430",
    thisPageFailed: "\u041e\u0437\u0432\u0443\u0447\u043a\u0430 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b \u0441\u0435\u0439\u0447\u0430\u0441 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430.",
    narrationFastHint: "\u0411\u044b\u0441\u0442\u0440\u043e\u0435 \u0432\u043e\u043b\u0448\u0435\u0431\u043d\u043e\u0435 \u0447\u0442\u0435\u043d\u0438\u0435 \u044d\u0442\u043e\u0439 \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u044b.",
    narrationFullHint: "\u041f\u043e\u043b\u043d\u0430\u044f \u043e\u0437\u0432\u0443\u0447\u043a\u0430 \u0432\u0441\u0435\u0439 \u043a\u043d\u0438\u0433\u0438 \u043f\u0435\u0440\u0435\u0434 \u0441\u043d\u043e\u043c.",
    premiumOnlyFeature: "\u042d\u0442\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430 \u0442\u043e\u043b\u044c\u043a\u043e \u0432 Premium.",
    upgradeToPremium: "\u041e\u0444\u043e\u0440\u043c\u0438\u0442\u044c Premium"
  }
};

const es: UiTranslations = {
  ...en,
  form: {
    ...en.form,
    quickPresets: "Ideas rapidas",
    presetBedtime: "Cuento para dormir",
    presetFriendship: "Cuento de amistad",
    presetEducational: "Cuento educativo",
    labels: {
      childName: "Nombre del nino",
      age: "Edad",
      gender: "Genero (opcional)",
      mainCharacter: "Personaje principal",
      theme: "Tema del cuento",
      language: "Idioma",
      length: "Longitud del cuento",
      style: "Estilo"
    },
    placeholders: {
      childName: "Escribe el nombre",
      gender: "Opcional",
      mainCharacter: "ej. zorro lunar",
      theme: "ej. amabilidad"
    },
    helperLanguage: "El idioma del formulario sigue el idioma elegido para el cuento.",
    buttons: {
      generate: "Generar cuento",
      generating: "Generando...",
      sampleData: "Usar datos de ejemplo"
    },
    lengthOptions: { short: "Corto", medium: "Medio", long: "Largo" },
    styleOptions: { bedtime: "Para dormir", educational: "Educativo", adventure: "Aventura", friendship: "Amistad" },
    languageNames: {
      English: "Ingles",
      Russian: "Ruso",
      Spanish: "Espanol",
      German: "Aleman",
      French: "Frances",
      Italian: "Italiano",
      Portuguese: "Portugues",
      Chinese: "Chino"
    }
  },
  home: {
    ...en.home,
    badge: "Atelier de cuentos al claro de luna",
    heroTitle: "Abre un libro magico hecho para tu peque",
    heroSubtitle: "Comparte algunos detalles y deja que nazca una aventura calida y encantadora para leer juntos esta noche.",
    historyButton: "Historial encantado",
    subscription: {
      manageButton: "Gestionar suscripcion",
      opening: "Abriendo...",
      activeDescription: "Premium esta activo. Gestiona tu pago o cancelacion en Stripe.",
      portalFailed: "No se pudo abrir la gestion de la suscripcion. Intentalo de nuevo."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "Mira claramente lo que desbloquea la mejora.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 historias",
      freeTextOnly: "Solo texto",
      premiumUnlimited: "Historias ilimitadas",
      premiumImages: "Imagenes de la historia",
      premiumAudio: "Narracion en audio",
      premiumExports: "Descargas PDF / ZIP",
      startPremium: "Empezar Premium"
    },
    errors: {
      ...en.home.errors,
      serviceBusy: "El generador de historias esta ocupado temporalmente. Intentalo de nuevo en un momento.",
      freeLimitReached: "Has alcanzado el limite gratuito de historias.",
      premiumRequired: "Se requiere suscripcion Premium",
      dailyLimitReached: "Has alcanzado el limite de historias de hoy. Intentalo de nuevo manana.",
      rateLimitExceeded: "Demasiadas solicitudes. Intentalo de nuevo en unos minutos.",
      verificationRequired: "Completa la verificacion antes de generar una historia.",
      verificationFailed: "No pudimos verificar la solicitud. Intentalo de nuevo."
    }
  },
  emptyState: {
    title: "Tu libro magico te esta esperando",
    subtitle: "Comparte algunos detalles sobre tu peque y abriremos un libro ilustrado calido y encantador para esta noche."
  },
  reader: {
    ...en.reader,
    headerLabel: "El libro encantado de esta noche",
    coverFallback: "La portada aun no ha llegado, pero la historia ya esta lista.",
    coverSubtitle: "Un libro ilustrado personalizado",
    coverForPrefix: "Hecho para",
    startReading: "Empezar a leer",
    pageOf: "Pagina {current} de {total}",
    illustrationsReady: "{ready}/{total} ilustraciones listas",
    pageLabel: "Pagina",
    illustrationUnavailable: "Esta pagina aun no tiene ilustracion.",
    previous: "Anterior",
    next: "Siguiente",
    backToCover: "Volver a la portada",
    moralLabel: "Moraleja amable",
    copyStory: "Copiar cuento",
    copied: "Copiado",
    downloadTxt: "Descargar TXT",
    downloadPdf: "Descargar libro (PDF)",
    generateAnother: "Generar otro cuento",
    premiumOnlyFeature: "Esta funcion solo esta disponible en Premium.",
    upgradeToPremium: "Mejorar a Premium"
  }
};

const de: UiTranslations = {
  ...en,
  form: {
    ...en.form,
    quickPresets: "Schnelle Ideen",
    presetBedtime: "Gute-Nacht-Geschichte",
    presetFriendship: "Freundschaftsgeschichte",
    presetEducational: "Lerngeschichte",
    languageNames: {
      English: "Englisch",
      Russian: "Russisch",
      Spanish: "Spanisch",
      German: "Deutsch",
      French: "Franzoesisch",
      Italian: "Italienisch",
      Portuguese: "Portugiesisch",
      Chinese: "Chinesisch"
    }
  },
  home: {
    ...en.home,
    badge: "Mondschein-Geschichtenatelier",
    heroTitle: "Oeffne ein magisches Bilderbuch fuer dein Kind",
    heroSubtitle: "Mit ein paar Details entsteht ein warmes, wunderschoenes Abenteuer fuer heute Abend.",
    historyButton: "Verzauberte Historie",
    subscription: {
      manageButton: "Abo verwalten",
      opening: "Wird geoeffnet...",
      activeDescription: "Premium ist aktiv. Verwalte Zahlung oder Kuendigung in Stripe.",
      portalFailed: "Die Abo-Verwaltung konnte nicht geoeffnet werden. Bitte versuche es erneut."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "Sieh sofort, was das Upgrade freischaltet.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 Geschichten",
      freeTextOnly: "Nur Text",
      premiumUnlimited: "Unbegrenzte Geschichten",
      premiumImages: "Geschichtenbilder",
      premiumAudio: "Audio-Erzaehlung",
      premiumExports: "PDF / ZIP-Downloads",
      startPremium: "Premium starten"
    },
    errors: {
      ...en.home.errors,
      serviceBusy: "Der Geschichtengenerator ist voruebergehend ausgelastet. Bitte versuche es gleich noch einmal.",
      freeLimitReached: "Du hast das kostenlose Geschichtenlimit erreicht.",
      premiumRequired: "Premium-Abonnement erforderlich",
      dailyLimitReached: "Du hast das heutige Geschichtenlimit erreicht. Bitte versuche es morgen erneut.",
      rateLimitExceeded: "Zu viele Anfragen. Bitte versuche es in ein paar Minuten erneut.",
      verificationRequired: "Bitte schliesse die Verifizierung ab, bevor du eine Geschichte erzeugst.",
      verificationFailed: "Die Anfrage konnte nicht verifiziert werden. Bitte versuche es erneut."
    }
  },
  emptyState: {
    title: "Dein magisches Buch wartet",
    subtitle: "Teile ein paar Details und wir oeffnen ein warmes Bilderbuch fuer heute Abend."
  },
  reader: {
    ...en.reader,
    headerLabel: "Das verzauberte Buch des Abends",
    coverFallback: "Das Cover fehlt noch, aber die Geschichte ist bereit.",
    coverSubtitle: "Ein personalisiertes Bilderbuch",
    coverForPrefix: "Fuer",
    startReading: "Lesen beginnen",
    previous: "Zurueck",
    next: "Weiter",
    backToCover: "Zurueck zum Cover",
    premiumOnlyFeature: "Diese Funktion ist nur mit Premium verfuegbar.",
    upgradeToPremium: "Zu Premium wechseln"
  }
};

const fr: UiTranslations = {
  ...en,
  form: {
    ...en.form,
    quickPresets: "Idees rapides",
    presetBedtime: "Histoire du soir",
    presetFriendship: "Histoire d'amitie",
    presetEducational: "Histoire educative",
    languageNames: {
      English: "Anglais",
      Russian: "Russe",
      Spanish: "Espagnol",
      German: "Allemand",
      French: "Francais",
      Italian: "Italien",
      Portuguese: "Portugais",
      Chinese: "Chinois"
    }
  },
  home: {
    ...en.home,
    badge: "Atelier de contes au clair de lune",
    heroTitle: "Ouvrez un livre magique pour votre enfant",
    heroSubtitle: "Quelques details suffisent pour faire naitre une aventure douce pour ce soir.",
    historyButton: "Historique enchante",
    subscription: {
      manageButton: "Gerer l'abonnement",
      opening: "Ouverture...",
      activeDescription: "Premium est actif. Gere ton paiement ou ta resiliation dans Stripe.",
      portalFailed: "Impossible d'ouvrir la gestion de l'abonnement. Veuillez reessayer."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "Vois tout de suite ce que l'upgrade debloque.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 histoires",
      freeTextOnly: "Texte uniquement",
      premiumUnlimited: "Histoires illimitees",
      premiumImages: "Images de l'histoire",
      premiumAudio: "Narration audio",
      premiumExports: "Telechargements PDF / ZIP",
      startPremium: "Commencer Premium"
    },
    errors: {
      ...en.home.errors,
      serviceBusy: "Le generateur d'histoires est temporairement indisponible. Veuillez reessayer dans un instant.",
      freeLimitReached: "Vous avez atteint la limite gratuite d'histoires.",
      premiumRequired: "Abonnement Premium requis",
      dailyLimitReached: "Vous avez atteint la limite d'histoires pour aujourd'hui. Veuillez reessayer demain.",
      rateLimitExceeded: "Trop de requetes. Veuillez reessayer dans quelques minutes.",
      verificationRequired: "Veuillez terminer la verification avant de generer une histoire.",
      verificationFailed: "Nous n'avons pas pu verifier la demande. Veuillez reessayer."
    }
  },
  emptyState: {
    title: "Votre livre magique vous attend",
    subtitle: "Partagez quelques details et nous ouvrirons un livre chaleureux pour ce soir."
  },
  reader: {
    ...en.reader,
    headerLabel: "Le livre enchante de ce soir",
    coverFallback: "La couverture manque encore, mais l'histoire est prete.",
    coverSubtitle: "Un livre illustre personnalise",
    coverForPrefix: "Pour",
    startReading: "Commencer la lecture",
    previous: "Precedente",
    next: "Suivante",
    backToCover: "Retour a la couverture",
    premiumOnlyFeature: "Cette fonctionnalite est disponible uniquement avec Premium.",
    upgradeToPremium: "Passer a Premium"
  }
};

const it: UiTranslations = {
  ...en,
  form: {
    ...en.form,
    quickPresets: "Idee rapide",
    presetBedtime: "Storia della buonanotte",
    presetFriendship: "Storia di amicizia",
    presetEducational: "Storia educativa",
    languageNames: {
      English: "Inglese",
      Russian: "Russo",
      Spanish: "Spagnolo",
      German: "Tedesco",
      French: "Francese",
      Italian: "Italiano",
      Portuguese: "Portoghese",
      Chinese: "Cinese"
    }
  },
  home: {
    ...en.home,
    badge: "Atelier di storie al chiaro di luna",
    heroTitle: "Apri un libro magico per il tuo bambino",
    heroSubtitle: "Con pochi dettagli nasce un'avventura calda e accogliente per questa sera.",
    historyButton: "Archivio incantato",
    subscription: {
      manageButton: "Gestisci abbonamento",
      opening: "Apertura...",
      activeDescription: "Premium e attivo. Gestisci pagamento o cancellazione in Stripe.",
      portalFailed: "Impossibile aprire la gestione dell'abbonamento. Riprova."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "Vedi subito cosa sblocca l'upgrade.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 storie",
      freeTextOnly: "Solo testo",
      premiumUnlimited: "Storie illimitate",
      premiumImages: "Immagini della storia",
      premiumAudio: "Narrazione audio",
      premiumExports: "Download PDF / ZIP",
      startPremium: "Attiva Premium"
    },
    errors: {
      ...en.home.errors,
      serviceBusy: "Il generatore di storie e temporaneamente occupato. Riprova tra un momento.",
      freeLimitReached: "Hai raggiunto il limite gratuito di storie.",
      premiumRequired: "Abbonamento Premium richiesto",
      dailyLimitReached: "Hai raggiunto il limite di storie per oggi. Riprova domani.",
      rateLimitExceeded: "Troppe richieste. Riprova tra qualche minuto.",
      verificationRequired: "Completa la verifica prima di generare una storia.",
      verificationFailed: "Non siamo riusciti a verificare la richiesta. Riprova."
    }
  },
  emptyState: {
    title: "Il tuo libro magico ti aspetta",
    subtitle: "Condividi qualche dettaglio e apriremo un libro illustrato accogliente per questa sera."
  },
  reader: {
    ...en.reader,
    headerLabel: "Il libro incantato di stasera",
    coverFallback: "La copertina non e ancora arrivata, ma la storia e pronta.",
    coverSubtitle: "Un libro illustrato personalizzato",
    coverForPrefix: "Per",
    startReading: "Inizia a leggere",
    previous: "Indietro",
    next: "Avanti",
    backToCover: "Torna alla copertina",
    premiumOnlyFeature: "Questa funzione e disponibile solo con Premium.",
    upgradeToPremium: "Passa a Premium"
  }
};

const pt: UiTranslations = {
  ...en,
  form: {
    ...en.form,
    quickPresets: "Ideias rapidas",
    presetBedtime: "Historia para dormir",
    presetFriendship: "Historia de amizade",
    presetEducational: "Historia educativa",
    languageNames: {
      English: "Ingles",
      Russian: "Russo",
      Spanish: "Espanhol",
      German: "Alemao",
      French: "Frances",
      Italian: "Italiano",
      Portuguese: "Portugues",
      Chinese: "Chines"
    }
  },
  home: {
    ...en.home,
    badge: "Atelier de historias ao luar",
    heroTitle: "Abra um livro magico para a sua crianca",
    heroSubtitle: "Com alguns detalhes nasce uma aventura acolhedora para ler juntos esta noite.",
    historyButton: "Historico encantado",
    subscription: {
      manageButton: "Gerir assinatura",
      opening: "A abrir...",
      activeDescription: "Premium esta ativo. Gere pagamento ou cancelamento no Stripe.",
      portalFailed: "Nao foi possivel abrir a gestao da assinatura. Tente novamente."
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "Vê claramente o que muda com o upgrade.",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 historias",
      freeTextOnly: "Apenas texto",
      premiumUnlimited: "Historias ilimitadas",
      premiumImages: "Imagens da historia",
      premiumAudio: "Narracao em audio",
      premiumExports: "Downloads PDF / ZIP",
      startPremium: "Comecar Premium"
    },
    errors: {
      ...en.home.errors,
      serviceBusy: "O gerador de historias esta temporariamente ocupado. Tente novamente dentro de instantes.",
      freeLimitReached: "Voce atingiu o limite gratuito de historias.",
      premiumRequired: "Assinatura Premium obrigatoria",
      dailyLimitReached: "Atingiste o limite de historias de hoje. Tenta novamente amanha.",
      rateLimitExceeded: "Demasiados pedidos. Tenta novamente dentro de alguns minutos.",
      verificationRequired: "Conclua a verificacao antes de gerar uma historia.",
      verificationFailed: "Nao foi possivel verificar a solicitacao. Tente novamente."
    }
  },
  emptyState: {
    title: "Seu livro magico esta esperando",
    subtitle: "Partilhe alguns detalhes e abriremos um livro ilustrado acolhedor para esta noite."
  },
  reader: {
    ...en.reader,
    headerLabel: "O livro encantado desta noite",
    coverFallback: "A capa ainda nao chegou, mas a historia esta pronta.",
    coverSubtitle: "Um livro ilustrado personalizado",
    coverForPrefix: "Para",
    startReading: "Comecar leitura",
    previous: "Anterior",
    next: "Seguinte",
    backToCover: "Voltar a capa",
    premiumOnlyFeature: "Este recurso esta disponivel apenas no Premium.",
    upgradeToPremium: "Fazer upgrade para Premium"
  }
};

const zh: UiTranslations = {
  form: {
    quickPresets: "\u5feb\u901f\u7075\u611f",
    presetBedtime: "\u7761\u524d\u6545\u4e8b",
    presetFriendship: "\u53cb\u8c0a\u6545\u4e8b",
    presetEducational: "\u542f\u8499\u6545\u4e8b",
    labels: {
      childName: "\u5b69\u5b50\u540d\u5b57",
      age: "\u5e74\u9f84",
      gender: "\u6027\u522b\uff08\u53ef\u9009\uff09",
      mainCharacter: "\u4e3b\u89d2",
      theme: "\u6545\u4e8b\u4e3b\u9898",
      language: "\u8bed\u8a00",
      length: "\u6545\u4e8b\u957f\u5ea6",
      style: "\u98ce\u683c"
    },
    placeholders: {
      childName: "\u8bf7\u8f93\u5165\u540d\u5b57",
      gender: "\u53ef\u9009",
      mainCharacter: "\u4f8b\u5982\uff1a\u6708\u4eae\u5c0f\u72d0\u72f8",
      theme: "\u4f8b\u5982\uff1a\u5584\u826f"
    },
    helperLanguage: "\u8868\u5355\u8bed\u8a00\u4f1a\u8ddf\u968f\u4f60\u9009\u62e9\u7684\u6545\u4e8b\u8bed\u8a00\u3002",
    buttons: {
      generate: "\u521b\u5efa\u6545\u4e8b",
      generating: "\u751f\u6210\u4e2d...",
      sampleData: "\u4f7f\u7528\u793a\u4f8b\u6570\u636e"
    },
    lengthOptions: {
      short: "\u77ed\u7bc7",
      medium: "\u4e2d\u7bc7",
      long: "\u957f\u7bc7"
    },
    styleOptions: {
      bedtime: "\u7761\u524d",
      educational: "\u542f\u8499",
      adventure: "\u5192\u9669",
      friendship: "\u53cb\u8c0a"
    },
    languageNames: {
      English: "\u82f1\u8bed",
      Russian: "\u4fc4\u8bed",
      Spanish: "\u897f\u73ed\u7259\u8bed",
      German: "\u5fb7\u8bed",
      French: "\u6cd5\u8bed",
      Italian: "\u610f\u5927\u5229\u8bed",
      Portuguese: "\u8461\u8404\u7259\u8bed",
      Chinese: "\u4e2d\u6587"
    }
  },
  home: {
    badge: "\u6708\u591c\u6545\u4e8b\u5de5\u574a",
    heroTitle: "\u4e3a\u4f60\u7684\u5b69\u5b50\u6253\u5f00\u4e00\u672c\u4e13\u5c5e\u7684\u9b54\u6cd5\u7ed8\u672c",
    heroSubtitle: "\u53ea\u8981\u8865\u5145\u51e0\u4e2a\u7ec6\u8282\uff0c\u4eca\u665a\u5c31\u80fd\u51fa\u73b0\u4e00\u4e2a\u6e29\u6696\u3001\u67d4\u548c\u53c8\u5145\u6ee1\u5947\u5e7b\u611f\u7684\u6545\u4e8b\u3002",
    historyButton: "\u9b54\u6cd5\u6545\u4e8b\u5386\u53f2",
    metrics: {
      safeTitle: "\u6e29\u67d4\u7684\u6545\u4e8b",
      safeValue: "\u53cb\u597d\u4e14\u9002\u5408\u5b69\u5b50",
      safeSubtitle: "\u6ca1\u6709\u9634\u68ee\u6216\u5413\u4eba\u7684\u5185\u5bb9",
      langTitle: "\u591a\u8bed\u8a00\u4f53\u9a8c",
      langValue: "8 \u79cd UI \u8bed\u8a00",
      langSubtitle: "\u754c\u9762\u4f1a\u8ddf\u968f\u6545\u4e8b\u8bed\u8a00\u53d8\u5316",
      saveTitle: "\u5bb6\u5ead\u8bb0\u5fc6\u4e66\u67b6",
      saveValue: "\u6700\u8fd1 10 \u672c",
      saveSubtitle: "\u5b89\u5168\u4fdd\u5b58\u5728\u8fd9\u53f0\u8bbe\u5907\u4e0a"
    },
    loadingTitle: "\u6b63\u5728\u4e3a\u4f60\u7684\u65b0\u7ed8\u672c\u6492\u4e0b\u661f\u5c18...",
    loadingSubtitle: "\u5c01\u9762\u548c\u5185\u9875\u5f88\u5feb\u5c31\u4f1a\u51fa\u73b0\u3002",
    errors: {
      generateFailed: "\u751f\u6210\u6545\u4e8b\u5931\u8d25",
      serviceBusy: "\u6545\u4e8b\u751f\u6210\u5668\u6682\u65f6\u65e0\u6cd5\u4f7f\u7528\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002",
      copyFailed: "\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u624b\u52a8\u590d\u5236\u3002",
      pdfFailed: "PDF \u5bfc\u51fa\u5931\u8d25\uff0c\u8bf7\u518d\u8bd5\u4e00\u6b21\u3002",
      freeLimitReached: "\u60a8\u5df2\u8fbe\u5230\u514d\u8d39\u6545\u4e8b\u6570\u91cf\u9650\u5236",
      premiumRequired: "\u9700\u8981 Premium \u8ba2\u9605",
      dailyLimitReached: "\u4f60\u5df2\u8fbe\u5230\u4eca\u5929\u7684\u6545\u4e8b\u4e0a\u9650\uff0c\u8bf7\u660e\u5929\u518d\u8bd5\u3002",
      rateLimitExceeded: "\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u8fc7\u51e0\u5206\u949f\u540e\u518d\u8bd5\u3002",
      verificationRequired: "\u8bf7\u5148\u5b8c\u6210\u9a8c\u8bc1\uff0c\u518d\u751f\u6210\u6545\u4e8b\u3002",
      verificationFailed: "\u6211\u4eec\u65e0\u6cd5\u9a8c\u8bc1\u8fd9\u6b21\u8bf7\u6c42\uff0c\u8bf7\u91cd\u8bd5\u3002",
      unexpected: "\u53d1\u751f\u4e86\u610f\u5916\u9519\u8bef"
    },
    subscription: {
      manageButton: "\u7ba1\u7406\u8ba2\u9605",
      opening: "\u6b63\u5728\u6253\u5f00...",
      activeDescription: "Premium \u5df2\u6fc0\u6d3b\u3002\u4f60\u53ef\u4ee5\u5728 Stripe \u4e2d\u7ba1\u7406\u4ed8\u6b3e\u6216\u53d6\u6d88\u8ba2\u9605\u3002",
      portalFailed: "\u65e0\u6cd5\u6253\u5f00\u8ba2\u9605\u7ba1\u7406\uff0c\u8bf7\u518d\u8bd5\u4e00\u6b21\u3002"
    },
    pricing: {
      title: "Free vs Premium",
      subtitle: "\u6e05\u695a\u770b\u5230\u5347\u7ea7\u540e\u4f1a\u89e3\u9501\u4ec0\u4e48\u3002",
      freeLabel: "Free",
      premiumLabel: "Premium",
      freeStories: "3 \u4e2a\u6545\u4e8b",
      freeTextOnly: "\u4ec5\u6587\u5b57",
      premiumUnlimited: "\u65e0\u9650\u6545\u4e8b",
      premiumImages: "\u6545\u4e8b\u56fe\u7247",
      premiumAudio: "\u97f3\u9891\u65c1\u767d",
      premiumExports: "PDF / ZIP \u4e0b\u8f7d",
      startPremium: "\u5f00\u542f Premium"
    }
  },
  emptyState: {
    title: "\u4f60\u7684\u9b54\u6cd5\u6545\u4e8b\u4e66\u6b63\u5728\u7b49\u4f60",
    subtitle: "\u7b80\u5355\u586b\u5199\u51e0\u4e2a\u5c0f\u8bfb\u8005\u7684\u4fe1\u606f\uff0c\u6211\u4eec\u5c31\u4f1a\u4e3a\u4eca\u665a\u6253\u5f00\u4e00\u672c\u6e29\u6696\u800c\u5947\u5e7b\u7684\u7ed8\u672c\u3002"
  },
  reader: {
    headerLabel: "\u4eca\u591c\u7684\u9b54\u6cd5\u6545\u4e8b\u4e66",
    coverFallback: "\u5c01\u9762\u8fd8\u5728\u5bb3\u7f9e\uff0c\u4f46\u6545\u4e8b\u5df2\u7ecf\u51c6\u5907\u597d\u4e86\u3002",
    coverSubtitle: "\u4e13\u5c5e\u5b9a\u5236\u7684\u7ed8\u672c",
    coverForPrefix: "\u4e3a",
    startReading: "\u5f00\u59cb\u9605\u8bfb",
    pageOf: "\u7b2c {current} \u9875\uff0c\u5171 {total} \u9875",
    illustrationsReady: "{ready}/{total} \u5e45\u63d2\u56fe\u5df2\u51c6\u5907\u597d",
    pageLabel: "\u9875",
    illustrationUnavailable: "\u8fd9\u4e00\u9875\u6682\u65f6\u8fd8\u6ca1\u6709\u63d2\u56fe\u3002",
    previous: "\u4e0a\u4e00\u9875",
    next: "\u4e0b\u4e00\u9875",
    backToCover: "\u56de\u5230\u5c01\u9762",
    moralLabel: "\u6e29\u67d4\u7684\u9053\u7406",
    copyStory: "\u590d\u5236\u6545\u4e8b",
    copied: "\u5df2\u590d\u5236",
    downloadTxt: "\u4e0b\u8f7d TXT",
    downloadPdf: "\u4e0b\u8f7d\u6545\u4e8b\u4e66 (PDF)",
    generateAnother: "\u518d\u521b\u5efa\u4e00\u4e2a\u6545\u4e8b",
    listenToStory: "\u6536\u542c\u6545\u4e8b",
    listenToFullStory: "\u6536\u542c\u5b8c\u6574\u6545\u4e8b",
    generatingAudio: "\u6b63\u5728\u51c6\u5907\u7761\u524d\u65c1\u767d...",
    generatingFullStoryAudio: "\u6b63\u5728\u51c6\u5907\u5b8c\u6574\u6545\u4e8b\u65c1\u767d...",
    playAudio: "\u64ad\u653e",
    pauseAudio: "\u6682\u505c",
    restartAudio: "\u91cd\u65b0\u64ad\u653e",
    audioReady: "\u97f3\u9891\u5df2\u51c6\u5907\u597d",
    audioFailed: "\u5f53\u524d\u65e0\u6cd5\u751f\u6210\u97f3\u9891\u3002",
    listenToThisPage: "\u6536\u542c\u8fd9\u4e00\u9875",
    generatingThisPageAudio: "\u6b63\u5728\u51c6\u5907\u672c\u9875\u65c1\u767d...",
    thisPageReady: "\u672c\u9875\u97f3\u9891\u5df2\u51c6\u5907\u597d",
    thisPageFailed: "\u5f53\u524d\u65e0\u6cd5\u751f\u6210\u672c\u9875\u97f3\u9891\u3002",
    narrationFastHint: "\u8fd9\u4e00\u9875\u7684\u5feb\u901f\u9b54\u6cd5\u6717\u8bfb\u3002",
    narrationFullHint: "\u6574\u672c\u6545\u4e8b\u7684\u5b8c\u6574\u7761\u524d\u65c1\u767d\u3002",
    premiumOnlyFeature: "\u6b64\u529f\u80fd\u4ec5\u9650 Premium \u7528\u6237\u4f7f\u7528\u3002",
    upgradeToPremium: "\u5347\u7ea7 Premium"
  }
};

const translations: Record<UiLanguage, UiTranslations> = {
  en,
  ru,
  es,
  de,
  fr,
  it,
  pt,
  zh
};

const storyLanguageToUi: Record<string, UiLanguage> = {
  english: "en",
  en: "en",
  russian: "ru",
  russkii: "ru",
  "\u0440\u0443\u0441\u0441\u043a\u0438\u0439": "ru",
  ru: "ru",
  spanish: "es",
  espanol: "es",
  es: "es",
  german: "de",
  deutsch: "de",
  de: "de",
  french: "fr",
  francais: "fr",
  fr: "fr",
  italian: "it",
  italiano: "it",
  it: "it",
  portuguese: "pt",
  portugues: "pt",
  pt: "pt",
  chinese: "zh",
  mandarin: "zh",
  "\u4e2d\u6587": "zh",
  zh: "zh"
};

export function getUiLanguageFromStoryLanguage(storyLanguage: string): UiLanguage {
  const normalized = storyLanguage.trim().toLowerCase();
  return storyLanguageToUi[normalized] || "en";
}

export function getUiTranslations(storyLanguage: string): UiTranslations {
  const uiLanguage = getUiLanguageFromStoryLanguage(storyLanguage);
  return translations[uiLanguage] || translations.en;
}

export function getFormTranslations(storyLanguage: string): FormTranslations {
  return getUiTranslations(storyLanguage).form;
}
