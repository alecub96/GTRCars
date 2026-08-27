export type AnalyticsEvent =
  | 'social_profile_click' | 'social_share_click' | 'vehicle_share' | 'owner_share'
  | 'listing_view' | 'search_started' | 'booking_started' | 'booking_completed'
  | 'whatsapp_clicked' | 'owner_signup_started' | 'owner_listing_started'
  | 'owner_listing_published' | 'language_changed' | 'social_campaign_visit';

export function trackEvent(name: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const payload = { event: name, ...params };
  window.dispatchEvent(new CustomEvent('vaneando-analytics', { detail: payload }));
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}
