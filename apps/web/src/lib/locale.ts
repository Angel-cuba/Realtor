import { cookies } from "next/headers";
import { type Locale, LOCALE_COOKIE } from "@realtor/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "es";
}
