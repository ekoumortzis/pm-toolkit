import Skeleton from './Skeleton'

const DashboardSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="title" className="mb-3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>

      {/* Tools Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {/* Icon skeleton */}
            <Skeleton className="w-16 h-16 rounded-xl mb-5" />

            {/* Title skeleton */}
            <Skeleton variant="title" className="mb-3 w-3/4" />

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default DashboardSkeleton
