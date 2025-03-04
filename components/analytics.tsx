"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import Script from "next/script"

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag("config", "G-MEASUREMENT_ID", {
        page_path: pathname,
      })
    }
  }, [pathname])

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MEASUREMENT_ID');
          `,
        }}
      />
    </>
  )
}

