import Script from 'next/script'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['300'] })

export const metadata = {
  title: 'Maxence OS',
  description: 'Maxence OS learn all about Maxence Leroux, his project, experience and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-0PT1GT03VC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0PT1GT03VC');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
