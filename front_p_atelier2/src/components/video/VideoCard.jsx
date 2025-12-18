import PropTypes from 'prop-types'

const UPLOADS_BASE_URL = 'http://localhost:3000/uploads'

// Fonction pour rendre les étoiles (non-interactive pour la carte)
const renderStars = (rating) => {
  return [...Array(5)].map((_, i) => {
    const starValue = i + 1
    const isFilled = starValue <= (rating || 0)
    
    return (
      <svg 
        key={i} 
        className="size-6 lg:size-7 shrink-0"
        fill={isFilled ? "#FFD700" : "#696D74"} 
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    )
  })
}

function VideoCard({ video, onClick, isDarkMode }) {
  return (
    <div 
      onClick={() => onClick(video)}
      className={`rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 ${
        isDarkMode ? 'bg-mozi-black' : 'bg-white border border-gray-200 shadow-sm'
      }`}
    >
      <div className={`aspect-video flex items-center justify-center relative overflow-hidden ${
        isDarkMode ? 'bg-mozi-black-light' : 'bg-gray-100'
      }`}>
        {video.thumbnail ? (
          <img 
            src={`${UPLOADS_BASE_URL}/img/${video.thumbnail}`} 
            alt={video.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si l'image ne charge pas, masquer l'image
              e.target.style.display = 'none'
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${video.thumbnail ? 'bg-black/30' : ''}`}>
          <svg className={`size-12 lg:size-16 ${isDarkMode ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      <div className="p-3 lg:p-4">
        <h3 className={`font-medium mb-2 line-clamp-2 text-sm lg:text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {video.title}
        </h3>
        <p className={`text-xs lg:text-sm mb-2 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-600'}`}>
          {video.theme}
        </p>
        <div className="flex items-center gap-1.5">
          {renderStars(video.rating)}
        </div>
      </div>
    </div>
  )
}

VideoCard.propTypes = {
  video: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}

export default VideoCard
