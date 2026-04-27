import Skeleton from './Skeleton'

const ContentSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="title" className="mb-3 w-1/3" />
        <Skeleton variant="text" className="w-1/2" />
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {[1, 2, 3].map((section) => (
          <div key={section} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            {/* Section Title */}
            <Skeleton variant="title" className="mb-4 w-1/2 h-6" />

            {/* Section Content */}
            <div className="space-y-3">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-11/12" />
              <Skeleton variant="text" className="w-full" />
              <Skeleton variant="text" className="w-10/12" />
            </div>

            {/* Sub-items */}
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4">
                  <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" className="w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ContentSkeleton
