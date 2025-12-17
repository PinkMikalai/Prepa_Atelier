import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/up'

function VideoMeta({ video, isDarkMode }) {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [newPseudo, setNewPseudo] = useState('') // Ajout du state pour le pseudo
  const [videoRatings, setVideoRatings] = useState({})
  const [videoComments, setVideoComments] = useState({})

  // Fonction pour charger les commentaires d'une vidéo
  const fetchComments = async (videoId) => {
    try {
      // Utiliser la nouvelle route : /comments/videos/:video_id
      const response = await fetch(`${API_BASE_URL}/comments/videos/${videoId}`)
      const data = await response.json()
      
      // Le backend retourne { comments, countComments } (pas de success)
      const commentsList = data.comments || []
      setVideoComments(prev => ({
        ...prev,
        [videoId]: commentsList
      }))
      if (video?.id === videoId) {
        setComments(commentsList)
      }
      return commentsList
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error)
      return []
    }
  }

  // Fonction pour charger la note d'une vidéo
  const fetchRating = async (videoId, userId = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/raiting?video_id=${videoId}&user_id=${userId}`)
      const data = await response.json()
      
      if (data.success && data.rating) {
        const userRatingValue = data.rating.user_rating || 0
        setVideoRatings(prev => ({
          ...prev,
          [videoId]: userRatingValue
        }))
        if (video?.id === videoId) {
          setUserRating(userRatingValue)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la note:', error)
    }
  }

  // Charger les commentaires et notes quand la vidéo change
  useEffect(() => {
    if (video?.id) {
      // Charger les commentaires depuis le state ou l'API
      if (videoComments[video.id]) {
        setComments(videoComments[video.id])
      } else {
        setComments([])
        fetchComments(video.id)
      }
      
      // Charger la note depuis le state ou l'API
      if (videoRatings[video.id] !== undefined) {
        setUserRating(videoRatings[video.id])
      } else {
        setUserRating(0)
        fetchRating(video.id)
      }
    } else {
      setComments([])
      setUserRating(0)
    }
  }, [video?.id])

  const handleStarClick = async (rating) => {
    if (!video?.id) return
    
    setUserRating(rating)
    setVideoRatings(prev => ({
      ...prev,
      [video.id]: rating
    }))
    
    // Envoyer la note au backend
    try {
      const response = await fetch(`${API_BASE_URL}/raiting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: video.id,
          rating: rating,
          user_id: 1 // Vous pouvez remplacer par l'ID de l'utilisateur connecté
        })
      })
      
      const data = await response.json()
      if (!data.success) {
        console.error('Erreur lors de l\'enregistrement de la note:', data.message)
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la note:', error)
    }
  }

  const handleStarHover = (rating) => {
    setHoverRating(rating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !video?.id) return
    
    const commentContent = newComment.trim()
    const pseudoValue = newPseudo.trim() || 'Utilisateur' // Utiliser le pseudo saisi ou 'Utilisateur' par défaut
    setNewComment('')
    setNewPseudo('') // Réinitialiser le pseudo
    
    // Créer le commentaire temporairement pour un feedback immédiat
    const tempComment = {
      id: `temp-${Date.now()}`,
      content: commentContent, // Utiliser 'content' au lieu de 'text'
      created_at: new Date().toISOString(),
      video_id: video.id,
      pseudo: pseudoValue
    }
    
    // Ajouter le commentaire au state local (en premier car ordre DESC)
    const updatedComments = [tempComment, ...comments]
    setComments(updatedComments)
    setVideoComments(prev => ({
      ...prev,
      [video.id]: updatedComments
    }))
    
    // Envoyer le commentaire au backend
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: video.id,
          pseudo: pseudoValue,
          content: commentContent // Utiliser 'content' au lieu de 'text'
        })
      })
      
      if (response.ok) {
        // Le backend retourne juste l'ID, on recharge les commentaires pour avoir les données complètes
        await fetchComments(video.id)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de l\'ajout du commentaire')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
      // En cas d'erreur, recharger les commentaires pour retirer le temporaire
      await fetchComments(video.id)
      alert('Erreur lors de l\'ajout du commentaire. Veuillez réessayer.')
    }
  }

  const renderStars = (rating, interactive = false) => {
    const displayRating = interactive ? (hoverRating || userRating) : rating
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1
      const isFilled = starValue <= displayRating
      
      return (
        <svg 
          key={i} 
          className={`size-6 lg:size-7 shrink-0 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
          fill={isFilled ? "#FFD700" : "#696D74"} 
          viewBox="0 0 24 24"
          onClick={interactive ? () => handleStarClick(starValue) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starValue) : undefined}
          onMouseLeave={interactive ? handleStarLeave : undefined}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    })
  }

  if (!video) return null

  return (
    <div className="bg-mozi-black rounded-xl p-6 lg:p-8">
      <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-3 lg:mb-4">{video.title}</h1>
      <p className="text-mozi-grey mb-4 lg:mb-6 text-base lg:text-lg">{video.theme}</p>
      <p className="text-white mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">{video.description}</p>
      
      {/* Système de notation */}
      <div className="border-t border-mozi-black-light pt-6 lg:pt-8 mb-6 lg:mb-8">
        <h3 className="text-white font-medium mb-4 lg:mb-6 text-lg lg:text-xl">Noter cette vidéo</h3>
        <div className="flex items-center gap-2">
          {renderStars(userRating || 0, true)}
          {userRating > 0 && (
            <span className="text-mozi-grey-light text-sm lg:text-base ml-2">
              Vous avez noté {userRating}/5
            </span>
          )}
          {userRating === 0 && (
            <span className="text-mozi-grey text-sm lg:text-base ml-2">
              Note moyenne: {video.rating || 0}/5
            </span>
          )}
        </div>
      </div>
      
      {/* Formulaire de commentaire */}
      <div className="border-t border-mozi-black-light pt-6 lg:pt-8">
        <h3 className="text-white font-medium mb-4 lg:mb-6 text-lg lg:text-xl">Ajouter un commentaire</h3>
        <form onSubmit={handleAddComment} className="mb-6 lg:mb-8 space-y-4">
          {/* Champ pseudo */}
          <input
            type="text"
            value={newPseudo}
            onChange={(e) => setNewPseudo(e.target.value)}
            placeholder="Votre pseudo (optionnel)"
            className={`w-full rounded-lg px-4 py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-mozi-active ${
              isDarkMode 
                ? 'bg-mozi-black-light text-white placeholder-mozi-grey border border-mozi-black' 
                : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
            }`}
          />
          {/* Champ commentaire */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez votre commentaire..."
            className={`w-full rounded-lg px-4 py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-mozi-active resize-none ${
              isDarkMode 
                ? 'bg-mozi-black-light text-white placeholder-mozi-grey border border-mozi-black' 
                : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
            }`}
            rows="3"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-mozi-active text-white rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2"
          >
            Publier
          </button>
        </form>
        
        {/* Liste des commentaires */}
        <div>
          <h3 className="text-white font-medium mb-4 lg:mb-6 text-lg lg:text-xl">
            Commentaires {comments.length > 0 && `(${comments.length})`}
          </h3>
          {comments.length === 0 ? (
            <p className="text-mozi-grey text-sm lg:text-base">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
          ) : (
            <div className="space-y-4 lg:space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-mozi-black-light rounded-lg p-4 lg:p-5">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-mozi-active font-medium text-sm lg:text-base">
                      {comment.pseudo || 'Utilisateur'}
                    </p>
                    <p className="text-mozi-grey text-xs lg:text-sm">
                      {comment.created_at 
                        ? new Date(comment.created_at).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : comment.date || 'Date inconnue'}
                    </p>
                  </div>
                  <p className="text-white text-sm lg:text-base">{comment.content || comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

VideoMeta.propTypes = {
  video: PropTypes.object,
  isDarkMode: PropTypes.bool.isRequired
}

export default VideoMeta
