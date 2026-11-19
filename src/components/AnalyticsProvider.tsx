'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, hasAnalyticsConsent, page, trackEvent } from '@/lib/analytics';

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
    page(pathname);
  }, [pathname]);

  useEffect(() => {
    const onConsent = () => {
      if (hasAnalyticsConsent()) page(pathname);
    };
    window.addEventListener('gtrcars-consent-updated', onConsent);
    return () => window.removeEventListener('gtrcars-consent-updated', onConsent);
  }, [pathname]);

  useEffect(() => {
    const milestones = new Set<number>();
    const onScroll = () => {
      const totalHeight = document.documentElement.scrollHeight;
      if (totalHeight <= 0) return;
      const depth = ((window.scrollY + window.innerHeight) / totalHeight) * 100;
      [25, 50, 75, 90].forEach((mark) => {
        if (depth >= mark && !milestones.has(mark)) {
          milestones.add(mark);
          trackEvent(`scroll_${mark}`, { page_path: window.location.pathname });
        }
      });
    };

    const onError = (e: ErrorEvent) =>
      trackEvent('javascript_error', {
        page: window.location.pathname,
        error_type: e.error?.name || 'error',
      });

    const onRejection = () =>
      trackEvent('javascript_error', {
        page: window.location.pathname,
        error_type: 'unhandledrejection',
      });

    const onClick = (event: MouseEvent) => {
      const targetEl = event.target as HTMLElement | null;
      if (!targetEl) return;

      // 1. Medición de canales directos: Teléfono, WhatsApp, Email (#186 WEB 250)
      const anchor = targetEl.closest<HTMLAnchorElement>('a[href]');
      if (anchor) {
        const href = anchor.getAttribute('href') || '';
        if (href.startsWith('tel:')) {
          trackEvent('phone_click', {
            phone: href.replace('tel:', ''),
            location: window.location.pathname,
          });
        } else if (href.startsWith('mailto:')) {
          trackEvent('email_click', {
            email: href.replace('mailto:', ''),
            location: window.location.pathname,
          });
        } else if (href.includes('wa.me') || href.includes('api.whatsapp.com')) {
          trackEvent('whatsapp_click', {
            location: window.location.pathname,
          });
        }
      }

      // 2. Medición de CTAs etiquetados
      const ctaTarget = targetEl.closest<HTMLElement>('[data-analytics-cta]');
      if (ctaTarget) {
        trackEvent('cta_click', {
          cta: ctaTarget.dataset.analyticsCta || ctaTarget.textContent?.trim().slice(0, 80),
          location: window.location.pathname,
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return null;
}
