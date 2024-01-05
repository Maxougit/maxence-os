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
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
