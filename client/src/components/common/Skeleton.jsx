const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'

  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-32 rounded-lg',
    card: 'h-64 w-full rounded-2xl',
    input: 'h-12 w-full rounded-lg',
    badge: 'h-6 w-20 rounded-full'
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  )
}

export default Skeleton
