export interface JhiCompatConfig {
  alertAsToast: boolean;
  alertTimeout: number;
  i18nEnabled: boolean;
  defaultI18nLang: string;
  noi18nMessage: string;
}

export const MANAGERCARE_CONFIG: JhiCompatConfig = {
  alertAsToast: false,
  alertTimeout: 5000,
  i18nEnabled: true,
  defaultI18nLang: 'es',
  noi18nMessage: 'translation-not-found'
};
