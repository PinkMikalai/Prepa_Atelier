import { useState, useEffect, useRef } from 'react'
import './App.css'
import logo from './assets/images/logo.png'
import VideoCard from './components/video/VideoCard'
import VideoPlayer from './components/video/VideoPlayer'
import VideoMeta from './components/video/VideoMeta'
import UploadForm from './components/upload/UploadForm'

// Configuration API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/up'
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads' // URL pour les fichiers uploadés

// Mapping des thèmes vers leurs IDs (vous devrez adapter selon votre base de données)
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

function App() {
  const [currentView, setCurrentView] = useState('list') // 'list', 'upload', 'detail'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videos, setVideos] = useState([]) // Tableau vide au départ
  const [isLoadingVideos, setIsLoadingVideos] = useState(false) // État de chargement des vidéos
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false) // État ouverture menu déroulant
  const themeDropdownRef = useRef(null) // Référence pour le menu déroulant
  const [selectedFilterTheme, setSelectedFilterTheme] = useState('') // Thème filtré dans le header
  const [selectedFilterNote, setSelectedFilterNote] = useState('') // Note filtrée dans le header
  const [selectedFilterDate, setSelectedFilterDate] = useState('') // Date filtrée dans le header
  const [isFilterThemeOpen, setIsFilterThemeOpen] = useState(false) // État ouverture menu Theme
  const [isFilterNoteOpen, setIsFilterNoteOpen] = useState(false) // État ouverture menu Note
  const [isFilterDateOpen, setIsFilterDateOpen] = useState(false) // État ouverture menu Date
  const filterThemeRef = useRef(null) // Référence pour le menu Theme
  const filterNoteRef = useRef(null) // Référence pour le menu Note
  const filterDateRef = useRef(null) // Référence pour le menu Date
  const [isDarkMode, setIsDarkMode] = useState(true) // Mode dark/light (par défaut dark)
  const [searchText, setSearchText] = useState('')

  // Charger les vidéos au démarrage
  useEffect(() => {
    fetchVideos()
  }, [])

  // Fonction pour mélanger aléatoirement un tableau (algorithme Fisher-Yates)
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Fonction pour récupérer toutes les vidéos
  const fetchVideos = async () => {
    setIsLoadingVideos(true)
    try {
      const params = new URLSearchParams()

      if (searchText) params.append('search', searchText)
      if (selectedFilterDate) params.append('date', selectedFilterDate)
      if (selectedFilterNote) params.append('rating', selectedFilterNote)

      // Conversion Nom du Thème -> ID
      if (selectedFilterTheme && themeMapping[selectedFilterTheme]) {
        params.append('theme_id', themeMapping[selectedFilterTheme])
      }
      const response = await fetch(`${API_BASE_URL}/videos?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        console.log('Vidéos reçues:', data.videos) // Debug
        // Mapper les vidéos pour s'assurer qu'elles ont les bons champs
        const mappedVideos = (data.videos || []).map(video => {
          // Extraire le nom du fichier thumbnail si c'est un chemin complet
          let thumbnailName = video.thumbnail || video.thumbnail_path || video.thumbnail_url
          if (thumbnailName && thumbnailName.includes('/')) {
            thumbnailName = thumbnailName.split('/').pop()
          }

          return {
            ...video,
            // Si video_path n'existe pas, essayer d'autres noms possibles
            video_path: video.video_path || video.video_url || video.filename || video.file_name,
            // S'assurer que thumbnail existe (juste le nom du fichier)
            thumbnail: thumbnailName
          }
        })
        setVideos(mappedVideos)
      } else {
        console.error('Erreur lors de la récupération des vidéos:', data.message)
      }
    } catch (error) {
      console.error('Erreur API lors du chargement des vidéos:', error)
    } finally {
      setIsLoadingVideos(false)
    }
  }
useEffect(() => {
  fetchVideos()
}, [searchText, selectedFilterTheme, selectedFilterNote, selectedFilterDate])

  // Fermer les menus déroulants quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false)
      }
      if (filterThemeRef.current && !filterThemeRef.current.contains(event.target)) {
        setIsFilterThemeOpen(false)
      }
      if (filterNoteRef.current && !filterNoteRef.current.contains(event.target)) {
        setIsFilterNoteOpen(false)
      }
      if (filterDateRef.current && !filterDateRef.current.contains(event.target)) {
        setIsFilterDateOpen(false)
      }
    }

    if (isThemeDropdownOpen || isFilterThemeOpen || isFilterNoteOpen || isFilterDateOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isThemeDropdownOpen, isFilterThemeOpen, isFilterNoteOpen, isFilterDateOpen])

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

  const noteOptions = [
    { value: '5', label: '5 étoiles' },
    { value: '4', label: '4 étoiles et plus' },
    { value: '3', label: '3 étoiles et plus' },
    { value: '2', label: '2 étoiles et plus' },
    { value: '1', label: '1 étoile et plus' }
  ]

  const dateOptions = [
    { value: 'recent', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ]

  const handleVideoClick = async (video) => {
    setSelectedVideo(video)
    setCurrentView('detail')

    // Optionnel : Recharger les détails depuis l'API pour avoir les données à jour
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${video.id}`)
      const data = await response.json()

      if (data.success && data.video) {
        // Mapper la vidéo pour s'assurer qu'elle a les bons champs
        let thumbnailName = data.video.thumbnail || data.video.thumbnail_path || data.video.thumbnail_url
        if (thumbnailName && thumbnailName.includes('/')) {
          thumbnailName = thumbnailName.split('/').pop()
        }

        const mappedVideo = {
          ...data.video,
          video_path: data.video.video_path || data.video.video_url || data.video.filename || data.video.file_name,
          thumbnail: thumbnailName
        }
        console.log('Vidéo sélectionnée:', mappedVideo) // Debug
        setSelectedVideo(mappedVideo)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la vidéo:', error)
    }
  }

  const handleUploadSuccess = async () => {
    // Recharger la liste des vidéos
    await fetchVideos()
    // Retourner à la liste
    setCurrentView('list')
    alert('Vidéo uploadée avec succès !')
  }

  return (
    <div className={`flex min-h-screen w-full w-screen overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-mozi-black-light via-mozi-black to-[#0f1115]' : 'bg-gray-50'}`}>
      {/* Sidebar Gauche - Élargie sur PC */}
      <aside className={`w-20 lg:w-64 flex flex-col py-6 shrink-0 transition-all duration-300 ${isDarkMode ? 'bg-mozi-black' : 'bg-white border-r border-gray-200'}`}>
        <div className="mb-8 px-4 lg:px-6">
          <div className="flex items-center justify-center mx-auto lg:mx-0">
            <img src={logo} alt="UP Logo" className="w-12 h-12 lg:w-16 lg:h-16 object-contain" />
          </div>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          <button
            onClick={() => setCurrentView('list')}
            className={`p-3 lg:p-4 rounded-lg transition-all flex items-center gap-3 focus:outline-none ${isDarkMode
              ? `focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-mozi-black ${currentView === 'list' ? 'bg-mozi-active ring-2 ring-[#FFD700] ring-offset-2 ring-offset-mozi-black' : 'hover:bg-mozi-black-light'}`
              : `focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 focus:ring-offset-white ${currentView === 'list' ? 'bg-[#4CAF50] ring-2 ring-[#4CAF50] ring-offset-2 ring-offset-white' : 'hover:bg-gray-200'}`
              }`}
          >
            <svg className={`size-6 shrink-0 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`hidden lg:block font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Accueil</span>
          </button>
          <button
            onClick={() => setCurrentView('upload')}
            className={`p-3 lg:p-4 rounded-lg transition-all flex items-center gap-3 focus:outline-none ${isDarkMode
              ? `focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-mozi-black ${currentView === 'upload' ? 'bg-[#4CAF50] ring-2 ring-[#FFD700] ring-offset-2 ring-offset-mozi-black' : 'hover:bg-mozi-black-light'}`
              : `focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 focus:ring-offset-white ${currentView === 'upload' ? 'bg-mozi-active ring-2 ring-[#4CAF50] ring-offset-2 ring-offset-white' : 'hover:bg-gray-200'}`
              }`}
          >
            <svg className={`size-6 shrink-0 ${currentView === 'upload' ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-800')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className={`hidden lg:block font-medium ${currentView === 'upload' ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-800')}`}>Upload</span>
          </button>
        </nav>
      </aside>

      {/* Zone Principale */}
      <main className={`flex-1 flex flex-col w-full ${isDarkMode ? 'bg-mozi-black-light' : 'bg-gray-50'}`}>
        {/* Header avec recherche */}
        {(currentView === 'list' || currentView === 'detail') && (
          <header className={`p-4 lg:p-6 border-b w-full ${isDarkMode ? 'bg-mozi-black-light border-mozi-black' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-4 w-full px-4 lg:px-8">
              <button className={`p-2 rounded-lg transition-all lg:hidden focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${isDarkMode ? 'hover:bg-mozi-black focus:ring-offset-mozi-black-light' : 'hover:bg-gray-200 focus:ring-offset-white'}`}>
                <svg className={`size-6 ${isDarkMode ? 'text-mozi-grey-light' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-1 relative max-w-2xl">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Rechercher une vidéo ..."
                  className={`w-full rounded-full px-4 py-3 lg:py-4 pl-12 lg:pl-14 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-mozi-active ${isDarkMode
                    ? 'bg-mozi-grey-light/20 text-white placeholder-mozi-grey'
                    : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                    }`}
                />
                <svg className={`absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 size-5 lg:size-6 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Menu déroulant Theme */}
                <div className="relative" ref={filterThemeRef}>
                  <button
                    type="button"
                    onClick={() => setIsFilterThemeOpen(!isFilterThemeOpen)}
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${isDarkMode
                      ? `bg-mozi-grey-light/20 text-white hover:bg-mozi-grey-light/30 focus:ring-offset-mozi-black-light ${selectedFilterTheme ? 'bg-mozi-active/30' : ''}`
                      : `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-offset-white ${selectedFilterTheme ? 'bg-mozi-active/20 text-mozi-active' : ''}`
                      }`}
                  >
                    <span>{selectedFilterTheme || 'Theme'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isFilterThemeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute right-0 mt-1 w-48 border rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${isDarkMode
                      ? 'bg-mozi-black border-mozi-black-light'
                      : 'bg-white border-gray-200'
                      } ${isFilterThemeOpen
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-2 invisible'
                      }`}
                  >
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFilterTheme('')
                          setIsFilterThemeOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${isDarkMode
                          ? `hover:bg-mozi-black-light ${!selectedFilterTheme ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'}`
                          : `hover:bg-gray-100 ${!selectedFilterTheme ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-gray-800'}`
                          }`}
                      >
                        Tous les thèmes
                      </button>
                      {themes.map((theme) => (
                        <button
                          key={theme}
                          type="button"
                          onClick={() => {
                            setSelectedFilterTheme(theme)
                            setIsFilterThemeOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${isDarkMode
                            ? `hover:bg-mozi-black-light ${selectedFilterTheme === theme ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'}`
                            : `hover:bg-gray-100 ${selectedFilterTheme === theme ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-gray-800'}`
                            }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Menu déroulant Note */}
                <div className="relative" ref={filterNoteRef}>
                  <button
                    type="button"
                    onClick={() => setIsFilterNoteOpen(!isFilterNoteOpen)}
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${isDarkMode
                      ? `bg-mozi-grey-light/20 text-white hover:bg-mozi-grey-light/30 focus:ring-offset-mozi-black-light ${selectedFilterNote ? 'bg-mozi-active/30' : ''}`
                      : `bg-gray-500 text-white hover:bg-gray-600 focus:ring-offset-white ${selectedFilterNote ? 'bg-mozi-active/30 text-white' : ''}`
                      }`}
                  >
                    <span>{selectedFilterNote ? noteOptions.find(n => n.value === selectedFilterNote)?.label : 'Note'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isFilterNoteOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute right-0 mt-1 w-48 bg-mozi-black border border-mozi-black-light rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${isFilterNoteOpen
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                      }`}
                  >
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFilterNote('')
                          setIsFilterNoteOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-mozi-black-light transition-colors ${!selectedFilterNote ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'
                          }`}
                      >
                        Toutes les notes
                      </button>
                      {noteOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedFilterNote(option.value)
                            setIsFilterNoteOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-mozi-black-light transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${selectedFilterNote === option.value ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Menu déroulant Date */}
                <div className="relative" ref={filterDateRef}>
                  <button
                    type="button"
                    onClick={() => setIsFilterDateOpen(!isFilterDateOpen)}
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${isDarkMode
                      ? `bg-mozi-grey-light/20 text-white hover:bg-mozi-grey-light/30 focus:ring-offset-mozi-black-light ${selectedFilterDate ? 'bg-mozi-active/30' : ''}`
                      : `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-offset-white ${selectedFilterDate ? 'bg-mozi-active/20 text-mozi-active' : ''}`
                      }`}
                  >
                    <span>{selectedFilterDate ? dateOptions.find(d => d.value === selectedFilterDate)?.label : 'Date'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${isFilterDateOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute right-0 mt-1 w-48 border rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${isDarkMode
                      ? 'bg-mozi-black border-mozi-black-light'
                      : 'bg-white border-gray-200'
                      } ${isFilterDateOpen
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-2 invisible'
                      }`}
                  >
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFilterDate('')
                          setIsFilterDateOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${isDarkMode
                          ? `hover:bg-mozi-black-light ${!selectedFilterDate ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'}`
                          : `hover:bg-gray-100 ${!selectedFilterDate ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-gray-800'}`
                          }`}
                      >
                        Toutes les dates
                      </button>
                      {dateOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedFilterDate(option.value)
                            setIsFilterDateOpen(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${isDarkMode
                            ? `hover:bg-mozi-black-light ${selectedFilterDate === option.value ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'}`
                            : `hover:bg-gray-100 ${selectedFilterDate === option.value ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-gray-800'}`
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bouton de bascule Dark/Light */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 lg:p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-mozi-black-light ${isDarkMode
                    ? 'bg-mozi-grey-light/20 text-white hover:bg-mozi-grey-light/30'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg className="size-5 lg:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="size-5 lg:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Contenu selon la vue */}
        <div className="flex-1 overflow-auto">
          {currentView === 'list' && (
            <div className="p-4 lg:p-8 xl:p-12 w-full">
              {isLoadingVideos ? (
                <div className="text-center py-20">
                  <p className={`text-lg lg:text-xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Chargement des vidéos...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-20">
                  <p className={`text-lg lg:text-xl mb-4 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-600'}`}>Aucune vidéo disponible</p>
                  <p className={`text-sm lg:text-base ${isDarkMode ? 'text-mozi-grey-light' : 'text-gray-500'}`}>Utilisez le bouton Upload pour ajouter une vidéo</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onClick={handleVideoClick}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'upload' && (
            <div className="p-4 lg:p-5 xl:p-6 w-full">
              <UploadForm
                onUploadSuccess={handleUploadSuccess}
                isDarkMode={isDarkMode}
                themeDropdownRef={themeDropdownRef}
                isThemeDropdownOpen={isThemeDropdownOpen}
                setIsThemeDropdownOpen={setIsThemeDropdownOpen}
              />
            </div>
          )}

          {currentView === 'detail' && selectedVideo && (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8 w-full h-full">
              {/* Contenu principal avec la vidéo sélectionnée */}
              <div className="flex-1 p-4 lg:p-8 xl:p-12 min-w-0 w-full lg:w-auto">
                {/* Bouton Retour à l'accueil */}
                <button 
                  onClick={() => {
                    setCurrentView('list')
                    setSelectedVideo(null)
                  }}
                  className={`mb-6 lg:mb-8 flex items-center gap-2 px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${
                    isDarkMode 
                      ? 'bg-mozi-black-light text-white hover:bg-mozi-grey-light/20 border border-mozi-grey-light/30' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <svg className="size-5 lg:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="font-medium text-sm lg:text-base">Retour à l'accueil</span>
                </button>
                
                <div className="space-y-6 lg:space-y-8">
                  {/* Lecteur vidéo */}
                  <VideoPlayer video={selectedVideo} isDarkMode={isDarkMode} />

                  {/* Informations vidéo avec ses commentaires et notes uniques */}
                  <VideoMeta video={selectedVideo} isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* Sidebar droite avec la liste des autres vidéos */}
              <aside className={`w-full lg:w-56 xl:w-64 2xl:w-72 shrink-0 p-4 lg:p-6 overflow-y-auto border-t lg:border-t-0 lg:border-l ${
                isDarkMode 
                  ? 'bg-mozi-black-light border-mozi-black' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <h2 className={`text-base lg:text-lg font-semibold mb-4 lg:mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Autres vidéos
                </h2>
                {isLoadingVideos ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${isDarkMode ? 'text-mozi-grey' : 'text-gray-600'}`}>Chargement...</p>
                  </div>
                ) : videos.filter(v => v.id !== selectedVideo.id).length === 0 ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${isDarkMode ? 'text-mozi-grey' : 'text-gray-600'}`}>Aucune autre vidéo</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:space-y-0 lg:space-y-4">
                    {videos
                      .filter(v => v.id !== selectedVideo.id)
                      .map((video) => (
                        <div
                          key={video.id}
                          onClick={() => handleVideoClick(video)}
                          className={`flex flex-col lg:flex-row gap-2 lg:gap-3 rounded-lg overflow-hidden cursor-pointer hover:bg-opacity-80 transition-all duration-200 ${
                            isDarkMode ? 'bg-mozi-black' : 'bg-white border border-gray-200 shadow-sm'
                          }`}
                        >
                          {/* Miniature */}
                          <div className={`w-full lg:w-24 xl:w-28 2xl:w-32 aspect-video lg:h-16 xl:h-20 2xl:h-24 flex-shrink-0 flex items-center justify-center relative overflow-hidden rounded ${
                            isDarkMode ? 'bg-mozi-black-light' : 'bg-gray-100'
                          }`}>
                            {video.thumbnail ? (
                              <img 
                                src={`${UPLOADS_BASE_URL}/img/${video.thumbnail}`} 
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : null}
                            <div className={`absolute inset-0 flex items-center justify-center ${video.thumbnail ? 'bg-black/30' : ''}`}>
                              <svg className={`size-4 lg:size-5 ${isDarkMode ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                          {/* Titre et notations */}
                          <div className="flex-1 flex flex-col justify-between py-1.5 lg:py-2 min-w-0 px-2 lg:px-0">
                            <h3 className={`font-medium line-clamp-2 text-xs lg:text-sm ${
                              isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-0.5 lg:gap-1 mt-1">
                              {[...Array(5)].map((_, i) => {
                                const starValue = i + 1
                                const isFilled = starValue <= (video.rating || 0)
                                return (
                                  <svg 
                                    key={i} 
                                    className="size-3 lg:size-3.5 shrink-0"
                                    fill={isFilled ? "#FFD700" : "#696D74"} 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
