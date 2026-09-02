'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, hasAnalyticsConsent, page, trackEvent } from '@/lib/analytics';
export default function AnalyticsProvider() {
  const pathname = usePathname();
  useEffect(() => {
    captureAttribution(); if (!hasAnalyticsConsent()) return; page(pathname);
  }, [pathname]);
  useEffect(() => {
    const onConsent = () => { if (hasAnalyticsConsent()) page(pathname); };
    window.addEventListener('vaneando-consent-updated', onConsent);
    return () => window.removeEventListener('vaneando-consent-updated', onConsent);
  }, [pathname]);
  useEffect(() => {
    if (!hasAnalyticsConsent()) return;
    const milestones = new Set<number>();
    const onScroll = () => { const depth = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100; [25,50,75,90].forEach((mark) => { if (depth >= mark && !milestones.has(mark)) { milestones.add(mark); trackEvent(`scroll_${mark}`); } }); };
    const onError = (e: ErrorEvent) => trackEvent('javascript_error', { page: window.location.pathname, error_type: e.error?.name || 'error' });
    const onRejection = () => trackEvent('javascript_error', { page: window.location.pathname, error_type: 'unhandledrejection' });
    const onClick = (event: MouseEvent) => { const target = (event.target as HTMLElement).closest<HTMLElement>('[data-analytics-cta]'); if (target) trackEvent('cta_click', { cta: target.dataset.analyticsCta || target.textContent?.trim().slice(0, 80), location: window.location.pathname }); };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('error', onError); window.addEventListener('unhandledrejection', onRejection); window.addEventListener('click', onClick);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('error', onError); window.removeEventListener('unhandledrejection', onRejection); window.removeEventListener('click', onClick); };
  }, []);
  return null;
}
