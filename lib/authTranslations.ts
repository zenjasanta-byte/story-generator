import type { SupportedLanguage } from "@/lib/narrationVoices";
import { SITE_NAME } from "@/lib/siteConfig";

export type AuthCopy = {
  badge: string;
  siteLabel: string;
  loginTitle: string;
  loginSubtitle: string;
  signupTitle: string;
  signupSubtitle: string;
  emailLabel: string;
  passwordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  loginButton: string;
  signupButton: string;
  switchToLogin: string;
  switchToSignup: string;
  switchLoginLink: string;
  switchSignupLink: string;
  logoutButton: string;
  accountLink: string;
  signedInAs: string;
  footerGuestLabel: string;
  footerAccountLabel: string;
  continueAfterAuth: string;
  validationEmail: string;
  validationPassword: string;
  invalidCredentials: string;
  emailTaken: string;
  genericError: string;
  authRequired: string;
  authNotConfigured: string;
  signupLinkedMessage: string;
};

export const authTranslations: Record<SupportedLanguage, AuthCopy> = {
  en: {
    badge: "Account",
    siteLabel: SITE_NAME,
    loginTitle: "Sign in",
    loginSubtitle: "Sign in to keep your stories, billing, and future Premium upgrades connected to one account.",
    signupTitle: "Create account",
    signupSubtitle: "Create a real account so your session, billing access, and future Premium purchases stay tied to one identity.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Enter your password",
    loginButton: "Sign in",
    signupButton: "Create account",
    switchToLogin: "Already have an account?",
    switchToSignup: "Need an account?",
    switchLoginLink: "Sign in",
    switchSignupLink: "Create one",
    logoutButton: "Sign out",
    accountLink: "Account",
    signedInAs: "Signed in as",
    footerGuestLabel: "Guest mode",
    footerAccountLabel: "Account",
    continueAfterAuth: "You will return to the same page after authentication.",
    validationEmail: "Enter a valid email address.",
    validationPassword: "Password must be at least 6 characters.",
    invalidCredentials: "Incorrect email or password.",
    emailTaken: "An account with this email already exists.",
    genericError: "Authentication failed. Please try again.",
    authRequired: "Please sign in to continue.",
    authNotConfigured: "Authentication is not configured on the server yet.",
    signupLinkedMessage: "This new account is now linked to your current session, existing stories, and any Premium access in this browser."
  },
  ru: {
    badge: "Аккаунт",
    siteLabel: SITE_NAME,
    loginTitle: "Войти",
    loginSubtitle: "Войдите, чтобы сохранить истории, оплату и будущие покупки Premium в одном аккаунте.",
    signupTitle: "Создать аккаунт",
    signupSubtitle: "Создайте настоящий аккаунт, чтобы связать сессию, оплату и будущие покупки Premium с одним профилем.",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Введите пароль",
    loginButton: "Войти",
    signupButton: "Создать аккаунт",
    switchToLogin: "Уже есть аккаунт?",
    switchToSignup: "Нужен аккаунт?",
    switchLoginLink: "Войти",
    switchSignupLink: "Создать",
    logoutButton: "Выйти",
    accountLink: "Аккаунт",
    signedInAs: "Вы вошли как",
    footerGuestLabel: "Гостевой режим",
    footerAccountLabel: "Аккаунт",
    continueAfterAuth: "После входа вы вернётесь на ту же страницу.",
    validationEmail: "Введите корректный email.",
    validationPassword: "Пароль должен быть не короче 6 символов.",
    invalidCredentials: "Неверный email или пароль.",
    emailTaken: "Аккаунт с таким email уже существует.",
    genericError: "Не удалось выполнить вход. Попробуйте ещё раз.",
    authRequired: "Пожалуйста, войдите, чтобы продолжить.",
    authNotConfigured: "Авторизация на сервере ещё не настроена.",
    signupLinkedMessage: "Новый аккаунт уже связан с текущей сессией, существующими историями и доступом Premium в этом браузере."
  },
  es: {
    badge: "Cuenta",
    siteLabel: SITE_NAME,
    loginTitle: "Iniciar sesion",
    loginSubtitle: "Inicia sesion para mantener tus historias, facturacion y futuras mejoras Premium dentro de una sola cuenta.",
    signupTitle: "Crear cuenta",
    signupSubtitle: "Crea una cuenta real para vincular tu sesion, acceso de facturacion y futuras compras Premium a una misma identidad.",
    emailLabel: "Correo",
    passwordLabel: "Contrasena",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Introduce tu contrasena",
    loginButton: "Entrar",
    signupButton: "Crear cuenta",
    switchToLogin: "Ya tienes cuenta?",
    switchToSignup: "Necesitas una cuenta?",
    switchLoginLink: "Iniciar sesion",
    switchSignupLink: "Crear cuenta",
    logoutButton: "Cerrar sesion",
    accountLink: "Cuenta",
    signedInAs: "Sesion iniciada como",
    footerGuestLabel: "Modo invitado",
    footerAccountLabel: "Cuenta",
    continueAfterAuth: "Volveras a la misma pagina despues de autenticarte.",
    validationEmail: "Introduce un correo valido.",
    validationPassword: "La contrasena debe tener al menos 6 caracteres.",
    invalidCredentials: "Correo o contrasena incorrectos.",
    emailTaken: "Ya existe una cuenta con este correo.",
    genericError: "La autenticacion fallo. Intentalo de nuevo.",
    authRequired: "Inicia sesion para continuar.",
    authNotConfigured: "La autenticacion todavia no esta configurada en el servidor.",
    signupLinkedMessage: "La nueva cuenta ya esta vinculada con la sesion actual, las historias existentes y cualquier acceso Premium de este navegador."
  },
  de: {
    badge: "Konto",
    siteLabel: SITE_NAME,
    loginTitle: "Anmelden",
    loginSubtitle: "Melde dich an, damit Geschichten, Abrechnung und spaetere Premium-Upgrades zu einem Konto gehoeren.",
    signupTitle: "Konto erstellen",
    signupSubtitle: "Erstelle ein echtes Konto, damit Sitzung, Abrechnung und spaetere Premium-Kaeufe mit einer Identitaet verknuepft bleiben.",
    emailLabel: "E-Mail",
    passwordLabel: "Passwort",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Passwort eingeben",
    loginButton: "Anmelden",
    signupButton: "Konto erstellen",
    switchToLogin: "Du hast schon ein Konto?",
    switchToSignup: "Du brauchst ein Konto?",
    switchLoginLink: "Anmelden",
    switchSignupLink: "Konto erstellen",
    logoutButton: "Abmelden",
    accountLink: "Konto",
    signedInAs: "Angemeldet als",
    footerGuestLabel: "Gastmodus",
    footerAccountLabel: "Konto",
    continueAfterAuth: "Nach der Anmeldung kehrst du auf dieselbe Seite zurueck.",
    validationEmail: "Gib eine gueltige E-Mail-Adresse ein.",
    validationPassword: "Das Passwort muss mindestens 6 Zeichen lang sein.",
    invalidCredentials: "E-Mail oder Passwort ist falsch.",
    emailTaken: "Zu dieser E-Mail gibt es bereits ein Konto.",
    genericError: "Die Anmeldung ist fehlgeschlagen. Bitte versuche es erneut.",
    authRequired: "Bitte melde dich an, um fortzufahren.",
    authNotConfigured: "Die Authentifizierung ist auf dem Server noch nicht konfiguriert.",
    signupLinkedMessage: "Das neue Konto ist jetzt mit deiner aktuellen Sitzung, vorhandenen Geschichten und eventuellem Premium-Zugang in diesem Browser verknuepft."
  },
  fr: {
    badge: "Compte",
    siteLabel: SITE_NAME,
    loginTitle: "Se connecter",
    loginSubtitle: "Connectez-vous pour conserver vos histoires, votre facturation et vos futurs achats Premium dans un seul compte.",
    signupTitle: "Creer un compte",
    signupSubtitle: "Creez un vrai compte pour relier votre session, la facturation et vos futurs achats Premium a une seule identite.",
    emailLabel: "Email",
    passwordLabel: "Mot de passe",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Entrez votre mot de passe",
    loginButton: "Se connecter",
    signupButton: "Creer un compte",
    switchToLogin: "Vous avez deja un compte ?",
    switchToSignup: "Vous avez besoin d'un compte ?",
    switchLoginLink: "Se connecter",
    switchSignupLink: "Creer un compte",
    logoutButton: "Se deconnecter",
    accountLink: "Compte",
    signedInAs: "Connecte en tant que",
    footerGuestLabel: "Mode invite",
    footerAccountLabel: "Compte",
    continueAfterAuth: "Vous reviendrez sur la meme page apres l'authentification.",
    validationEmail: "Entrez une adresse email valide.",
    validationPassword: "Le mot de passe doit contenir au moins 6 caracteres.",
    invalidCredentials: "Email ou mot de passe incorrect.",
    emailTaken: "Un compte existe deja avec cet email.",
    genericError: "L'authentification a echoue. Reessayez.",
    authRequired: "Veuillez vous connecter pour continuer.",
    authNotConfigured: "L'authentification n'est pas encore configuree sur le serveur.",
    signupLinkedMessage: "Le nouveau compte est maintenant relie a la session actuelle, aux histoires existantes et a tout acces Premium de ce navigateur."
  },
  it: {
    badge: "Account",
    siteLabel: SITE_NAME,
    loginTitle: "Accedi",
    loginSubtitle: "Accedi per mantenere storie, fatturazione e futuri acquisti Premium collegati allo stesso account.",
    signupTitle: "Crea account",
    signupSubtitle: "Crea un account reale per collegare sessione, fatturazione e futuri acquisti Premium a un'unica identita.",
    emailLabel: "Email",
    passwordLabel: "Password",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Inserisci la password",
    loginButton: "Accedi",
    signupButton: "Crea account",
    switchToLogin: "Hai gia un account?",
    switchToSignup: "Ti serve un account?",
    switchLoginLink: "Accedi",
    switchSignupLink: "Crea account",
    logoutButton: "Esci",
    accountLink: "Account",
    signedInAs: "Accesso effettuato come",
    footerGuestLabel: "Modalita ospite",
    footerAccountLabel: "Account",
    continueAfterAuth: "Dopo l'accesso tornerai alla stessa pagina.",
    validationEmail: "Inserisci un indirizzo email valido.",
    validationPassword: "La password deve contenere almeno 6 caratteri.",
    invalidCredentials: "Email o password non corretti.",
    emailTaken: "Esiste gia un account con questa email.",
    genericError: "Autenticazione non riuscita. Riprova.",
    authRequired: "Accedi per continuare.",
    authNotConfigured: "L'autenticazione non e ancora configurata sul server.",
    signupLinkedMessage: "Il nuovo account e ora collegato alla sessione attuale, alle storie esistenti e a qualsiasi accesso Premium presente in questo browser."
  },
  pt: {
    badge: "Conta",
    siteLabel: SITE_NAME,
    loginTitle: "Entrar",
    loginSubtitle: "Entra para manter historias, cobranca e futuras compras Premium ligados a uma unica conta.",
    signupTitle: "Criar conta",
    signupSubtitle: "Cria uma conta real para ligar a tua sessao, cobranca e futuras compras Premium a uma identidade unica.",
    emailLabel: "Email",
    passwordLabel: "Palavra-passe",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "Introduz a tua palavra-passe",
    loginButton: "Entrar",
    signupButton: "Criar conta",
    switchToLogin: "Ja tens conta?",
    switchToSignup: "Precisas de conta?",
    switchLoginLink: "Entrar",
    switchSignupLink: "Criar conta",
    logoutButton: "Sair",
    accountLink: "Conta",
    signedInAs: "Sessao iniciada como",
    footerGuestLabel: "Modo convidado",
    footerAccountLabel: "Conta",
    continueAfterAuth: "Depois da autenticacao vais voltar a esta pagina.",
    validationEmail: "Introduz um email valido.",
    validationPassword: "A palavra-passe deve ter pelo menos 6 caracteres.",
    invalidCredentials: "Email ou palavra-passe incorretos.",
    emailTaken: "Ja existe uma conta com este email.",
    genericError: "A autenticacao falhou. Tenta novamente.",
    authRequired: "Inicia sessao para continuar.",
    authNotConfigured: "A autenticacao ainda nao esta configurada no servidor.",
    signupLinkedMessage: "A nova conta ficou ligada a esta sessao atual, as historias existentes e a qualquer acesso Premium deste navegador."
  },
  zh: {
    badge: "账户",
    siteLabel: SITE_NAME,
    loginTitle: "登录",
    loginSubtitle: "登录后，你的故事、账单和后续 Premium 购买都可以绑定到同一个账户。",
    signupTitle: "创建账户",
    signupSubtitle: "创建正式账户，以便将你的会话、账单和后续 Premium 购买关联到同一个身份。",
    emailLabel: "邮箱",
    passwordLabel: "密码",
    emailPlaceholder: "you@example.com",
    passwordPlaceholder: "输入你的密码",
    loginButton: "登录",
    signupButton: "创建账户",
    switchToLogin: "已经有账户？",
    switchToSignup: "还没有账户？",
    switchLoginLink: "登录",
    switchSignupLink: "创建账户",
    logoutButton: "退出登录",
    accountLink: "账户",
    signedInAs: "当前登录账号",
    footerGuestLabel: "访客模式",
    footerAccountLabel: "账户",
    continueAfterAuth: "登录后你会回到当前页面。",
    validationEmail: "请输入有效的邮箱地址。",
    validationPassword: "密码至少需要 6 个字符。",
    invalidCredentials: "邮箱或密码错误。",
    emailTaken: "该邮箱已经注册过账户。",
    genericError: "认证失败，请重试。",
    authRequired: "请先登录再继续。",
    authNotConfigured: "服务器端还未完成身份验证配置。",
    signupLinkedMessage: "新账户已经与当前会话、现有故事以及此浏览器中的 Premium 权限完成关联。"
  }
};

export function getAuthCopy(locale: SupportedLanguage): AuthCopy {
  return authTranslations[locale] || authTranslations.en;
}
