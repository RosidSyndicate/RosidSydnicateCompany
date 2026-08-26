declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''

// Initialize GA script in document head
export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID) return

  // Prevent multiple injections
  if (document.getElementById('ga-script')) return

  const script = document.createElement('script')
  script.id = 'ga-script'
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(..._args: any[]) {
    // @ts-ignore
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  })
}

// Track page views
export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
  })
}

// Track specific custom events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return
  window.gtag('event', eventName, eventParams)
}
