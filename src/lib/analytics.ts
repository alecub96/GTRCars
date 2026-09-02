export type AnalyticsEvent = string;
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;
const CONSENT_KEY = 'vaneando-cookie-consent';

export function hasAnalyticsConsent() { return typeof window !== 'undefined' && window.localStorage.getItem(CONSENT_KEY) === 'all'; }
export function trackEvent(name: AnalyticsEvent, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return false;
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined));
  const payload = { event: name, ...cleanParams };
  window.dispatchEvent(new CustomEvent('vaneando-analytics', { detail: payload }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, cleanParams);
  if (process.env.NODE_ENV === 'development') console.debug('[analytics]', { event: name, provider: 'GA4', page: window.location.pathname, status: 'sent' });
  return true;
}
export function page(path = window.location.pathname) { return trackEvent('page_view', { page_location: window.location.href, page_path: path }); }
export const analytics = {
  track: trackEvent, page,
  conversion: (name = 'conversion', params: AnalyticsParams = {}) => trackEvent(name, { ...params, conversion: true }),
  ctaClick: (cta: string, location?: string) => trackEvent('cta_click', { cta, location }),
  formStart: (form: string, step?: string | number) => trackEvent('form_start', { form, step }),
  formStep: (form: string, step: string | number) => trackEvent('form_step', { form, step }),
  formError: (form: string, field?: string, errorType?: string) => trackEvent('form_error', { form, field, error_type: errorType }),
  formSubmit: (form: string) => trackEvent('form_submit', { form }), formSuccess: (form: string) => trackEvent('form_success', { form }),
};
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const query = new URLSearchParams(window.location.search), keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','msclkid'];
  const found = Object.fromEntries(keys.filter((key) => query.get(key)).map((key) => [key, query.get(key)]));
  if (Object.keys(found).length) window.localStorage.setItem('vaneando-attribution', JSON.stringify({ ...found, landing_page: window.location.pathname, captured_at: new Date().toISOString() }));
}
