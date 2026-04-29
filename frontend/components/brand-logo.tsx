'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  compact?: boolean
  className?: string
  caption?: string
  imageSize?: number
}

export default function BrandLogo({
  compact = false,
  className,
  caption,
  imageSize,
}: BrandLogoProps) {
  const logoSize = imageSize ?? (compact ? 24 : 38)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-white shadow-lg shadow-emerald-950/10">
        <Image
          src="/green-building-logo.jpg"
          alt="Green Building logo"
          width={logoSize}
          height={logoSize}
          className={cn('h-auto w-auto object-contain', compact ? 'rounded-xl' : 'rounded-2xl')}
          priority
        />
      </div>

      <div className="min-w-0">
        <p className={cn('truncate text-emerald-500', compact ? 'text-[20px]' : 'text-sm')}>
        </p>
        {caption ? <p className="truncate text-[20px] text-muted-foreground">{caption}</p> : null}
      </div>
    </div>
  )
}
