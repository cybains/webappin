import german from './de.json';
import czech from './cs.json';
import { translate, type Locale, type Messages } from './shared';
export function getMessages(locale: Locale): Messages { return locale === 'de' ? german : locale === 'cs' ? czech : {}; }
export function getTranslator(locale: Locale) { const messages = getMessages(locale); return (text: string) => translate(messages, text); }
