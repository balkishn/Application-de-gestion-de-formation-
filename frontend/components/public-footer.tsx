'use client'
import BrandLogo from '@/components/brand-logo'

export default function PublicFooter() {
  return (
    <footer>
        <div className="flex flex-col  px-5 py-3 sm:px-6 lg:flex-row lg:items-center">

          <div className="scale-50 origin-left text-xl text-emerald-500/80">
            <BrandLogo
              compact
              imageSize={64}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm text-emerald-300/80 ">
            <p className="font-medium text-emerald-300/80">Excellent Training</p>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/80">
              Green Building
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm text-emerald-300/80 lg:items-end">
            <p className="font-medium text-emerald-300/80">info@greenbuilding.com</p>
            <p>Ariana, Tunisie</p>
          </div>
        
      </div>
    </footer>
  )
}