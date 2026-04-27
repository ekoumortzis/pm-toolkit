import Skeleton from './Skeleton'

const BriefsListSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex-1">
          <Skeleton variant="title" className="mb-3 w-1/3" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="button" className="h-12 w-40" />
      </div>

      {/* Briefs Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            {/* Title skeleton */}
            <Skeleton variant="title" className="mb-4 w-4/5 h-7" />

            {/* Creator info skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <Skeleton variant="avatar" className="w-8 h-8" />
              <div className="flex-1">
                <Skeleton variant="text" className="w-32 h-3 mb-1" />
                <Skeleton variant="text" className="w-24 h-3" />
              </div>
              <Skeleton variant="badge" className="w-16 h-6" />
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-4" />

            {/* Stats skeleton */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map((stat) => (
                <div key={stat}>
                  <Skeleton variant="text" className="w-full h-3 mb-1" />
                  <Skeleton variant="text" className="w-12 h-4" />
                </div>
              ))}
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-2">
              <Skeleton variant="button" className="flex-1 h-10" />
              <Skeleton variant="button" className="flex-1 h-10" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default BriefsListSkeleton
