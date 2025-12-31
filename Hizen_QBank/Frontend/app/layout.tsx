import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "hizen compass - AI 기반 대학 입시 합격 예측 서비스",
  description: "수시와 정시 모든 전형의 합격 가능성을 정확하게 예측하고, 나에게 맞는 최적의 입시 전략을 제시합니다.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
