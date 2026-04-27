import Skeleton from './Skeleton'

const UsersTableSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton variant="title" className="mb-3 w-1/4" />
        <Skeleton variant="text" className="w-1/3" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-6">
        <Skeleton variant="button" className="w-32 h-10" />
        <Skeleton variant="button" className="w-32 h-10" />
        <Skeleton variant="button" className="w-32 h-10" />
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <Skeleton key={col} variant="text" className="h-4" />
          ))}
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
          <div key={row} className="grid grid-cols-6 gap-4 px-6 py-5 border-b border-gray-100">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <Skeleton variant="avatar" className="w-10 h-10" />
              <div className="flex-1">
                <Skeleton variant="text" className="w-24 h-4 mb-1" />
                <Skeleton variant="text" className="w-32 h-3" />
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center">
              <Skeleton variant="badge" className="w-20 h-6" />
            </div>

            {/* Status */}
            <div className="flex items-center">
              <Skeleton variant="badge" className="w-16 h-6" />
            </div>

            {/* Date */}
            <div className="flex items-center">
              <Skeleton variant="text" className="w-24 h-4" />
            </div>

            {/* Last Active */}
            <div className="flex items-center">
              <Skeleton variant="text" className="w-20 h-4" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default UsersTableSkeleton
