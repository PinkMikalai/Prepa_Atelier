import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import UploadProgress from './UploadProgress'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/up'

// Mapping des thèmes vers leurs IDs
const themeMapping = {
  'Humour': 1,
  'Drame': 2,
  'Thriller': 3,
  'Suspense': 4,
  'Horreur': 5,
  'Romance': 6,
  'Science-fiction': 7,
  'Fantastique': 8,
  'Documentaire': 9,
  'Animation': 10,
  'Expérimentale': 11,
  'Aventure': 12,
  'Action': 13,
  'Motivation': 14,
  'Parodie': 15,
  'Clip': 16,
  'DIY': 17
}

const themes = [
  'Humour',
  'Drame',
  'Thriller',
  'Suspense',
  'Horreur',
  'Romance',
  'Science-fiction',
  'Fantastique',
  'Documentaire',
  'Animation',
  'Expérimentale',
  'Aventure',
  'Action',
  'Motivation',
  'Parodie',
  'Clip',
  'DIY'
]

function UploadForm({ onUploadSuccess, isDarkMode, themeDropdownRef, isThemeDropdownOpen, setIsThemeDropdownOpen }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pseudo: ''
  })
  const [videoFile, setVideoFile] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState('')
  const [videoProgress, setVideoProgress] = useState(0)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const videoFileInputRef = useRef(null)

  // Fonction pour gérer la sélection de fichier vidéo
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/quicktime']
      if (!allowedTypes.includes(file.type)) {
        alert('Format de vidéo non supporté. Formats acceptés: MP4, WebM, AVI, QuickTime')
        return
      }
      
      // Vérifier la taille (max 500 Mo)
      const maxSize = 500 * 1024 * 1024 // 500 Mo
      if (file.size > maxSize) {
        alert('Vidéo trop volumineuse. Taille maximale: 500 Mo')
        return
      }
      
      setVideoFile(file)
    }
  }

  // Fonction pour déclencher le sélecteur de fichier
  const triggerFileInput = () => {
    videoFileInputRef.current?.click()
  }

  // Fonction pour soumettre le formulaire d'upload
  const handleSubmitUpload = async (e) => {
    e.preventDefault()
    
    if (!videoFile) {
      alert('Veuillez sélectionner une vidéo')
      return
    }
    
    if (!formData.title || !formData.title.trim()) {
      alert('Veuillez saisir un titre')
      return
    }
    
    if (!selectedTheme) {
      alert('Veuillez sélectionner un thème')
      return
    }

    const themeId = themeMapping[selectedTheme]
    if (!themeId) {
      alert('Thème invalide')
      return
    }

    try {
      setIsUploadingVideo(true)
      setVideoProgress(0)

      // Créer FormData pour l'upload multipart/form-data
      const formDataToSend = new FormData()
      formDataToSend.append('video', videoFile)
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim() || '')
      formDataToSend.append('pseudo', formData.pseudo.trim() || 'Utilisateur')
      formDataToSend.append('theme_id', themeId.toString())

      // Upload avec suivi de progression
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          setVideoProgress(Math.round(percentComplete))
        }
      })

      xhr.addEventListener('load', async () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText)
          console.log('Vidéo uploadée avec succès:', response)
          
          // Réinitialiser le formulaire
          setFormData({ title: '', description: '', pseudo: '' })
          setVideoFile(null)
          setSelectedTheme('')
          setVideoProgress(0)
          setIsUploadingVideo(false)
          
          // Réinitialiser l'input file
          if (videoFileInputRef.current) {
            videoFileInputRef.current.value = ''
          }
          
          // Appeler le callback de succès
          if (onUploadSuccess) {
            onUploadSuccess()
          }
        } else {
          const errorData = JSON.parse(xhr.responseText)
          throw new Error(errorData.message || 'Erreur lors de l\'upload')
        }
      })

      xhr.addEventListener('error', () => {
        console.error('Erreur lors de l\'upload')
        setIsUploadingVideo(false)
        alert('Erreur lors de l\'upload de la vidéo. Vérifiez votre connexion.')
      })

      xhr.open('POST', `${API_BASE_URL}/videos`)
      xhr.send(formDataToSend)

    } catch (error) {
      console.error('Erreur:', error)
      setIsUploadingVideo(false)
      alert(error.message || 'Erreur lors de l\'upload')
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <h2 className={`text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
        Upload de vidéo
      </h2>
      
      <form onSubmit={handleSubmitUpload} className={`rounded-xl p-6 lg:p-8 space-y-6 lg:space-y-8 bg-white border border-gray-300`}>
        {/* Titre */}
        <div>
          <label className={`block mb-2 text-sm lg:text-base font-medium text-mozi-black`}>
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm lg:text-base border border-gray-300 text-mozi-black focus:outline-none focus:ring-2 focus:ring-mozi-active"
            placeholder="Entrez le titre de la vidéo"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block mb-2 text-sm lg:text-base font-medium text-mozi-black`}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm lg:text-base border border-gray-300 text-mozi-black focus:outline-none focus:ring-2 focus:ring-mozi-active resize-none"
            rows="4"
            placeholder="Décrivez votre vidéo"
          />
        </div>

        {/* Pseudo */}
        <div>
          <label className={`block mb-2 text-sm lg:text-base font-medium text-mozi-black`}>
            Pseudo
          </label>
          <input
            type="text"
            value={formData.pseudo}
            onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm lg:text-base border border-gray-300 text-mozi-black focus:outline-none focus:ring-2 focus:ring-mozi-active"
            placeholder="Votre pseudo"
          />
        </div>

        {/* Thème */}
        <div className="relative" ref={themeDropdownRef}>
          <label className={`block mb-2 text-sm lg:text-base font-medium text-mozi-black`}>
            Thème *
          </label>
          <button
            type="button"
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className={`w-full rounded-lg px-4 py-3 text-sm lg:text-base border border-gray-300 text-left flex items-center justify-between text-mozi-black focus:outline-none focus:ring-2 focus:ring-mozi-active ${
              selectedTheme ? 'bg-white' : 'bg-white'
            }`}
          >
            <span>{selectedTheme || 'Sélectionnez un thème'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out ${
              isThemeDropdownOpen 
                ? 'opacity-100 translate-y-0 visible' 
                : 'opacity-0 -translate-y-2 invisible'
            } bg-white border-gray-300`}
          >
            <div className="py-1">
              {themes.map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => {
                    setSelectedTheme(theme)
                    setIsThemeDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                    selectedTheme === theme 
                      ? 'bg-mozi-active/20 text-mozi-active font-medium' 
                      : 'text-mozi-black hover:bg-gray-100'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sélection de fichier vidéo */}
        <div>
          <label className={`block mb-2 text-sm lg:text-base font-medium text-mozi-black`}>
            Vidéo *
          </label>
          <input
            ref={videoFileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full rounded-lg px-4 py-3 text-sm lg:text-base border-2 border-dashed border-gray-300 text-mozi-black hover:border-mozi-active hover:bg-mozi-active/5 transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active"
          >
            {videoFile ? videoFile.name : 'Cliquez pour sélectionner une vidéo'}
          </button>
        </div>

        {/* Barre de progression */}
        {isUploadingVideo && (
          <UploadProgress progress={videoProgress} />
        )}

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData({ title: '', description: '', pseudo: '' })
              setVideoFile(null)
              setSelectedTheme('')
              if (videoFileInputRef.current) {
                videoFileInputRef.current.value = ''
              }
            }}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isUploadingVideo}
            className="flex-1 px-6 py-3 bg-mozi-active text-white rounded-lg hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploadingVideo ? 'Upload en cours...' : 'Publier la vidéo'}
          </button>
        </div>
      </form>
    </div>
  )
}

UploadForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  themeDropdownRef: PropTypes.object.isRequired,
  isThemeDropdownOpen: PropTypes.bool.isRequired,
  setIsThemeDropdownOpen: PropTypes.func.isRequired
}

export default UploadForm
