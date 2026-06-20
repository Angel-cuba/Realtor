export type Locale = "es" | "en";

export type Messages = {
  nav: {
    buy: string;
    rent: string;
    sell: string;
    market: string;
    profile: string;
    listProperty: string;
    dashboard: string;
    explore: string;
    saved: string;
    signIn: string;
    signOut: string;
  };
  search: {
    locationLabel: string;
    locationPlaceholder: string;
    operationLabel: string;
    budgetLabel: string;
    operationBuy: string;
    operationRent: string;
    budgetAny: string;
    budget500k: string;
    budget1m: string;
    budget1mPlus: string;
    submit: string;
  };
  listing: {
    noResults: string;
    beds: string;
    baths: string;
    sqft: string;
    pageOf: string;
    prev: string;
    next: string;
    perMonth: string;
  };
  leadForm: {
    titleVisit: string;
    titleAdvisor: string;
    signInPromptVisit: string;
    signInPromptAdvisor: string;
    signIn: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBodyBuy: string;
    successBodyRent: string;
    successBodySell: string;
    errorMessage: string;
    backToBuy: string;
    backToRent: string;
    backToHome: string;
    loadingLabel: string;
  };
  pages: {
    buyKicker: string;
    buyHeading: string;
    rentKicker: string;
    rentHeading: string;
  };
  mobile: {
    buy: string;
    sell: string;
    rent: string;
    saved: string;
    profile: string;
    explore: string;
    marketActive: string;
    language: string;
    languageLabel: string;
    back: string;
    signIn: string;
    signOut: string;
  };
};
