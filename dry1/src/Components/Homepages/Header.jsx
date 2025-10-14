const Header = () => {
  return (
    <div className="w-full bg-green-700 text-white py-1 sm:py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        <div className="flex shrink-0">
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0">
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
          <span className="px-2 sm:px-4 md:px-8 text-xs sm:text-sm font-medium">Reduced MRPs post GST Revision! •</span>
        </div>
      </div>
    </div>
  )
}

export default Header