import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import html2canvas from 'html2canvas'
import GIF from 'gif.js'
import './App.css'

// Messages in both languages
const messages = {
  en: [
    "Wishing you a year filled with joy, success, and endless possibilities!",
    "May the new year bring you happiness, health, and prosperity!",
    "Here's to a fresh start and a year of amazing adventures!",
    "May your dreams come true and your goals be achieved in the new year!",
    "Wishing you peace, love, and laughter throughout the year!",
    "May the new year be your best one yet, filled with wonderful moments!",
    "Here's to new beginnings and a year of growth and success!",
    "May happiness and success follow you throughout the new year!",
    "Wishing you a year of new opportunities and great achievements!",
    "May the new year bring you closer to your dreams and aspirations!"
  ],
  es: [
    "¡Te deseo un año lleno de alegría, éxito y posibilidades infinitas!",
    "¡Que el nuevo año te traiga felicidad, salud y prosperidad!",
    "¡Brindemos por un nuevo comienzo y un año de aventuras increíbles!",
    "¡Que tus sueños se hagan realidad y tus metas se alcancen en el nuevo año!",
    "¡Te deseo paz, amor y risas durante todo el año!",
    "¡Que el nuevo año sea el mejor hasta ahora, lleno de momentos maravillosos!",
    "¡Brindemos por nuevos comienzos y un año de crecimiento y éxito!",
    "¡Que la felicidad y el éxito te acompañen durante todo el nuevo año!",
    "¡Te deseo un año de nuevas oportunidades y grandes logros!",
    "¡Que el nuevo año te acerque más a tus sueños y aspiraciones!"
  ]
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [language, setLanguage] = useState('en')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [name, setName] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [confetti, setConfetti] = useState([])
  const [fireworks, setFireworks] = useState([])
  const [showSwipePrompt, setShowSwipePrompt] = useState(true)
  const shareCardRef = useRef(null)
  const carouselRef = useRef(null)

  // Check if there's a name in the URL (check both window.location.search and searchParams)
  useEffect(() => {
    // First, try to read from window.location.search (works with regular query params)
    const urlParams = new URLSearchParams(window.location.search)
    let urlName = urlParams.get('name')
    let urlLang = urlParams.get('lang') || 'en'
    let urlMessage = urlParams.get('message')
    
    // Also check hash-based params (for HashRouter)
    const hash = window.location.hash
    if (hash && hash.includes('?')) {
      const hashParams = new URLSearchParams(hash.split('?')[1])
      if (!urlName) urlName = hashParams.get('name')
      if (!urlLang) urlLang = hashParams.get('lang') || 'en'
      if (!urlMessage) urlMessage = hashParams.get('message')
    }
    
    // If still not found, try searchParams (from React Router)
    if (!urlName) {
      urlName = searchParams.get('name')
      urlLang = searchParams.get('lang') || 'en'
      urlMessage = searchParams.get('message')
    }
    
    if (urlName) {
      setName(urlName)
      setLanguage(urlLang)
      if (urlMessage) {
        setSelectedMessage(parseInt(urlMessage))
      }
      setShowResult(true)
      // Also update searchParams to keep them in sync (only if different)
      const currentName = searchParams.get('name')
      if (currentName !== urlName) {
        setSearchParams({ name: urlName, lang: urlLang, message: urlMessage })
      }
    }
  }, [searchParams, setSearchParams]) // Include dependencies but check to avoid loops

  // Generate confetti animation
  useEffect(() => {
    if (showResult) {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']
      const newConfetti = []
      for (let i = 0; i < 100; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          speed: Math.random() * 3 + 2,
          rotation: Math.random() * 360
        })
      }
      setConfetti(newConfetti)
    }
  }, [showResult])

  // Generate fireworks periodically
  useEffect(() => {
    if (!showResult) return

    const fireworkColors = [
      ['#FFD700', '#FF6B6B', '#FFA07A'],
      ['#4ECDC4', '#45B7D1', '#98D8C8'],
      ['#EC4899', '#A855F7', '#F7DC6F'],
      ['#FF6B6B', '#FFD700', '#4ECDC4'],
      ['#A855F7', '#EC4899', '#45B7D1']
    ]

    const createFirework = () => {
      const x = Math.random() * 80 + 10 // 10% to 90% of screen width
      const y = Math.random() * 25 + 5 // Top portion of screen
      const colors = fireworkColors[Math.floor(Math.random() * fireworkColors.length)]
      const particleCount = 40 + Math.floor(Math.random() * 20)
      
      const particles = []
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3
        const speed = 1.5 + Math.random() * 2
        particles.push({
          id: i,
          angle,
          speed,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }

      setFireworks(prev => [...prev, {
        id: Date.now() + Math.random(),
        x,
        y,
        particles
      }])

      // Remove firework after animation completes
      setTimeout(() => {
        setFireworks(prev => prev.filter(fw => fw.id !== Date.now()))
      }, 1500)
    }

    // Create initial firework
    const initialTimeout = setTimeout(() => {
      createFirework()
    }, 500)

    // Create fireworks periodically
    const interval = setInterval(() => {
      createFirework()
    }, 2500 + Math.random() * 2000) // Every 2.5-4.5 seconds

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [showResult])

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setSelectedMessage(null)
    setName('')
    setShowResult(false)
  }

  const handleMessageSelect = (index) => {
    setSelectedMessage(index)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleGenerate = () => {
    if (name.trim() && selectedMessage !== null) {
      setSearchParams({ name: name.trim(), lang: language, message: selectedMessage })
      setShowResult(true)
    }
  }

  const handleShare = () => {
    // Use hash-based URL for HashRouter compatibility
    const url = `${window.location.origin}${window.location.pathname}#/?name=${encodeURIComponent(name)}&lang=${language}&message=${selectedMessage}`
    navigator.clipboard.writeText(url)
    alert(language === 'en' ? 'Link copied to clipboard!' : '¡Enlace copiado al portapapeles!')
  }

  const downloadImage = async () => {
    if (!shareCardRef.current) {
      alert(language === 'en' ? 'Card not ready. Please wait a moment.' : 'La tarjeta no está lista. Por favor espera un momento.')
      return
    }
    
    try {
      // Wait a bit to ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1e1b4b', // Solid background color (indigo-900)
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        removeContainer: true,
        windowWidth: shareCardRef.current.offsetWidth,
        windowHeight: shareCardRef.current.offsetHeight,
        width: shareCardRef.current.offsetWidth,
        height: shareCardRef.current.offsetHeight
      })
      
      const link = document.createElement('a')
      link.download = `happy-new-year-${name.replace(/\s+/g, '-')}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error generating image:', error)
      alert(language === 'en' 
        ? `Error generating image: ${error.message}. Please try again.` 
        : `Error al generar la imagen: ${error.message}. Por favor intenta de nuevo.`)
    }
  }

  const downloadGIF = async () => {
    if (!shareCardRef.current) {
      alert(language === 'en' ? 'Card not ready. Please wait a moment.' : 'La tarjeta no está lista. Por favor espera un momento.')
      return
    }

    try {
      // Show loading message
      const loadingMsg = language === 'en' 
        ? 'Generating animated GIF... This may take a moment.'
        : 'Generando GIF animado... Esto puede tomar un momento.'
      alert(loadingMsg)

      const width = shareCardRef.current.offsetWidth
      const height = shareCardRef.current.offsetHeight
      const scale = 2
      const scaledWidth = width * scale
      const scaledHeight = height * scale

      // Capture base card once (more efficient)
      const baseCanvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1e1b4b',
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        width: width,
        height: height
      })

      // Create GIF with worker
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: scaledWidth,
        height: scaledHeight,
        workerScript: '/gif.worker.js'
      })

      // Generate frames with animated confetti
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']
      const confettiPieces = []
      
      // Generate confetti pieces
      for (let i = 0; i < 40; i++) {
        confettiPieces.push({
          x: Math.random() * width,
          y: -Math.random() * height * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          speed: Math.random() * 2 + 1.5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 20
        })
      }

      // Create 20 frames (about 1 second at 20fps for smaller file size)
      const frameCount = 20
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = scaledWidth
      tempCanvas.height = scaledHeight
      const tempCtx = tempCanvas.getContext('2d')

      for (let frame = 0; frame < frameCount; frame++) {
        tempCtx.clearRect(0, 0, scaledWidth, scaledHeight)
        // Draw base card
        tempCtx.drawImage(baseCanvas, 0, 0)

        // Draw animated confetti
        confettiPieces.forEach(piece => {
          const currentY = piece.y + (piece.speed * frame * (height / frameCount))
          if (currentY < height && currentY > -piece.size) {
            tempCtx.save()
            tempCtx.translate(piece.x * scale, currentY * scale)
            tempCtx.rotate((piece.rotation + frame * piece.rotationSpeed) * Math.PI / 180)
            tempCtx.fillStyle = piece.color
            tempCtx.shadowColor = piece.color
            tempCtx.shadowBlur = 4
            tempCtx.fillRect(-piece.size * scale / 2, -piece.size * scale / 2, piece.size * scale, piece.size * scale)
            tempCtx.restore()
          }
        })

        gif.addFrame(tempCanvas, { delay: 50 }) // 20fps
      }

      gif.on('finished', (blob) => {
        const link = document.createElement('a')
        link.download = `happy-new-year-${name.replace(/\s+/g, '-')}-${Date.now()}.gif`
        link.href = URL.createObjectURL(blob)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      })

      gif.on('progress', (p) => {
        // Optional: show progress
        console.log(`GIF progress: ${(p * 100).toFixed(1)}%`)
      })

      gif.render()
    } catch (error) {
      console.error('Error generating GIF:', error)
      alert(language === 'en' 
        ? `Error generating GIF: ${error.message}. Please try again.` 
        : `Error al generar el GIF: ${error.message}. Por favor intenta de nuevo.`)
    }
  }

  const shareToWhatsApp = async () => {
    // Use hash-based URL for HashRouter compatibility
    const url = `${window.location.origin}${window.location.pathname}#/?name=${encodeURIComponent(name)}&lang=${language}&message=${selectedMessage}`
    const text = language === 'en' 
      ? `Happy New Year ${name}! 🎉\n\n${messages[language][selectedMessage]}\n\n${url}`
      : `¡Feliz Año Nuevo ${name}! 🎉\n\n${messages[language][selectedMessage]}\n\n${url}`
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareToFacebook = () => {
    // Use hash-based URL for HashRouter compatibility
    const url = `${window.location.origin}${window.location.pathname}#/?name=${encodeURIComponent(name)}&lang=${language}&message=${selectedMessage}`
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400')
  }


  const handleReset = () => {
    setSearchParams({})
    setShowResult(false)
    setSelectedMessage(null)
    setName('')
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetti Animation */}
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute rounded-sm"
            style={{
              left: `${piece.x}%`,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              backgroundColor: piece.color,
              animation: `fall ${piece.speed}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${piece.size}px ${piece.color}`
            }}
          />
        ))}

        {/* Animated Fireworks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fireworks.map((firework) => (
            <div
              key={firework.id}
              className="absolute"
              style={{
                left: `${firework.x}%`,
                top: `${firework.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {firework.particles.map((particle) => {
                const distance = 60 + Math.random() * 40
                const endX = Math.cos(particle.angle) * distance
                const endY = Math.sin(particle.angle) * distance
                
                return (
                  <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                      left: '0',
                      top: '0',
                      width: '6px',
                      height: '6px',
                      backgroundColor: particle.color,
                      boxShadow: `0 0 12px ${particle.color}, 0 0 6px ${particle.color}`,
                      animation: `firework-explode ${particle.speed}s ease-out forwards`,
                      '--end-x': `${endX}px`,
                      '--end-y': `${endY}px`
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="w-full max-w-6xl mx-auto z-10 relative">
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth gap-6 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
            onScroll={() => {
              if (carouselRef.current) {
                const scrollLeft = carouselRef.current.scrollLeft
                // Hide prompt after user scrolls
                if (scrollLeft > 50) {
                  setShowSwipePrompt(false)
                }
              }
            }}
          >
            {/* Card 1: Shareable Card (Background) */}
            <div 
              ref={shareCardRef}
              className="flex-shrink-0 w-full max-w-sm mx-auto aspect-[9/16] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl snap-center"
              style={{ 
                minHeight: '640px',
                background: 'linear-gradient(to bottom right, #581c87, #1e3a8a, #312e81)',
                transform: 'scale(0.9)',
                opacity: 0.7
              }}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div 
                  className="absolute top-10 left-10 rounded-full"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'radial-gradient(circle, rgba(250,204,21,0.6) 0%, transparent 70%)'
                  }}
                ></div>
                <div 
                  className="absolute bottom-20 right-10 rounded-full"
                  style={{
                    width: '128px',
                    height: '128px',
                    background: 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, transparent 70%)'
                  }}
                ></div>
                <div 
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{
                    width: '160px',
                    height: '160px',
                    background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%)'
                  }}
                ></div>
              </div>
              
              <div className="relative z-10 w-full flex flex-col items-center justify-center">
                <div className="text-7xl mb-6" style={{ fontFamily: 'system-ui', lineHeight: '1', transform: 'translateY(-10px)' }}>🎉</div>
                <div 
                  className="px-6 py-3 rounded-2xl mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #facc15 0%, #ec4899 50%, #a855f7 100%)',
                    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  <h1 
                    className="text-4xl font-bold"
                    style={{
                      color: '#ffffff',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      fontFamily: 'system-ui'
                    }}
                  >
                    {language === 'en' ? 'Happy New Year' : '¡Feliz Año Nuevo'}
                  </h1>
                </div>
                <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'system-ui', textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
                  {name} !
                </h2>
                <p className="text-lg text-white leading-relaxed mb-8 px-4" style={{ fontFamily: 'system-ui', opacity: 0.95, textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}>
                  {messages[language][selectedMessage]}
                </p>
                <div className="text-5xl mt-auto" style={{ fontFamily: 'system-ui', lineHeight: '1' }}>✨</div>
              </div>
            </div>

            {/* Card 2: Share Options Card (Foreground) */}
            <div className="flex-shrink-0 w-full max-w-md mx-auto text-center z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 snap-center">
              <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-6 animate-pulse">
                {language === 'en' ? 'Happy New Year' : '¡Feliz Año Nuevo'}
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 animate-slide-up">
                {name} !
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-slide-up-delay">
                {messages[language][selectedMessage]}
              </p>
              
              {/* Download Options */}
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-4 font-semibold">
                  {language === 'en' ? 'Download for Sharing' : 'Descargar para Compartir'}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadImage}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                    title="Download Image"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">{language === 'en' ? 'Image' : 'Imagen'}</span>
                  </button>
                  <button
                    onClick={downloadGIF}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                    title="Download GIF"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">GIF</span>
                  </button>
                </div>
              </div>

              {/* Social Sharing Buttons */}
              <div className="mb-6">
                <p className="text-white/80 text-sm mb-4 font-semibold">
                  {language === 'en' ? 'Share to Social Media' : 'Compartir en Redes Sociales'}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                    title="WhatsApp"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-xs">WhatsApp</span>
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                    title="Facebook"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-xs">Facebook</span>
                  </button>
                  <button
                    onClick={downloadImage}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
                    title="Instagram (Download Image)"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.22 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="text-xs">Instagram</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap mt-6">
                <button
                  onClick={handleShare}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:scale-110 transition-transform shadow-lg hover:shadow-xl"
                >
                  {language === 'en' ? 'Copy Link' : 'Copiar Enlace'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:scale-110 transition-transform border border-white/30"
                >
                  {language === 'en' ? 'Create New' : 'Crear Nuevo'}
                </button>
              </div>
            </div>
          </div>

          {/* Swipe Prompt Animation */}
          {showSwipePrompt && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
              <div className="flex flex-col items-center gap-2 animate-swipe-prompt">
                <p className="text-white/80 text-sm font-semibold">
                  {language === 'en' ? 'Swipe to share' : 'Desliza para compartir'}
                </p>
                <svg className="w-8 h-8 text-white/80 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes fall {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(110vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes firework-explode {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--end-x), var(--end-y)) scale(0);
              opacity: 0;
            }
          }
          @keyframes swipe-prompt {
            0%, 100% {
              opacity: 0.6;
              transform: translateX(-10px);
            }
            50% {
              opacity: 1;
              transform: translateX(10px);
            }
          }
          @keyframes bounce-x {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(8px);
            }
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }
          .animate-slide-up-delay {
            animation: slide-up 0.8s ease-out 0.2s both;
          }
          .animate-swipe-prompt {
            animation: swipe-prompt 2s ease-in-out infinite;
          }
          .animate-bounce-x {
            animation: bounce-x 1.5s ease-in-out infinite;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-8 animate-pulse">
          {language === 'en' ? 'Happy New Year Wishes' : 'Deseos de Año Nuevo'}
        </h1>

        {/* Language Selection */}
        <div className="mb-8">
          <label className="block text-white text-lg font-semibold mb-4">
            {language === 'en' ? 'Select Language' : 'Seleccionar Idioma'}
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('es')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                language === 'es'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Español
            </button>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-8">
          <label className="block text-white text-lg font-semibold mb-2">
            {language === 'en' ? "Recipient's Name" : 'Nombre del Destinatario'}
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder={language === 'en' ? 'Enter name...' : 'Ingresa el nombre...'}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Message Selection */}
        <div className="mb-8">
          <label className="block text-white text-lg font-semibold mb-4">
            {language === 'en' ? 'Choose a Message' : 'Elige un Mensaje'}
          </label>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {messages[language].map((message, index) => (
              <button
                key={index}
                onClick={() => handleMessageSelect(index)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedMessage === index
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!name.trim() || selectedMessage === null}
          className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
        >
          {language === 'en' ? 'Generate Wish' : 'Generar Deseo'}
        </button>
      </div>
    </div>
  )
}

export default App
