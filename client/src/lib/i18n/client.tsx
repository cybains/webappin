'use client';
import { createContext, useContext, type ReactNode } from 'react';
import { translate, type Locale, type Messages } from './shared';
const Context = createContext<{locale: Locale; messages: Messages}>({locale:'en',messages:{}});
export function LocaleProvider({locale,messages,children}:{locale:Locale;messages:Messages;children:ReactNode}) { return <Context.Provider value={{locale,messages}}>{children}</Context.Provider>; }
export function useTranslation() { const {locale,messages}=useContext(Context); return {locale,t:(text:string)=>translate(messages,text)}; }

export function localizeValidation(target: EventTarget,locale: Locale,t:(text:string)=>string) { if(locale === 'en' || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return; if(target.validity.valueMissing)target.setCustomValidity(t('Please complete this required field.')); else if(target.validity.typeMismatch)target.setCustomValidity(t('Enter a valid email.')); else if(target.validity.rangeUnderflow || target.validity.stepMismatch)target.setCustomValidity(t('Enter a whole number of drivers, starting from one.')); }
export function clearValidation(target:EventTarget) { if(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)target.setCustomValidity(''); }
