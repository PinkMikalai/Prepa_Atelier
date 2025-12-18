import PropTypes from 'prop-types'

const UPLOADS_BASE_URL = 'http://localhost:3000/uploads'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/up'

function VideoPlayer({ video, isDarkMode }) {
  if (!video || !video.id) {
    return (
      <div className="aspect-video bg-mozi-black-light flex items-center justify-center">
        <div className="text-center">
          <svg className="size-24 lg:size-32 text-mozi-grey mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <p className="text-mozi-grey">Aucune vidéo disponible</p>
          <p className="text-mozi-grey text-sm mt-2">Aucune vidéo sélectionnée</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-mozi-black rounded-xl overflow-hidden">
      <video 
        className="w-full aspect-video bg-black"
        controls
        preload="metadata"
        poster={video.thumbnail ? `${UPLOADS_BASE_URL}/img/${video.thumbnail}` : undefined}
        onError={(e) => {
          console.error('Erreur lors du chargement de la vidéo:', e)
          console.log('URL de la vidéo:', video.video_path ? `${UPLOADS_BASE_URL}/videos/${video.video_path}` : `${API_BASE_URL}/videos/${video.id}/file`)
        }}
      >
        {/* Essayer d'abord avec video_path si disponible */}
        {video.video_path && (
          <source 
            src={`${UPLOADS_BASE_URL}/videos/${video.video_path}`} 
            type="video/mp4" 
          />
        )}
        {/* Sinon utiliser la route par ID */}
        <source 
          src={video.video_path ? `${UPLOADS_BASE_URL}/videos/${video.video_path}` : `${API_BASE_URL}/videos/${video.id}/file`} 
          type="video/mp4" 
        />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>
    </div>
  )
}

VideoPlayer.propTypes = {
  video: PropTypes.object,
  isDarkMode: PropTypes.bool.isRequired
}

export default VideoPlayer
