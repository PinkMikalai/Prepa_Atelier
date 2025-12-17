import { useState, useEffect, useRef } from 'react'
import './App.css'
import logo from './assets/images/logo.png'

function App() {
  const [currentView, setCurrentView] = useState('list') // 'list', 'upload', 'detail'
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [videos, setVideos] = useState([]) // Tableau vide au départ
  const [userRating, setUserRating] = useState(0) // Note de l'utilisateur (0-5)
  const [hoverRating, setHoverRating] = useState(0) // Note au survol
  const [comments, setComments] = useState([]) // Liste des commentaires
  const [newComment, setNewComment] = useState('') // Nouveau commentaire en cours de saisie
  const [videoProgress, setVideoProgress] = useState(0) // Progression upload vidéo (0-100)
  const [thumbnailProgress, setThumbnailProgress] = useState(0) // Progression upload miniature (0-100)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false) // État upload vidéo
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false) // État upload miniature
  const [selectedTheme, setSelectedTheme] = useState('') // Thème sélectionné
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

  const handleVideoClick = (video) => {
    setSelectedVideo(video)
    setCurrentView('detail')
    setUserRating(0) // Réinitialiser la note lors du changement de vidéo
    setHoverRating(0)
  }

  const handleStarClick = (rating) => {
    setUserRating(rating)
    // Ici vous pourrez envoyer la note au backend
  }

  const handleStarHover = (rating) => {
    setHoverRating(rating)
  }

  const handleStarLeave = () => {
    setHoverRating(0)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment.trim(),
        date: new Date().toLocaleDateString('fr-FR')
      }
      setComments([...comments, comment])
      setNewComment('')
      // Ici vous pourrez envoyer le commentaire au backend
    }
  }

  const simulateUpload = (type) => {
    if (type === 'video') {
      setIsUploadingVideo(true)
      setVideoProgress(0)
      const interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploadingVideo(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else if (type === 'thumbnail') {
      setIsUploadingThumbnail(true)
      setThumbnailProgress(0)
      const interval = setInterval(() => {
        setThumbnailProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploadingThumbnail(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
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
            className={`p-3 lg:p-4 rounded-lg transition-all flex items-center gap-3 focus:outline-none ${
              isDarkMode 
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
            className={`p-3 lg:p-4 rounded-lg transition-all flex items-center gap-3 focus:outline-none ${
              isDarkMode 
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
        {currentView === 'list' && (
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
                  placeholder="Hinted search text" 
                  className={`w-full rounded-full px-4 py-3 lg:py-4 pl-12 lg:pl-14 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-mozi-active ${
                    isDarkMode 
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
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${
                      isDarkMode 
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
                    className={`absolute right-0 mt-1 w-48 border rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${
                      isDarkMode 
                        ? 'bg-mozi-black border-mozi-black-light' 
                        : 'bg-white border-gray-200'
                    } ${
                      isFilterThemeOpen 
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
                        className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                          isDarkMode 
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
                          className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                            isDarkMode 
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
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${
                      isDarkMode 
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
                    className={`absolute right-0 mt-1 w-48 bg-mozi-black border border-mozi-black-light rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${
                      isFilterNoteOpen 
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-mozi-black-light transition-colors ${
                          !selectedFilterNote ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'
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
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-mozi-black-light transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                            selectedFilterNote === option.value ? 'bg-mozi-active/20 text-mozi-active font-medium' : 'text-white'
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
                    className={`px-4 lg:px-6 py-3 lg:py-4 rounded-lg transition-all text-sm lg:text-base whitespace-nowrap flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 ${
                      isDarkMode 
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
                    className={`absolute right-0 mt-1 w-48 border rounded-lg shadow-lg max-h-60 overflow-auto z-20 transition-all duration-300 ease-in-out ${
                      isDarkMode 
                        ? 'bg-mozi-black border-mozi-black-light' 
                        : 'bg-white border-gray-200'
                    } ${
                      isFilterDateOpen 
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
                        className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                          isDarkMode 
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
                          className={`w-full text-left px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                            isDarkMode 
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
                  className={`p-2 lg:p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-mozi-black-light ${
                    isDarkMode 
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
              {videos.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-mozi-grey text-lg lg:text-xl mb-4">Aucune vidéo disponible</p>
                  <p className="text-mozi-grey-light text-sm lg:text-base">Utilisez le bouton Upload pour ajouter une vidéo</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-8">
                  {videos.map((video) => (
                    <div 
                      key={video.id}
                      onClick={() => handleVideoClick(video)}
                      className={`rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 ${
                        isDarkMode ? 'bg-mozi-black' : 'bg-white border border-gray-200 shadow-sm'
                      }`}
                    >
                      <div className={`aspect-video flex items-center justify-center ${
                        isDarkMode ? 'bg-mozi-black-light' : 'bg-gray-100'
                      }`}>
                        <svg className={`size-12 lg:size-16 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div className="p-3 lg:p-4">
                        <h3 className={`font-medium mb-2 line-clamp-2 text-sm lg:text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{video.title}</h3>
                        <p className={`text-xs lg:text-sm mb-2 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-600'}`}>{video.theme}</p>
                        <div className="flex items-center gap-1.5">
                          {renderStars(video.rating)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'upload' && (
            <div className="p-4 lg:p-5 xl:p-6 max-w-7xl mx-auto w-full">
              <div className={`rounded-xl p-4 lg:p-5 xl:p-6 shadow-lg ${
                isDarkMode ? 'bg-mozi-black' : 'bg-white'
              }`}>
                <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-mozi-black mb-3 lg:mb-4">Upload de vidéo</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Colonne gauche - Champs texte */}
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Titre de la vidéo</label>
                      <input 
                        type="text" 
                        placeholder="Value" 
                        className="w-full px-3 py-2 border border-mozi-grey-light rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mozi-active"
                      />
                    </div>
                    <div className="relative" ref={themeDropdownRef}>
                      <label className="block text-sm font-medium text-mozi-black mb-1.5">Theme de la vidéo</label>
                      <button
                        type="button"
                        onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 text-left flex items-center justify-between ${
                          isDarkMode 
                            ? 'border-mozi-grey-light bg-mozi-black-light focus:ring-offset-mozi-black' 
                            : 'border-gray-300 bg-white focus:ring-offset-white'
                        }`}
                      >
                        <span className={selectedTheme ? (isDarkMode ? 'text-white' : 'text-gray-800') : (isDarkMode ? 'text-mozi-grey' : 'text-gray-500')}>
                          {selectedTheme || 'Sélectionnez un thème'}
                        </span>
                        <svg 
                          className={`w-4 h-4 transition-transform duration-300 ${isThemeDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-mozi-grey' : 'text-gray-500'}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div 
                        className={`absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out ${
                          isDarkMode 
                            ? 'bg-mozi-black border-mozi-grey-light' 
                            : 'bg-white border-gray-300'
                        } ${
                          isThemeDropdownOpen 
                            ? 'opacity-100 translate-y-0 visible' 
                            : 'opacity-0 -translate-y-2 invisible'
                        }`}
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
                              className={`w-full text-left px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-inset ${
                                isDarkMode 
                                  ? `hover:bg-mozi-black-light ${selectedTheme === theme ? 'bg-mozi-active/10 text-mozi-active font-medium' : 'text-white'}`
                                  : `hover:bg-gray-100 ${selectedTheme === theme ? 'bg-mozi-active/10 text-mozi-active font-medium' : 'text-gray-800'}`
                              }`}
                            >
                              {theme}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Description de la video</label>
                      <textarea 
                        placeholder="Value" 
                        rows="4"
                        className="w-full px-3 py-2 border border-mozi-grey-light rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-mozi-active"
                      />
                    </div>
                  </div>

                  {/* Colonne droite - Zones d'upload */}
                  <div className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-mozi-black mb-1.5">upload de la video</label>
                      <div 
                        onClick={() => simulateUpload('video')}
                        className={`w-full h-32 lg:h-40 xl:h-48 border-2 border-dashed rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'border-mozi-grey-light bg-mozi-grey-light/10 hover:bg-mozi-grey-light/20' 
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-center">
                          <svg className={`size-10 lg:size-12 mx-auto mb-1.5 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className={`text-xs ${isDarkMode ? 'text-mozi-grey' : 'text-gray-500'}`}>Cliquez pour uploader</p>
                        </div>
                      </div>
                      {isUploadingVideo && (
                        <div role="progressbar" aria-valuenow={videoProgress} aria-valuemin="0" aria-valuemax="100" className="mt-2">
                          <div className="flex justify-between gap-4">
                            <span className="text-sm font-medium text-mozi-black">Uploading video</span>
                            <span className="text-sm font-medium text-mozi-black">{videoProgress}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full rounded-full bg-mozi-grey-light/30">
                            <div 
                              className="h-full rounded-full bg-mozi-active transition-all duration-300" 
                              style={{ width: `${videoProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>upload de la miniature</label>
                      <div 
                        onClick={() => simulateUpload('thumbnail')}
                        className={`w-full h-32 lg:h-40 xl:h-48 border-2 border-dashed rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'border-mozi-grey-light bg-mozi-grey-light/10 hover:bg-mozi-grey-light/20' 
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-center">
                          <svg className={`size-10 lg:size-12 mx-auto mb-1.5 ${isDarkMode ? 'text-mozi-grey' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className={`text-xs ${isDarkMode ? 'text-mozi-grey' : 'text-gray-500'}`}>Cliquez pour uploader</p>
                        </div>
                      </div>
                      {isUploadingThumbnail && (
                        <div role="progressbar" aria-valuenow={thumbnailProgress} aria-valuemin="0" aria-valuemax="100" className="mt-2">
                          <div className="flex justify-between gap-4">
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Uploading thumbnail</span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{thumbnailProgress}%</span>
                          </div>
                          <div className="mt-2 h-2 w-full rounded-full bg-mozi-grey-light/30">
                            <div 
                              className="h-full rounded-full bg-mozi-active transition-all duration-300" 
                              style={{ width: `${thumbnailProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-center gap-4 mt-4 lg:mt-6">
                  <button 
                    onClick={() => setCurrentView('list')}
                    className="bg-mozi-grey text-white px-5 lg:px-6 py-2 rounded-lg hover:bg-mozi-black transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-white"
                  >
                    Annuler
                  </button>
                  <button className="bg-mozi-black text-white px-5 lg:px-6 py-2 rounded-lg hover:bg-mozi-black-light transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-white">
                    Publier la vidéo
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentView === 'detail' && selectedVideo && (
            <div className="p-4 lg:p-8 xl:p-12 w-full">
              <button 
                onClick={() => setCurrentView('list')}
                className="mb-6 lg:mb-8 text-mozi-grey-light hover:text-white transition-all flex items-center gap-2 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-mozi-black-light rounded"
              >
                <svg className="size-5 lg:size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
              
              <div className="space-y-6 lg:space-y-8">
                {/* Lecteur vidéo */}
                <div className="bg-mozi-black rounded-xl overflow-hidden">
                  <div className="aspect-video bg-mozi-black-light flex items-center justify-center">
                    <svg className="size-24 lg:size-32 text-mozi-grey" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Informations vidéo */}
                <div className="bg-mozi-black rounded-xl p-6 lg:p-8">
                  <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-3 lg:mb-4">{selectedVideo.title}</h1>
                  <p className="text-mozi-grey mb-4 lg:mb-6 text-base lg:text-lg">{selectedVideo.theme}</p>
                  <p className="text-white mb-6 lg:mb-8 text-base lg:text-lg leading-relaxed">{selectedVideo.description}</p>
                  
                  {/* Système de notation */}
                  <div className="border-t border-mozi-black-light pt-6 lg:pt-8 mb-6 lg:mb-8">
                    <h3 className="text-white font-medium mb-4 lg:mb-6 text-lg lg:text-xl">Noter cette vidéo</h3>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedVideo.rating || 0, true)}
                      {userRating > 0 && (
                        <span className="text-mozi-grey-light text-sm lg:text-base ml-2">
                          Vous avez noté {userRating}/5
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Formulaire de commentaire */}
                  <div className="border-t border-mozi-black-light pt-6 lg:pt-8">
                    <h3 className="text-white font-medium mb-4 lg:mb-6 text-lg lg:text-xl">Ajouter un commentaire</h3>
                    <form onSubmit={handleAddComment} className="mb-6 lg:mb-8">
                      <div className="flex gap-3 lg:gap-4">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Écrivez votre commentaire..."
                          className="flex-1 bg-mozi-black-light text-white placeholder-mozi-grey rounded-lg px-4 lg:px-5 py-3 lg:py-4 focus:outline-none focus:ring-2 focus:ring-mozi-active text-sm lg:text-base"
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="bg-mozi-active text-white px-6 lg:px-8 py-3 lg:py-4 rounded-lg hover:bg-mozi-active/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base font-medium focus:outline-none focus:ring-2 focus:ring-mozi-active focus:ring-offset-2 focus:ring-offset-mozi-black"
                        >
                          Publier
                        </button>
                      </div>
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
                              <p className="text-white text-sm lg:text-base mb-2">{comment.text}</p>
                              <p className="text-mozi-grey text-xs lg:text-sm">{comment.date}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
