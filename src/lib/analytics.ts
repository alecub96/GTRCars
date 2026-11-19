export type AnalyticsEvent = string;
export type AnalyticsParams = Record<string, string | number | boolean | undefined>;
const CONSENT_KEY = 'gtrcars-cookie-consent';

export function hasAnalyticsConsent() {
  return typeof window !== 'undefined' && window.localStorage.getItem(CONSENT_KEY) === 'all';
}

export function trackEvent(name: AnalyticsEvent, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined') return false;
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
  const payload = { event: name, ...cleanParams };
  window.dispatchEvent(new CustomEvent('gtrcars-analytics', { detail: payload }));

  // Forward custom event to Microsoft Clarity (Heatmaps & Session Recordings)
  const clarity = (window as Window & { clarity?: (...args: unknown[]) => void }).clarity;
  if (typeof clarity === 'function') {
    try {
      clarity('event', name);
      Object.entries(cleanParams).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          clarity('set', k, String(v));
        }
      });
    } catch {}
  }

  // Forward to Google Analytics 4 (GA4 / GTM) when consent is granted or for essential funnel signals
  if (hasAnalyticsConsent()) {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', name, cleanParams);
    }
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', {
      event: name,
      provider: 'GA4+Clarity',
      page: window.location.pathname,
      params: cleanParams,
    });
  }
  return true;
}

export function page(path = typeof window !== 'undefined' ? window.location.pathname : '/') {
  if (typeof window === 'undefined') return false;
  return trackEvent('page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
}

export const analytics = {
  track: trackEvent,
  page,
  conversion: (name = 'conversion', params: AnalyticsParams = {}) =>
    trackEvent(name, { ...params, conversion: true }),
  purchase: (bookingId: string, value: number, vehicleTitle?: string) =>
    trackEvent('purchase', {
      transaction_id: bookingId,
      value,
      currency: 'EUR',
      item_name: vehicleTitle || 'Supercar Rental',
      conversion: true,
    }),
  beginCheckout: (vehicleId: string, value?: number, days?: number) =>
    trackEvent('begin_checkout', {
      vehicle_id: vehicleId,
      value,
      currency: 'EUR',
      rental_days: days,
    }),
  ctaClick: (cta: string, location?: string) => trackEvent('cta_click', { cta, location }),
  formStart: (form: string, step?: string | number) => trackEvent('form_start', { form, step }),
  formStep: (form: string, step: string | number) => trackEvent('form_step', { form, step }),
  formError: (form: string, field?: string, errorType?: string) =>
    trackEvent('form_error', { form, field, error_type: errorType }),
  formSubmit: (form: string) => trackEvent('form_submit', { form }),
  formSuccess: (form: string) => trackEvent('form_success', { form, conversion: true }),
};

export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const query = new URLSearchParams(window.location.search);
  const keys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'gclid',
    'fbclid',
    'msclkid',
  ];
  const found = Object.fromEntries(
    keys.filter((key) => query.get(key)).map((key) => [key, query.get(key)])
  );
  if (Object.keys(found).length) {
    window.localStorage.setItem(
      'gtrcars-attribution',
      JSON.stringify({
        ...found,
        landing_page: window.location.pathname,
        referrer: document.referrer || 'direct',
        captured_at: new Date().toISOString(),
      })
    );
  }
}
