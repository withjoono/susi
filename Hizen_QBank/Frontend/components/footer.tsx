import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/hizen-footer-logo.png"
                alt="Hizen Compass Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">(주)하이젠에이아이</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI 기반 대학 입시 예측 서비스로
              <br />
              학생들의 꿈을 현실로 만들어갑니다.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* 서비스 메뉴 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/prediction/analysis/strategy" className="text-gray-400 hover:text-white transition-colors">
                  지원 전략
                </Link>
              </li>
              <li>
                <Link href="/jungsi/a" className="text-gray-400 hover:text-white transition-colors">
                  정시 예측
                </Link>
              </li>
              <li>
                <Link href="/prediction/susi/subject" className="text-gray-400 hover:text-white transition-colors">
                  수시 예측
                </Link>
              </li>
              <li>
                <Link href="/analysis/grade3/gpa" className="text-gray-400 hover:text-white transition-colors">
                  성적 분석
                </Link>
              </li>
              <li>
                <Link href="/problems/korean" className="text-gray-400 hover:text-white transition-colors">
                  문제은행
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">고객지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support/faq" className="text-gray-400 hover:text-white transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/support/notice" className="text-gray-400 hover:text-white transition-colors">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/support/contact" className="text-gray-400 hover:text-white transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/support/guide" className="text-gray-400 hover:text-white transition-colors">
                  이용가이드
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">연락처</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">010-3438-6090</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">jys@weisenweise.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  서울특별시 강서구
                  <br />
                  공항대로 365 환주빌딩
                </span>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                <div>대표자: 전용석</div>
                <div>사업자등록번호: 461-87-03178</div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">© 2024 (주)하이젠에이아이(HIZEN AI). All rights reserved.</div>
            <div className="flex space-x-6 text-sm">
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors">
                이용약관
              </Link>
              <Link href="/legal/youth" className="text-gray-400 hover:text-white transition-colors">
                청소년보호정책
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
