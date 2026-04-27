import Skeleton from './Skeleton'

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Skeleton variant="title" className="mb-3 w-1/4" />
        <Skeleton variant="text" className="w-1/3" />
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* User Avatar & Name Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <Skeleton variant="avatar" className="w-24 h-24" />
          <div className="flex-1">
            <Skeleton variant="title" className="mb-2 w-1/3" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton variant="text" className="w-24 h-4" />
              <Skeleton variant="input" />
            </div>
          ))}
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <Skeleton variant="button" className="w-40 h-12" />
          <Skeleton variant="button" className="w-40 h-12" />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg border border-red-200 p-8">
        <Skeleton variant="title" className="mb-4 w-1/4 h-6" />
        <Skeleton variant="text" className="w-2/3 mb-6" />
        <Skeleton variant="button" className="w-48 h-12" />
      </div>
    </div>
  )
}

export default ProfileSkeleton
