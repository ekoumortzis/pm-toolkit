import Skeleton from './Skeleton'

const PageLayoutSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex fixed lg:sticky inset-y-0 lg:top-0 left-0 z-50 w-64 bg-white border-r border-gray-200 h-screen flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton variant="text" className="w-24 h-6" />
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton variant="avatar" className="w-10 h-10" />
            <div className="flex-1">
              <Skeleton variant="text" className="w-32 h-4 mb-1" />
              <Skeleton variant="text" className="w-40 h-3" />
            </div>
          </div>
          <Skeleton variant="badge" className="w-full h-8" />
        </div>

        {/* Navigation Skeleton */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} variant="button" className="w-full h-10 mb-2" />
            ))}
          </div>
        </nav>

        {/* Logout Button Skeleton */}
        <div className="p-4 border-t border-gray-200">
          <Skeleton variant="button" className="w-full h-12" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile Menu Button Placeholder */}
        <div className="lg:hidden h-20"></div>

        <main className="flex-grow py-8">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton variant="title" className="mb-3 w-1/3" />
              <Skeleton variant="text" className="w-1/2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Skeleton key={item} variant="card" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PageLayoutSkeleton
