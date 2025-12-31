"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "생기부 분석",
    items: [
      { title: "생기부입력", href: "/analysis/record-input" },
      { title: "교과분석", href: "/analysis/subject-analysis" },
      { title: "비교과분석", href: "/analysis/extracurricular-analysis" },
      { title: "교과 예측", href: "/analysis/subject-prediction" },
      { title: "종합 예측", href: "/analysis/comprehensive-prediction" },
      { title: "목표대학", href: "/analysis/target-universities" },
    ],
  },
  {
    title: "모의고사 분석",
    items: [
      { title: "성적입력", href: "/mock-analysis/score-input" },
      { title: "성적분석", href: "/mock-analysis/score-analysis" },
      { title: "대학예측", href: "/mock-analysis/prediction" },
      { title: "목표대학", href: "/mock-analysis/target-universities" },
    ],
  },
  {
    title: "수시 합격 예측",
    items: [
      { title: "생기부입력", href: "/susi/record-input" },
      { title: "생기부분석", href: "/susi/record-analysis" },
      { title: "모의성적 입력/분석", href: "/susi/mock-score-analysis" },
      { title: "수시/정시 지원 전략", href: "/prediction/analysis/strategy" },
      { title: "교과 예측", href: "/prediction/susi/subject" },
      { title: "종합 예측", href: "/prediction/susi/comprehensive" },
      { title: "논술 지원전략", href: "/prediction/susi/essay" },
      { title: "관심대학", href: "/susi/favorite-universities" },
      { title: "조합짜기", href: "/susi/combination" },
      { title: "모의지원", href: "/susi/mock-application" },
    ],
  },
  {
    title: "정시 합격 예측",
    items: [
      { title: "성적입력", href: "/jungsi/score-input" },
      { title: "생기부입력", href: "/jungsi/record-input" },
      { title: "수능성적분석", href: "/jungsi/csat-analysis" },
      { title: "생기부분석", href: "/jungsi/record-analysis" },
      { title: "정시Vs수시", href: "/jungsi/vs-susi" },
      { title: "가군 예측", href: "/jungsi/a" },
      { title: "나군 예측", href: "/jungsi/b" },
      { title: "다군 예측", href: "/jungsi/c" },
      { title: "군외 예측", href: "/jungsi/outside" },
      { title: "관심대학", href: "/jungsi/favorite-universities" },
      { title: "조합짜기", href: "/jungsi/combination" },
      { title: "모의지원", href: "/jungsi/mock-application" },
    ],
  },
  {
    title: "문제은행",
    items: [
      { title: "국어", href: "/problems/korean" },
      { title: "영어", href: "/problems/english" },
      { title: "수학", href: "/problems/math" },
      { title: "과학", href: "/problems/science" },
    ],
  },
]

export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMenuEnter = (menuTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setActiveMenu(menuTitle)
  }

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 300)
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/images/hizen-compass-logo.png"
                alt="Hizen Compass Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-gray-900">hizen compass</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex space-x-1">
            {menuItems.map((menu) => (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => handleMenuEnter(menu.title)}
                onMouseLeave={handleMenuLeave}
              >
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                  {menu.title}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === menu.title && (
                  <div
                    className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => handleMenuEnter(menu.title)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {menu.items.map((item) => (
                      <div key={item.title || item.href}>
                        {item.subitems ? (
                          // Multi-level menu
                          <div className="px-4 py-2">
                            <div className="font-medium text-gray-900 text-sm mb-2 border-b border-gray-100 pb-1">
                              {item.title}
                            </div>
                            <div className="space-y-1 ml-2">
                              {item.subitems.map((subitem) => (
                                <Link
                                  key={subitem.href}
                                  href={subitem.href}
                                  className="block px-2 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                  {subitem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          // Single-level menu
                          <Link
                            href={item.href!}
                            className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button & Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
              로그인
            </Button>
            <Button size="sm" className="hidden sm:inline-flex">
              회원가입
            </Button>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
