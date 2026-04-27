const PageHeader = ({ icon: Icon, title, subtitle, actions }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 mb-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="flex-shrink-0">
              <Icon size={28} className="text-gray-900" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-gray-600 text-sm leading-tight">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
