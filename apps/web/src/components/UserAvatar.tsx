import Image from 'next/image'
import { getRandomAvatar } from '@/lib/mockData'

interface UserAvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
}

export function UserAvatar({ 
  src, 
  alt = 'User avatar', 
  size = 'md',
  className = ''
}: UserAvatarProps) {
  const avatarSrc = src || getRandomAvatar()
  const sizeClass = sizeClasses[size]
  
  return (
    <div className={`${sizeClass} relative ${className}`}>
      <Image
        src={avatarSrc}
        alt={alt}
        fill
        className="rounded-full object-cover"
        onError={() => {
          // Fallback to a default avatar if image fails to load
          console.warn('Avatar failed to load:', avatarSrc)
        }}
      />
    </div>
  )
}