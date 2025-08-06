import FeatureHightlight from "@/components/ui/feature-highlight"
import MainLogo from "@/components/main-logo"
import CTAButtons, { CTAButtonsType } from "@/components/cta-buttons"
import UserAuth from "@/components/user-auth"

export default function HomePage() {
  const ctaButtons: { type: CTAButtonsType }[] = [
    { type: 'code' },
    { type: 'post' },
    { type: 'rank' }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.01)_50%,transparent_51%)] bg-[length:100px_100px]"></div>
      </div>
      {/* Hero section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-10">
        <div className="w-full max-w-6xl text-center">
          {/* Main logo and title */}
          <MainLogo />
          {/* User Auth */}
          <UserAuth />
          {/* CTA Buttons */}
          <CTAButtons buttons={ctaButtons} />
          {/* Feature highlights */}
          <FeatureHightlight />
        </div>
      </section>
    </div>
  )
}