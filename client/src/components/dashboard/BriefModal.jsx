import API_URL from '../../config/api'
import { useState, useEffect } from 'react'
import { X, Save, Download, ChevronRight, ChevronLeft, FileText, Map, Route, FileEdit, Eye, Upload, File, Image as ImageIcon, Palette, Plus, Wand2 } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import Button from '../common/Button'
import SiteMapBuilder from '../brief/SiteMapBuilder'
import MenuBuilder from '../brief/MenuBuilder'
import BuildPromptsModal from './BuildPromptsModal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import NotificationModal from '../common/NotificationModal'
import ConfirmModal from '../common/ConfirmModal'

const GOOGLE_FONTS = [
  'ABeeZee','Abel','Abril Fatface','Acme','Akaya Kanadaka','Alata','Aldrich','Alegreya','Alegreya Sans','Aleo',
  'Alex Brush','Alfa Slab One','Alice','Alike','Allan','Allerta','Allura','Almendra','Alumni Sans','Amaranth',
  'Amatic SC','Amiko','Amiri','Anaheim','Andika','Annie Use Your Telescope','Anonymous Pro','Antic','Anton',
  'Antonio','Anybody','Archivo','Archivo Black','Archivo Narrow','Arimo','Arvo','Asap','Assistant',
  'Atkinson Hyperlegible','Audiowide','Averia Libre','Azeret Mono','B612','Baloo 2','Balsamiq Sans','Bangers',
  'Barlow','Barlow Condensed','Barlow Semi Condensed','Baskervville','Be Vietnam Pro','Bebas Neue','Belleza',
  'Bellota','BenchNine','Berkshire Swash','Bitter','Black Han Sans','Black Ops One','Blinker','Bodoni Moda',
  'Boogaloo','Bree Serif','Bruno Ace','Buenard','Bungee','Bungee Inline','Cabin','Cabin Condensed',
  'Cabin Sketch','Cairo','Calistoga','Cantarell','Cantata One','Capriola','Cardo','Carlito','Carme',
  'Carter One','Catamaran','Caudex','Caveat','Caveat Brush','Chakra Petch','Changa','Chango','Charm',
  'Chelsea Market','Cherry Cream Soda','Chewy','Chivo','Cinzel','Cinzel Decorative','Clicker Script',
  'Coda','Comfortaa','Comic Neue','Commissioner','Concert One','Cookie','Copse','Cormorant',
  'Cormorant Garamond','Courgette','Courier Prime','Cousine','Crafty Girls','Creepster','Crete Round',
  'Crimson Pro','Crimson Text','Cuprum','Cutive','Cutive Mono','DM Mono','DM Sans','DM Serif Display',
  'DM Serif Text','Damion','Dancing Script','Darker Grotesque','Days One','Dekko','Delius','Della Respira',
  'Didact Gothic','Diplomata','Domine','Donegal One','Dosis','Duru Sans','EB Garamond','Electrolize',
  'Encode Sans','Encode Sans Condensed','Encode Sans Expanded','Epilogue','Exo','Exo 2','Fahkwang',
  'Familjen Grotesk','Fanwood Text','Faustina','Figtree','Fira Code','Fira Mono','Fira Sans',
  'Fira Sans Condensed','Fjalla One','Fondamento','Francois One','Frank Ruhl Libre','Fraunces',
  'Fredericka the Great','Fredoka','Fugaz One','GFS Didot','GFS Neohellenic','Gaegu','Galindo',
  'Gemunu Libre','Genos','Gentium Book Plus','Gentium Plus','Geologica','Georama','Gilda Display',
  'Gloria Hallelujah','Glory','Gluten','Goblin One','Gochi Hand','Gothic A1','Goudy Bookletter 1911',
  'Graduate','Grand Hotel','Grandstander','Gravitas One','Great Vibes','Grenze Gotisch','Gruppo',
  'Gudea','Gupter','Gwendolyn','Habibi','Halant','Hammersmith One','Handlee','Happy Monkey','Heebo',
  'Henny Penny','Hepta Slab','Hind','Hind Guntur','Hind Madurai','Hind Siliguri','IBM Plex Mono',
  'IBM Plex Sans','IBM Plex Sans Condensed','IBM Plex Serif','IM Fell DW Pica','Iceberg','Iceland',
  'Imbue','Inconsolata','Indie Flower','Inria Sans','Inria Serif','Inter','Inter Tight','Italiana',
  'Italianno','Itim','Jacques Francois','Jaldi','JetBrains Mono','Jockey One','Josefin Sans',
  'Josefin Slab','Jost','Judson','Julius Sans One','Jura','Just Another Hand','K2D','Kalam','Kameron',
  'Kanit','Karla','Karma','Kaushan Script','Khula','Kite One','Klee One','Kodchasan','Kolker Brush',
  'Kotta One','Kreon','Krista','Krona One','Krub','Kumbh Sans','Lancelot','Lato','League Gothic',
  'League Spartan','Leckerli One','Ledger','Lekton','Lexend','Lexend Deca','Libre Baskerville',
  'Libre Caslon Display','Libre Caslon Text','Libre Franklin','Lilita One','Limelight','Literata',
  'Livvic','Lobster','Lobster Two','Londrina Solid','Lora','Luckiest Guy','Lusitana','Lustria',
  'M PLUS 1','M PLUS 1p','M PLUS 2','M PLUS Rounded 1c','Ma Shan Zheng','Macondo','Mada','Magra',
  'Maitree','Mallanna','Manrope','Marck Script','Markazi Text','Martel','Martel Sans','Marvel',
  'Mate','Maven Pro','McLaren','Medula One','Megrim','Merienda','Merriweather','Merriweather Sans',
  'Michroma','Milonga','Mina','Miriam Libre','Mitr','Modak','Modern Antiqua','Mohave','Mona Sans',
  'Montagu Slab','Montez','Montserrat','Montserrat Alternates','Moul','Mulish','Mystery Quest',
  'Nanum Gothic','Nanum Myeongjo','Nerko One','Neuton','News Cycle','Newsreader','Niconne','Niramit',
  'Nixie One','Nobile','Norican','Noticia Text','Noto Sans','Noto Serif','Nunito','Nunito Sans',
  'Odibee Sans','Offside','Old Standard TT','Oleo Script','Open Sans','Orbitron','Oregano','Oswald',
  'Outfit','Overlock','Overpass','Ovo','Oxanium','Oxygen','PT Mono','PT Sans','PT Sans Narrow',
  'PT Serif','Pacifico','Palanquin','Pangolin','Parisienne','Passion One','Pathway Extreme',
  'Patrick Hand','Pattaya','Patua One','Paytone One','Permanent Marker','Petrona','Philosopher',
  'Piazzolla','Pinyon Script','Play','Playfair Display','Playfair Display SC','Playpen Sans',
  'Plus Jakarta Sans','Podkova','Poiret One','Poppins','Prata','Press Start 2P','Pridi','Prompt',
  'Proza Libre','Public Sans','Quicksand','Raleway','Rambla','Rampart One','Ranchers','Rancho',
  'Rasa','Readex Pro','Recursive','Red Hat Display','Red Hat Mono','Red Hat Text','Red Rose',
  'Reem Kufi','Righteous','Roboto','Roboto Condensed','Roboto Mono','Roboto Serif','Roboto Slab',
  'Rokkitt','Rosario','Rowdies','Rubik','Rubik Mono One','Rubik One','Ruda','Rufina','Russo One',
  'Rye','Sacramento','Saira','Saira Condensed','Sarabun','Sarala','Satisfy','Scada','Secular One',
  'Sen','Shadows Into Light','Shantell Sans','Share','Share Tech','Shrikhand','Sigmar','Signika',
  'Silkscreen','Single Day','Sintony','Six Caps','Skranji','Sniglet','Sofia','Sofia Sans',
  'Sono','Sora','Source Code Pro','Source Sans 3','Source Serif 4','Space Grotesk','Space Mono',
  'Spectral','Spinnaker','Squada One','Staatliches','Stardos Stencil','Stick No Bills','Suez One',
  'Sulphur Point','Sumana','Sunflower','Syne','Tajawal','Tangerine','Tauri','Teko','Telex',
  'Tenor Sans','Tienne','Tillana','Tilt Neon','Tilt Prism','Tinos','Titan One','Titillium Web',
  'Tomorrow','Tourney','Trade Winds','Trirong','Trocchi','Truculenta','Turret Road','Ubuntu',
  'Ubuntu Condensed','Ubuntu Mono','Ultra','Unbounded','Unica One','Unkempt','Urbanist','VT323',
  'Varela','Varela Round','Vast Shadow','Vazirmatn','Vidaloka','Viga','Vibes','Volkhov','Vollkorn',
  'Voltaire','Waiting for the Sunrise','Walter Turncoat','Warnes','Wellfleet','Wendy One',
  'Wire One','Wix Madefor Display','Wix Madefor Text','Work Sans','Yanone Kaffeesatz',
  'Yantramanav','Yatra One','Yellowtail','Yeseva One','Yesteryear','Young Serif','Yrsa',
  'Yusei Magic','Zeyada','Zilla Slab'
].sort()

const BriefModal = ({ brief, onClose, autoExport = false, readOnly = false }) => {
  const { getToken } = useAuth()
  const [currentStep, setCurrentStep] = useState(readOnly ? 7 : 1)
  const [briefData, setBriefData] = useState({
    id: null,
    projectName: '',
    whatBuilding: '',
    whyBuilding: '',
    whoUsing: '',
    successGoals: '',
    styleGuide: {
      theme: 'light',
      primaryColor: '#102542',
      secondaryColor: '#f87060',
      shadows: 'subtle',
      borderRadius: '8px',
      spacing: 'comfortable',
      animations: 'smooth',
      typography: 'Inter',
      logo: null,
      header: { enabled: true, layout: 'logo-left', menuItems: [], notes: '' },
      footer: { enabled: true, columns: 2, copyright: true }
    },
    siteMap: {
      pages: [],
      otherPages: []
    },
    userJourneys: [],
    pageContent: {},
    generalAssets: {
      images: [],
      files: []
    }
  })

  const [newJourney, setNewJourney] = useState({ name: '', steps: [''] })
  const [activePageTab, setActivePageTab] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState({ isOpen: false, type: 'info', title: '', message: '' })
  const [pageJourney, setPageJourney] = useState({ name: '', steps: [''] })
  const [isExporting, setIsExporting] = useState(false)
  const [hasAutoExported, setHasAutoExported] = useState(false)
  const [fontSearch, setFontSearch] = useState('')
  const [otherPageName, setOtherPageName] = useState('')
  const [pageDetailsTab, setPageDetailsTab] = useState('main')
  const [showBuildAI, setShowBuildAI] = useState(false)

  const steps = [
    { num: 1, name: 'Project Brief', icon: FileText },
    { num: 2, name: 'Site-Map', icon: Map },
    { num: 3, name: 'Style Guide', icon: Palette },
    { num: 4, name: 'User Journeys', icon: Route },
    { num: 5, name: 'Page Details', icon: FileEdit },
    { num: 6, name: 'Assets & Files', icon: Eye },
    { num: 7, name: 'Preview & Export', icon: Download }
  ]

  // Load brief data if editing
  useEffect(() => {
    if (brief) {
      // Parse siteMap first so we can use it for menuItems migration
      const sm = typeof brief.site_map === 'string' ? JSON.parse(brief.site_map) : (brief.site_map || {})
      const parsedSiteMap = { pages: sm.pages || [], otherPages: sm.otherPages || [] }

      const sg = typeof brief.style_guide === 'string' ? JSON.parse(brief.style_guide) : (brief.style_guide || {})

      // Migrate old menuItems (string[]) to new tree format ({ id, name, children }[])
      const rawMenuItems = sg.header?.menuItems || []
      let menuItems = rawMenuItems
      if (rawMenuItems.length > 0 && typeof rawMenuItems[0] === 'string') {
        const allPg = [...flattenPages(parsedSiteMap.pages), ...(parsedSiteMap.otherPages || [])]
        menuItems = rawMenuItems.map(id => {
          const pg = allPg.find(p => p.id === id)
          return pg ? { id, name: pg.name, children: [] } : null
        }).filter(Boolean)
      }

      setBriefData({
        id: brief.id,
        projectName: brief.project_name || '',
        whatBuilding: brief.what_building || '',
        whyBuilding: brief.why_building || '',
        whoUsing: brief.who_using || '',
        successGoals: brief.success_goals || '',
        styleGuide: {
          theme: sg.theme || 'light',
          primaryColor: sg.primaryColor || '#102542',
          secondaryColor: sg.secondaryColor || '#f87060',
          shadows: sg.shadows || 'subtle',
          borderRadius: sg.borderRadius || '8px',
          spacing: sg.spacing || 'comfortable',
          animations: sg.animations || 'smooth',
          typography: sg.typography || 'Inter',
          logo: sg.logo || null,
          header: {
            enabled: sg.header?.enabled !== false,
            layout: sg.header?.layout || 'logo-left',
            menuItems,
            notes: sg.header?.notes || ''
          },
          footer: sg.footer || { enabled: true, columns: 2, copyright: true }
        },
        siteMap: parsedSiteMap,
        userJourneys: typeof brief.user_journeys === 'string' ? JSON.parse(brief.user_journeys) : (brief.user_journeys || []),
        pageContent: typeof brief.page_content === 'string' ? JSON.parse(brief.page_content) : (brief.page_content || {}),
        generalAssets: typeof brief.general_assets === 'string' ? JSON.parse(brief.general_assets) : (brief.general_assets || { images: [], files: [] })
      })
    }
  }, [brief])

  // Auto-export if flag is set (only once)
  useEffect(() => {
    if (autoExport && briefData.projectName && !hasAutoExported && !isExporting) {
      setHasAutoExported(true)
      // Small delay to ensure modal is fully rendered
      setTimeout(() => {
        handleExportPDF()
      }, 500)
    }
  }, [autoExport, briefData.projectName])

  const updateBrief = (field, value) => {
    setBriefData(prev => ({ ...prev, [field]: value }))
  }

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message })
  }

  const closeNotification = () => {
    setNotification({ isOpen: false, type: 'info', title: '', message: '' })
  }

  // Flatten pages helper
  const flattenPages = (pages, level = 0) => {
    let result = []
    pages.forEach(page => {
      result.push({ ...page, level })
      if (page.children && page.children.length > 0) {
        result = result.concat(flattenPages(page.children, level + 1))
      }
    })
    return result
  }

  // Page content handlers
  const updatePageContent = (pageId, content) => {
    setBriefData(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...(prev.pageContent[pageId] || {}),
          content
        }
      }
    }))
  }

  const compressImage = (dataUrl, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = dataUrl
    })
  }

  const handleImageUpload = (pageId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const compressed = await compressImage(event.target.result)
          setBriefData(prev => ({
            ...prev,
            pageContent: {
              ...prev.pageContent,
              [pageId]: {
                ...prev.pageContent[pageId],
                images: [...(prev.pageContent[pageId]?.images || []), compressed]
              }
            }
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const removeImage = (pageId, imageIndex) => {
    setBriefData(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          images: prev.pageContent[pageId].images.filter((_, i) => i !== imageIndex)
        }
      }
    }))
  }

  const downloadImage = (imageUrl, index) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `image-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileUpload = (pageId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt'
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      const fileDataPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              url: event.target.result
            })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(fileDataPromises).then(fileData => {
        setBriefData(prev => ({
          ...prev,
          pageContent: {
            ...prev.pageContent,
            [pageId]: {
              ...prev.pageContent[pageId],
              files: [...(prev.pageContent[pageId]?.files || []), ...fileData]
            }
          }
        }))
      })
    }
    input.click()
  }

  const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const removeFile = (pageId, fileIndex) => {
    setBriefData(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          files: prev.pageContent[pageId].files.filter((_, i) => i !== fileIndex)
        }
      }
    }))
  }

  // General assets handlers
  const handleGeneralImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      const imageDataPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = async (event) => {
            const compressed = await compressImage(event.target.result)
            resolve(compressed)
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(imageDataPromises).then(imageData => {
        setBriefData(prev => ({
          ...prev,
          generalAssets: {
            ...prev.generalAssets,
            images: [...prev.generalAssets.images, ...imageData]
          }
        }))
      })
    }
    input.click()
  }

  const handleGeneralFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt'
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      const fileDataPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (event) => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              url: event.target.result
            })
          }
          reader.readAsDataURL(file)
        })
      })

      Promise.all(fileDataPromises).then(fileData => {
        setBriefData(prev => ({
          ...prev,
          generalAssets: {
            ...prev.generalAssets,
            files: [...prev.generalAssets.files, ...fileData]
          }
        }))
      })
    }
    input.click()
  }

  const handleLogoUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const compressed = await compressImage(event.target.result, 800, 0.85)
          setBriefData(prev => ({
            ...prev,
            styleGuide: { ...prev.styleGuide, logo: compressed }
          }))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addOtherPage = () => {
    if (otherPageName.trim()) {
      const newPage = { id: Date.now().toString(), name: otherPageName.trim() }
      updateBrief('siteMap', { ...briefData.siteMap, otherPages: [...(briefData.siteMap.otherPages || []), newPage] })
      setOtherPageName('')
    }
  }

  const removeOtherPage = (pageId) => {
    updateBrief('siteMap', { ...briefData.siteMap, otherPages: briefData.siteMap.otherPages.filter(p => p.id !== pageId) })
  }

  const updateStyleGuideHeader = (updates) => {
    updateBrief('styleGuide', { ...briefData.styleGuide, header: { ...(briefData.styleGuide.header || {}), ...updates } })
  }

  const updateStyleGuideFooter = (updates) => {
    updateBrief('styleGuide', { ...briefData.styleGuide, footer: { ...(briefData.styleGuide.footer || {}), ...updates } })
  }

  const toggleHeaderMenuItem = (pageId) => {
    const current = briefData.styleGuide.header?.menuItems || []
    const updated = current.includes(pageId) ? current.filter(id => id !== pageId) : [...current, pageId]
    updateStyleGuideHeader({ menuItems: updated })
  }

  const removeGeneralImage = (imageIndex) => {
    setBriefData(prev => ({
      ...prev,
      generalAssets: {
        ...prev.generalAssets,
        images: prev.generalAssets.images.filter((_, i) => i !== imageIndex)
      }
    }))
  }

  const removeGeneralFile = (fileIndex) => {
    setBriefData(prev => ({
      ...prev,
      generalAssets: {
        ...prev.generalAssets,
        files: prev.generalAssets.files.filter((_, i) => i !== fileIndex)
      }
    }))
  }

  // Page-specific journey handlers
  const addPageJourney = (pageId) => {
    if (pageJourney.name.trim() && pageJourney.steps.some(s => s.trim())) {
      setBriefData(prev => ({
        ...prev,
        pageContent: {
          ...prev.pageContent,
          [pageId]: {
            ...prev.pageContent[pageId],
            userJourneys: [...(prev.pageContent[pageId]?.userJourneys || []), { ...pageJourney }]
          }
        }
      }))
      setPageJourney({ name: '', steps: [''] })
    }
  }

  const removePageJourney = (pageId, index) => {
    setBriefData(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          userJourneys: prev.pageContent[pageId].userJourneys.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const addPageJourneyStep = () => {
    setPageJourney(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }))
    // Auto-focus on the new input after it's created
    setTimeout(() => {
      const inputs = document.querySelectorAll('.page-journey-step-input')
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus()
      }
    }, 50)
  }

  const updatePageJourneyStep = (index, value) => {
    setPageJourney(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }))
  }

  const removePageJourneyStep = (index) => {
    if (pageJourney.steps.length > 1) {
      setPageJourney(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }))
    }
  }

  // Forms handlers
  const [pageForm, setPageForm] = useState({ name: '', fields: [{ label: '', type: 'text' }] })

  const addPageForm = (pageId) => {
    if (pageForm.name.trim() && pageForm.fields.some(f => f.label.trim())) {
      setBriefData(prev => ({
        ...prev,
        pageContent: {
          ...prev.pageContent,
          [pageId]: {
            ...prev.pageContent[pageId],
            forms: [...(prev.pageContent[pageId]?.forms || []), { ...pageForm, fields: pageForm.fields.filter(f => f.label.trim()) }]
          }
        }
      }))
      setPageForm({ name: '', fields: [{ label: '', type: 'text' }] })
    }
  }

  const removePageForm = (pageId, index) => {
    setBriefData(prev => ({
      ...prev,
      pageContent: {
        ...prev.pageContent,
        [pageId]: {
          ...prev.pageContent[pageId],
          forms: prev.pageContent[pageId].forms.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const addFormField = () => {
    setPageForm(prev => ({ ...prev, fields: [...prev.fields, { label: '', type: 'text' }] }))
    setTimeout(() => {
      const inputs = document.querySelectorAll('.form-field-label-input')
      if (inputs.length > 0) inputs[inputs.length - 1].focus()
    }, 50)
  }

  const updateFormField = (index, key, value) => {
    setPageForm(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, [key]: value } : f)
    }))
  }

  const removeFormField = (index) => {
    if (pageForm.fields.length > 1) {
      setPageForm(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }))
    }
  }

  // User Journey handlers
  const addJourney = () => {
    if (newJourney.name.trim() && newJourney.steps.some(s => s.trim())) {
      setBriefData(prev => ({
        ...prev,
        userJourneys: [...prev.userJourneys, { ...newJourney }]
      }))
      setNewJourney({ name: '', steps: [''] })
    }
  }

  const removeJourney = (index) => {
    setBriefData(prev => ({
      ...prev,
      userJourneys: prev.userJourneys.filter((_, i) => i !== index)
    }))
  }

  const addJourneyStep = () => {
    setNewJourney(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }))
    // Auto-focus on the new input after it's created
    setTimeout(() => {
      const inputs = document.querySelectorAll('.journey-step-input')
      if (inputs.length > 0) {
        inputs[inputs.length - 1].focus()
      }
    }, 50)
  }

  const updateJourneyStep = (index, value) => {
    setNewJourney(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }))
  }

  const removeJourneyStep = (index) => {
    if (newJourney.steps.length > 1) {
      setNewJourney(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
      }))
    }
  }

  // Returns true if a ReactQuill value is effectively empty (e.g. "<p><br></p>")
  const isQuillEmpty = (html) => !html || html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim() === ""

  // Generate preview HTML for PDF export
  const generatePreviewHTML = () => {
    console.log('🔍 Generating Preview HTML with general assets:', briefData.generalAssets)

    const generateSiteMapText = (pages, prefix = '') => {
      let result = ''
      pages.forEach((page, index) => {
        const isLast = index === pages.length - 1
        const connector = isLast ? '└── ' : '├── '
        const childPrefix = prefix + (isLast ? '    ' : '│   ')
        result += prefix + connector + page.name + '\n'
        if (page.children && page.children.length > 0) {
          result += generateSiteMapText(page.children, childPrefix)
        }
      })
      return result
    }

    const allPages = [...flattenPages(briefData.siteMap.pages || []), ...(briefData.siteMap.otherPages || [])]

    return `
      <div style="background: white; padding: 32px; font-family: Geologica, sans-serif;">
        <!-- Header -->
        <div id="pdf-header" style="margin-bottom: 32px;">
          <h3 style="font-size: 20px; font-weight: bold; color: #102542; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #102542;">
            ${briefData.projectName || 'Untitled Project'}
          </h3>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 16px;">
            ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
            <div style="background: #eff6ff; padding: 16px; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #102542;">${allPages.length}</div>
              <div style="font-size: 14px; color: #6b7280;">Total Pages</div>
            </div>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${briefData.userJourneys?.length || 0}</div>
              <div style="font-size: 14px; color: #6b7280;">User Journeys</div>
            </div>
            <div style="background: #faf5ff; padding: 16px; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${Object.keys(briefData.pageContent || {}).filter(key => briefData.pageContent[key]?.content).length}</div>
              <div style="font-size: 14px; color: #6b7280;">Pages with Content</div>
            </div>
          </div>
        </div>

        <!-- Section 1: Project Brief -->
        <div id="pdf-section-1" style="margin-bottom: 32px;">
          <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
            <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
              <span class="pdf-number">1</span>
            </div>
            Project Brief
          </h4>
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px;">
            <div style="margin-bottom: 16px;">
              <p style="font-weight: 600; color: #374151; margin-bottom: 4px;">What are you building?</p>
              <p style="color: #6b7280;">${briefData.whatBuilding || 'Not specified'}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="font-weight: 600; color: #374151; margin-bottom: 4px;">Why are you building it?</p>
              <p style="color: #6b7280;">${briefData.whyBuilding || 'Not specified'}</p>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="font-weight: 600; color: #374151; margin-bottom: 4px;">Who will use it?</p>
              <p style="color: #6b7280;">${briefData.whoUsing || 'Not specified'}</p>
            </div>
            ${briefData.successGoals ? `
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 4px;">Success Goals</p>
                <p style="color: #6b7280;">${briefData.successGoals}</p>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Section SG: Style Guide -->
        <div id="pdf-section-sg" style="margin-bottom: 32px;">
          <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
            <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
              <span class="pdf-number">3</span>
            </div>
            Style Guide
          </h4>
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px;">

            <!-- Theme + Logo row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Theme</p>
                <div style="padding: 14px; background: ${(briefData.styleGuide?.theme||'light') === 'dark' ? '#111827' : 'white'}; border-radius: 8px; border: 2px solid #102542;">
                  <div style="height: 8px; background: ${(briefData.styleGuide?.theme||'light') === 'dark' ? '#4b5563' : '#e5e7eb'}; border-radius: 4px; margin-bottom: 8px; width: 75%;"></div>
                  <div style="height: 8px; background: ${(briefData.styleGuide?.theme||'light') === 'dark' ? '#374151' : '#f3f4f6'}; border-radius: 4px; margin-bottom: 8px;"></div>
                  <div style="height: 8px; background: ${(briefData.styleGuide?.theme||'light') === 'dark' ? '#374151' : '#f3f4f6'}; border-radius: 4px; width: 50%;"></div>
                  <p style="font-size: 13px; font-weight: 700; color: ${(briefData.styleGuide?.theme||'light') === 'dark' ? '#ffffff' : '#374151'}; margin: 10px 0 0 0;">${(briefData.styleGuide?.theme||'light') === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Logo</p>
                ${briefData.styleGuide?.logo
                  ? `<div style="padding: 10px; background: white; border-radius: 8px; border: 2px solid #102542; display: flex; align-items: center; justify-content: center; min-height: 72px;">
                      <img src="${briefData.styleGuide.logo}" style="max-height: 60px; max-width: 100%; object-fit: contain;" />
                    </div>`
                  : `<div style="padding: 14px; background: #f9fafb; border-radius: 8px; border: 2px solid #e5e7eb; font-size: 13px; color: #9ca3af; font-style: italic;">No logo uploaded</div>`
                }
              </div>
            </div>

            <!-- Colors + Typography row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Primary Color</p>
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 8px; border: 2px solid #102542;">
                  <div style="width: 40px; height: 40px; border-radius: 6px; background: ${briefData.styleGuide?.primaryColor || '#102542'}; flex-shrink: 0;"></div>
                  <span style="font-family: monospace; font-size: 14px; color: #374151; font-weight: 600;">${briefData.styleGuide?.primaryColor || '#102542'}</span>
                </div>
              </div>
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Secondary Color</p>
                <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 8px; border: 2px solid #102542;">
                  <div style="width: 40px; height: 40px; border-radius: 6px; background: ${briefData.styleGuide?.secondaryColor || '#f87060'}; flex-shrink: 0;"></div>
                  <span style="font-family: monospace; font-size: 14px; color: #374151; font-weight: 600;">${briefData.styleGuide?.secondaryColor || '#f87060'}</span>
                </div>
              </div>
              <div>
                <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Typography</p>
                <div style="padding: 10px; background: white; border-radius: 8px; border: 2px solid #102542;">
                  <p style="font-size: 14px; font-weight: 700; color: #102542; margin: 0 0 4px 0;">${briefData.styleGuide?.typography || 'Inter'}</p>
                  <p style="font-size: 12px; color: #6b7280; margin: 0;">Aa Bb Cc 123</p>
                </div>
              </div>
            </div>

            <!-- Shadows -->
            <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Shadows</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
              ${[
                { value: 'none', label: 'None', shadow: 'none', border: '2px solid #e5e7eb' },
                { value: 'subtle', label: 'Subtle', shadow: '0 1px 3px rgba(0,0,0,0.12)', border: '1px solid #e5e7eb' },
                { value: 'medium', label: 'Medium', shadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none' },
                { value: 'heavy', label: 'Heavy', shadow: '0 20px 25px rgba(0,0,0,0.15)', border: 'none' },
              ].map(opt => `
                <div style="padding: 12px; border-radius: 8px; border: ${(briefData.styleGuide?.shadows||'subtle') === opt.value ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.shadows||'subtle') === opt.value ? '#f0f4ff' : 'white'};">
                  <div style="width: 100%; height: 32px; background: white; border-radius: 6px; box-shadow: ${opt.shadow}; border: ${opt.border}; margin-bottom: 8px;"></div>
                  <div style="font-size: 13px; font-weight: 600; text-align: center; color: ${(briefData.styleGuide?.shadows||'subtle') === opt.value ? '#102542' : '#374151'};">${opt.label}</div>
                </div>
              `).join('')}
            </div>

            <!-- Border Radius -->
            <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Border Radius</p>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 20px;">
              ${[
                { value: '0px', label: '0px', radius: '0px' },
                { value: '4px', label: '4px', radius: '4px' },
                { value: '8px', label: '8px', radius: '8px' },
                { value: '16px', label: '16px', radius: '16px' },
                { value: 'full', label: 'Full', radius: '999px' },
              ].map(opt => `
                <div style="padding: 12px; border-radius: 8px; border: ${(briefData.styleGuide?.borderRadius||'8px') === opt.value ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.borderRadius||'8px') === opt.value ? '#f0f4ff' : 'white'};">
                  <div style="width: 100%; height: 28px; background: rgba(16,37,66,0.15); border-radius: ${opt.radius}; margin-bottom: 8px;"></div>
                  <div style="font-size: 13px; font-weight: 600; text-align: center; color: ${(briefData.styleGuide?.borderRadius||'8px') === opt.value ? '#102542' : '#374151'};">${opt.label}</div>
                </div>
              `).join('')}
            </div>

            <!-- Spacing -->
            <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Spacing</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
              ${[
                { value: 'compact', label: 'Compact', desc: 'Tight, dense layout', lines: [0,0,0] },
                { value: 'comfortable', label: 'Comfortable', desc: 'Balanced whitespace', lines: [0,8,0,8,0] },
                { value: 'spacious', label: 'Spacious', desc: 'Airy, open layout', lines: [0,16,0,16,0] },
              ].map(opt => `
                <div style="padding: 16px; border-radius: 8px; border: ${(briefData.styleGuide?.spacing||'comfortable') === opt.value ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.spacing||'comfortable') === opt.value ? '#f0f4ff' : 'white'}; text-align: left;">
                  <div style="margin-bottom: 10px;">
                    <div style="height: 6px; background: #cbd5e1; border-radius: 3px; margin-bottom: ${opt.value === 'compact' ? '3' : opt.value === 'comfortable' ? '8' : '16'}px;"></div>
                    <div style="height: 6px; background: #cbd5e1; border-radius: 3px; margin-bottom: ${opt.value === 'compact' ? '3' : opt.value === 'comfortable' ? '8' : '16'}px;"></div>
                    <div style="height: 6px; background: #cbd5e1; border-radius: 3px;"></div>
                  </div>
                  <div style="font-size: 13px; font-weight: 700; color: ${(briefData.styleGuide?.spacing||'comfortable') === opt.value ? '#102542' : '#374151'};">${opt.label}</div>
                  <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">${opt.desc}</div>
                </div>
              `).join('')}
            </div>

            <!-- Animations -->
            <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Animations</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              ${[
                { value: 'none', label: 'None', desc: 'No transitions' },
                { value: 'subtle', label: 'Subtle', desc: '150ms ease' },
                { value: 'smooth', label: 'Smooth', desc: '300ms ease' },
                { value: 'playful', label: 'Playful', desc: '500ms spring' },
              ].map(opt => `
                <div style="padding: 16px; border-radius: 8px; border: ${(briefData.styleGuide?.animations||'smooth') === opt.value ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.animations||'smooth') === opt.value ? '#f0f4ff' : 'white'}; text-align: left;">
                  <div style="font-size: 14px; font-weight: 700; color: ${(briefData.styleGuide?.animations||'smooth') === opt.value ? '#102542' : '#374151'}; margin-bottom: 4px;">${opt.label}</div>
                  <div style="font-size: 12px; color: #9ca3af;">${opt.desc}</div>
                </div>
              `).join('')}
            </div>

          <!-- Header + Footer -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <div>
              <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Header</p>
              <div style="padding: 14px; border-radius: 8px; border: ${(briefData.styleGuide?.header?.enabled !== false) ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.header?.enabled !== false) ? '#f0f4ff' : 'white'};">
                <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: ${(briefData.styleGuide?.header?.enabled !== false) ? '#dcfce7' : '#f3f4f6'}; color: ${(briefData.styleGuide?.header?.enabled !== false) ? '#15803d' : '#6b7280'}; display: inline-block; margin-bottom: 10px;">${(briefData.styleGuide?.header?.enabled !== false) ? 'Enabled' : 'Disabled'}</span>
                ${briefData.styleGuide?.header?.layout === 'logo-center'
                  ? `<div style="display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid #e5e7eb; border-radius: 4px; padding: 6px 8px; margin-bottom: 8px; height: 28px;">
                      <div style="display: flex; gap: 3px;">${[1,2].map(() => `<div style="width: 18px; height: 4px; background: #d1d5db; border-radius: 2px;"></div>`).join('')}</div>
                      <div style="width: 20px; height: 14px; background: rgba(16,37,66,0.2); border-radius: 3px; font-size: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: bold;">L</div>
                      <div style="display: flex; gap: 3px;">${[1,2].map(() => `<div style="width: 18px; height: 4px; background: #d1d5db; border-radius: 2px;"></div>`).join('')}</div>
                    </div>`
                  : briefData.styleGuide?.header?.layout === 'off-canvas'
                  ? `<div style="display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid #e5e7eb; border-radius: 4px; padding: 6px 8px; margin-bottom: 8px; height: 28px;">
                      <div style="width: 20px; height: 14px; background: rgba(16,37,66,0.2); border-radius: 3px; font-size: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: bold;">L</div>
                      <div style="display: flex; flex-direction: column; gap: 3px; align-items: flex-end;">${[1,2,3].map(() => `<div style="width: 14px; height: 2px; background: #9ca3af; border-radius: 1px;"></div>`).join('')}</div>
                    </div>`
                  : `<div style="display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid #e5e7eb; border-radius: 4px; padding: 6px 8px; margin-bottom: 8px; height: 28px;">
                      <div style="width: 20px; height: 14px; background: rgba(16,37,66,0.2); border-radius: 3px; font-size: 8px; display: flex; align-items: center; justify-content: center; color: #6b7280; font-weight: bold;">L</div>
                      <div style="display: flex; gap: 3px;">${[1,2,3].map(() => `<div style="width: 18px; height: 4px; background: #d1d5db; border-radius: 2px;"></div>`).join('')}</div>
                    </div>`
                }
                <p style="font-size: 11px; color: #6b7280; margin: 0 0 8px 0;">${briefData.styleGuide?.header?.layout === 'logo-center' ? 'Center logo' : briefData.styleGuide?.header?.layout === 'off-canvas' ? 'Off canvas (hamburger)' : 'Left logo, right menu'}</p>
                ${((briefData.styleGuide?.header?.menuItems || []).length > 0) ? `
                  <pre style="font-family: monospace; font-size: 11px; color: #4b5563; background: white; border: 1px solid #e5e7eb; border-radius: 4px; padding: 6px 8px; margin: 0; white-space: pre;">${
                    (() => {
                      const renderMenuTree = (items, prefix = '') => {
                        let out = ''
                        items.forEach((item, i) => {
                          const isLast = i === items.length - 1
                          out += prefix + (isLast ? '└── ' : '├── ') + item.name + '\n'
                          if (item.children?.length > 0) out += renderMenuTree(item.children, prefix + (isLast ? '    ' : '│   '))
                        })
                        return out.trimEnd()
                      }
                      return renderMenuTree(briefData.styleGuide.header.menuItems)
                    })()
                  }</pre>
                ` : ''}
                ${briefData.styleGuide?.header?.notes ? `<p style="font-size: 11px; color: #9ca3af; font-style: italic; margin: 8px 0 0 0;">${briefData.styleGuide.header.notes}</p>` : ''}
              </div>
            </div>
            <div>
              <p style="font-weight: 600; color: #374151; margin-bottom: 10px; font-size: 13px;">Footer</p>
              <div style="padding: 14px; border-radius: 8px; border: ${(briefData.styleGuide?.footer?.enabled !== false) ? '2px solid #102542' : '2px solid #e5e7eb'}; background: ${(briefData.styleGuide?.footer?.enabled !== false) ? '#f0f4ff' : 'white'};">
                <span style="font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: ${(briefData.styleGuide?.footer?.enabled !== false) ? '#dcfce7' : '#f3f4f6'}; color: ${(briefData.styleGuide?.footer?.enabled !== false) ? '#15803d' : '#6b7280'}; display: inline-block; margin-bottom: 10px;">${(briefData.styleGuide?.footer?.enabled !== false) ? 'Enabled' : 'Disabled'}</span>
                <div style="display: grid; grid-template-columns: repeat(${briefData.styleGuide?.footer?.columns || 2}, 1fr); gap: 4px; margin-bottom: 8px;">
                  ${Array.from({ length: briefData.styleGuide?.footer?.columns || 2 }).map(() => `<div style="height: 24px; background: rgba(16,37,66,0.08); border-radius: 4px;"></div>`).join('')}
                </div>
                <p style="font-size: 11px; color: #6b7280; margin: 0;">${briefData.styleGuide?.footer?.columns || 2} columns • ${(briefData.styleGuide?.footer?.copyright !== false) ? 'With copyright' : 'No copyright'}</p>
              </div>
            </div>
          </div>

          </div>
        </div>

        <!-- Section 2: Site-Map -->
        <div id="pdf-section-2" style="margin-bottom: 32px;">
          <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
            <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
              <span class="pdf-number">2</span>
            </div>
            Site-Map
          </h4>
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px;">
            <p style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">Main site-map</p>
            <pre style="font-family: monospace; font-size: 14px; color: #374151; white-space: pre; margin: 0 0 16px 0;">${generateSiteMapText(briefData.siteMap.pages || []) || 'No pages defined'}</pre>
            ${(briefData.siteMap.otherPages && briefData.siteMap.otherPages.length > 0) ? `
              <div style="border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <p style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">Other Pages</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${briefData.siteMap.otherPages.map(p => `<span style="padding: 4px 12px; background: white; border: 1px solid #e5e7eb; border-radius: 999px; font-size: 13px; color: #4b5563;">• ${p.name}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Section 3: User Journeys -->
        <div id="pdf-section-3" style="margin-bottom: 32px;">
          <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
            <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
              <span class="pdf-number">4</span>
            </div>
            User Journeys
          </h4>
          ${briefData.userJourneys && briefData.userJourneys.length > 0 ? briefData.userJourneys.map((journey, idx) => `
            <div id="pdf-journey-${idx}" class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
              <p style="font-weight: 600; color: #1f2937; margin-bottom: 12px; font-size: 16px;">${journey.name}</p>
              <div style="margin: 0;">
                ${journey.steps.filter(s => s.trim()).map((step, stepIdx) => `
                  <div style="display: flex; gap: 12px; color: #6b7280; margin-bottom: 8px;">
                    <span style="font-weight: 600; color: #102542;">${stepIdx + 1}.</span>
                    <span>${step}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('') : '<div style="background: #f9fafb; padding: 24px; border-radius: 8px;"><p style="color: #9ca3af; font-style: italic;">No user journeys defined</p></div>'}
        </div>

        <!-- Section 4: Page Content Details -->
        <div id="pdf-section-4" style="margin-bottom: 32px;">
          <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
            <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
              <span class="pdf-number">5</span>
            </div>
            Page Content Details
          </h4>
          ${allPages.map((page, pageIdx) => {
            const content = briefData.pageContent?.[page.id]
            if (!content || (isQuillEmpty(content.content) && (!content.images || content.images.length === 0) && (!content.files || content.files.length === 0) && (!content.userJourneys || content.userJourneys.length === 0) && (!content.forms || content.forms.length === 0))) return ''

            let html = ''

            // Page title as standalone heading with separator
            html += `
              <div class="pdf-page-title" style="margin-bottom: 16px; margin-top: 20px; overflow: visible;">
                <div style="padding: 8px 0 8px 12px; border-left: 4px solid #102542;">
                  <p style="font-weight: 700; color: #102542; font-size: 16px; margin: 0; line-height: 1.4;">${page.name}</p>
                </div>
                <div style="width: 100%; height: 1px; background: #e5e7eb; margin-top: 12px;"></div>
              </div>
            `

            // Text content in grey box (if exists)
            if (!isQuillEmpty(content.content)) {
              html += `
                <div id="pdf-page-${pageIdx}-content" class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
                  <div class="preview-content" style="color: #374151; font-size: 14px; line-height: 1.7;">${content.content
  .replace(/<h1/g, '<h1 style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px 0"')
  .replace(/<h2/g, '<h2 style="font-size:16px;font-weight:700;color:#111827;margin:0 0 8px 0"')
  .replace(/<h3/g, '<h3 style="font-size:15px;font-weight:600;color:#374151;margin:0 0 6px 0"')
  .replace(/<p(?=[^>]*style)/g, '<p')
  .replace(/<p(?![^>]*style)/g, '<p style="margin:0 0 10px 0;color:#374151"')
  .replace(/<ul/g, '<ul style="padding-left:20px;margin:0 0 10px 0;list-style-type:disc"')
  .replace(/<ol/g, '<ol style="padding-left:20px;margin:0 0 10px 0;list-style-type:decimal"')
  .replace(/<li(?![^>]*style)/g, '<li style="margin-bottom:4px"')
  .replace(/<blockquote/g, '<blockquote style="border-left:3px solid #e5e7eb;padding-left:12px;color:#6b7280;margin:0 0 10px 0"')
}</div>
                </div>
              `
            }

            // Images in grey box (if exist)
            if (content.images && content.images.length > 0) {
              html += `
                <div id="pdf-page-${pageIdx}-images" class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
                  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    ${content.images.map(img => `
                      <img src="${img}" style="width: 100%; height: auto; border-radius: 8px; border: 2px solid #e5e7eb;" />
                    `).join('')}
                  </div>
                </div>
              `
            }

            // Files in grey box (if exist)
            if (content.files && content.files.length > 0) {
              html += `
                <div id="pdf-page-${pageIdx}-files" class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="font-weight: 600; color: #374151; margin-bottom: 12px; font-size: 14px;">Files (${content.files.length})</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${content.files.map(file => `
                      <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 20px; flex-shrink: 0;">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                          </svg>
                        </div>
                        <div style="flex: 1;">
                          <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${file.name}</p>
                          <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px;">${(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `
            }

            // Page-specific user journeys - heading + each journey card as separate components
            if (content.userJourneys && content.userJourneys.length > 0) {
              html += `
                <div class="pdf-journey-heading" style="margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                  <p style="font-weight: 600; color: #374151; font-size: 14px; margin: 0;">User Journeys for ${page.name}</p>
                </div>
              `
              content.userJourneys.forEach((journey, jIdx) => {
                html += `
                  <div id="pdf-page-${pageIdx}-journey-${jIdx}" class="pdf-component" style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #e5e7eb;">
                    <p style="font-weight: 600; color: #1f2937; margin-bottom: 8px; font-size: 14px;">${journey.name}</p>
                    <div style="margin: 0;">
                      ${journey.steps.filter(s => s.trim()).map((step, stepIdx) => `
                        <div style="display: flex; gap: 8px; color: #6b7280; margin-bottom: 6px; font-size: 13px;">
                          <span style="font-weight: 600; color: #102542;">${stepIdx + 1}.</span>
                          <span>${step}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `
              })
            }

            // Page-specific forms
            if (content.forms && content.forms.length > 0) {
              html += `
                <div class="pdf-journey-heading" style="margin-top: 24px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
                  <p style="font-weight: 600; color: #374151; font-size: 14px; margin: 0;">Forms for ${page.name}</p>
                </div>
              `
              content.forms.forEach((form, fIdx) => {
                html += `
                  <div id="pdf-page-${pageIdx}-form-${fIdx}" class="pdf-component" style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #e5e7eb;">
                    <p style="font-weight: 600; color: #1f2937; margin-bottom: 12px; font-size: 14px;">${form.name}</p>
                    <table style="width: 100%; border-collapse: collapse;">
                      ${form.fields.map(field => `
                        <tr>
                          <td style="width: 60%; padding: 8px 12px; background: #f9fafb; border-radius: 6px 0 0 6px; border-bottom: 4px solid white;"><span style="display: inline-block; font-size: 13px; color: #1f2937; font-weight: 500; transform: translateY(-12px);">${field.label}</span></td>
                          <td style="width: 40%; padding: 8px 12px; background: #f9fafb; border-radius: 0 6px 6px 0; text-align: right; border-bottom: 4px solid white;">
                            <span style="display: inline-block; font-size: 11px; background: #e0e7ff; color: #3730a3; padding: 2px 10px; border-radius: 4px; font-weight: 600; text-transform: capitalize;">${field.type}</span>
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </div>
                `
              })
            }

            // Add dashed separator BEFORE parent pages (unless it's the first parent page)
            const nextPage = allPages[pageIdx + 1]
            if (nextPage && nextPage.level === 0) {
              // Check if this is the first parent page
              const firstParentIndex = allPages.findIndex(p => p.level === 0)
              const isFirstParent = pageIdx + 1 === firstParentIndex

              if (!isFirstParent) {
                html += `
                  <div class="pdf-page-separator" style="margin: 48px 0; padding: 0; overflow: visible;">
                    <div style="width: 100%; height: 0; border-top: 4px dashed #d1d5db;"></div>
                  </div>
                `
              }
            }

            return html
          }).join('')}
        </div>

        <!-- Section 5: General Assets -->
        ${(briefData.generalAssets?.images?.length > 0 || briefData.generalAssets?.files?.length > 0) ? `
          <div id="pdf-section-5" style="margin-bottom: 32px;">
            <h4 style="font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 16px; padding: 8px 0; display: flex; align-items: center; gap: 8px; overflow: visible;">
              <div class="pdf-circle" style="width: 32px; height: 32px; background: #102542; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">
                <span class="pdf-number">6</span>
              </div>
              General Assets
            </h4>

            ${briefData.generalAssets?.images?.length > 0 ? `
              <div class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 16px;">
                <p style="font-weight: 600; color: #374151; margin-bottom: 12px;">General Images (${briefData.generalAssets.images.length})</p>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                  ${briefData.generalAssets.images.map(img => `
                    <img src="${img}" style="width: 100%; height: auto; border-radius: 8px; border: 2px solid #e5e7eb;" />
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${briefData.generalAssets?.files?.length > 0 ? `
              <div class="pdf-component" style="background: #f9fafb; padding: 24px; border-radius: 8px;">
                <p style="font-weight: 600; color: #374151; margin-bottom: 12px;">General Files (${briefData.generalAssets.files.length})</p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  ${briefData.generalAssets.files.map(file => `
                    <div style="padding: 12px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
                      <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">${file.name}</p>
                      <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px;">${(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()

      const url = briefData.id
        ? `${API_URL}/api/briefs/${briefData.id}`
        : API_URL + '/api/briefs'

      const method = briefData.id ? 'PUT' : 'POST'

      console.log('Saving brief:', briefData)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(briefData)
      })

      console.log('Response status:', response.status)

      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data.success) {
        showNotification('success', 'Saved!', briefData.id ? 'Brief updated successfully!' : 'Brief saved successfully!')
        if (!briefData.id && data.brief.id) {
          setBriefData(prev => ({ ...prev, id: data.brief.id }))
        }
        // Close modal after save
        setTimeout(() => onClose(), 1500)
      } else {
        const errorMsg = data.error || data.message || 'Failed to save brief'
        console.error('Save error:', errorMsg)
        showNotification('error', 'Save Failed', errorMsg)
      }
    } catch (error) {
      console.error('Error saving brief:', error)
      showNotification('error', 'Save Failed', error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = async () => {
    if (isExporting) {
      console.log('Export already in progress, skipping...')
      return
    }

    try {
      setIsExporting(true)
      console.log('Starting PDF export...')
      console.log('General Assets:', briefData.generalAssets)

      // Close any existing notifications first
      closeNotification()

      // Wait a bit to ensure notifications are closed
      await new Promise(resolve => setTimeout(resolve, 100))

      // Create hidden preview container
      const hiddenContainer = document.createElement('div')
      hiddenContainer.style.position = 'absolute'
      hiddenContainer.style.left = '-9999px'
      hiddenContainer.style.top = '0'
      hiddenContainer.style.width = '1200px'
      hiddenContainer.style.zIndex = '-1'
      hiddenContainer.innerHTML = generatePreviewHTML()
      document.body.appendChild(hiddenContainer)

      // Wait for render and images to load
      await new Promise(resolve => setTimeout(resolve, 500))

      // Apply PDF-specific styling to circles and numbers
      const circles = hiddenContainer.querySelectorAll('.pdf-circle')
      const numbers = hiddenContainer.querySelectorAll('.pdf-number')

      circles.forEach((circle) => {
        circle.style.transform = 'translateY(10px)'
        circle.style.margin = '10px 0'
      })

      numbers.forEach((number) => {
        number.style.transform = 'translateY(-8px)'
        number.style.display = 'block'
      })

      // Ensure all h4 headings have proper height for circles
      const allH4 = hiddenContainer.querySelectorAll('h4')
      allH4.forEach(h4 => {
        h4.style.minHeight = '60px'
        h4.style.paddingTop = '12px'
        h4.style.paddingBottom = '12px'
      })

      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })

      const pdfWidth = 210
      const pdfHeight = 297
      const margin = 15
      const contentWidth = pdfWidth - (2 * margin)
      const contentHeight = pdfHeight - (2 * margin)
      let currentY = margin

      // Helper to add section to PDF with smart page breaks
      const addSectionToPDF = async (elementId, isFirstSection = false) => {
        const element = hiddenContainer.querySelector(`#${elementId}`)
        if (!element) return

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          imageTimeout: 0
        })

        const imgWidth = contentWidth
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Calculate space left on current page
        const spaceLeft = pdfHeight - currentY - margin

        // RULE 1: If section fits on current page, draw it
        if (imgHeight <= spaceLeft) {
          const imgData = canvas.toDataURL('image/jpeg', 0.95)
          pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
          currentY += imgHeight + 5
          return
        }

        // RULE 2: Section doesn't fit on current page
        // Check if it's taller than one full page
        if (imgHeight > contentHeight) {
          // Section is VERY large - we MUST split it (no choice)
          console.log(`Section ${elementId} is too large (${imgHeight}mm), splitting across pages...`)
          // For very large sections, split across pages with clean breaks
          let remainingHeight = imgHeight
          let sourceY = 0
          const canvasHeightRatio = canvas.height / imgHeight

          while (remainingHeight > 0) {
            const availableHeight = pdfHeight - currentY - margin - 5 // Reserve 5mm for spacing
            const heightToDraw = Math.min(availableHeight, remainingHeight)

            // Calculate source height in canvas pixels with proper rounding
            const sourceHeight = Math.ceil(heightToDraw * canvasHeightRatio)
            const sourceYPos = Math.floor(sourceY * canvasHeightRatio)

            // Create a temporary canvas for this slice with proper dimensions
            const sliceCanvas = document.createElement('canvas')
            sliceCanvas.width = canvas.width
            sliceCanvas.height = sourceHeight
            const sliceCtx = sliceCanvas.getContext('2d')

            // Fill with white background to avoid artifacts
            sliceCtx.fillStyle = '#ffffff'
            sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)

            // Draw the slice
            sliceCtx.drawImage(
              canvas,
              0, sourceYPos,
              canvas.width, sourceHeight,
              0, 0,
              canvas.width, sourceHeight
            )

            const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(sliceData, 'JPEG', margin, currentY, imgWidth, heightToDraw)

            remainingHeight -= heightToDraw
            sourceY += heightToDraw

            if (remainingHeight > 0) {
              pdf.addPage()
              currentY = margin
            } else {
              currentY += heightToDraw + 5
            }
          }
        } else {
          // RULE 3: Section doesn't fit on current page, but fits on a full page
          // Move to next page and draw the ENTIRE section there
          console.log(`Section ${elementId} doesn't fit on current page, moving to next page...`)
          pdf.addPage()
          currentY = margin

          const imgData = canvas.toDataURL('image/jpeg', 0.95)
          pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
          currentY += imgHeight + 5
        }
      }

      // Capture header and sections 1, style guide & 2 (these are usually small)
      await addSectionToPDF('pdf-header', true)
      await addSectionToPDF('pdf-section-1')
      await addSectionToPDF('pdf-section-2')
      await addSectionToPDF('pdf-section-sg')

      // For sections 3 & 4, capture the section header first, then each component
      // Section 3: User Journeys
      const section3 = hiddenContainer.querySelector('#pdf-section-3')
      if (section3) {
        const section3Header = section3.querySelector('h4')
        if (section3Header) {
          // Capture just the heading
          const headerCanvas = await html2canvas(section3Header, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const headerWidth = contentWidth
          const headerHeight = (headerCanvas.height * headerWidth) / headerCanvas.width
          const headerData = headerCanvas.toDataURL('image/jpeg', 0.95)

          // Check if there's enough space for heading + minimum content (40mm)
          const spaceLeft = pdfHeight - currentY - margin
          const minSpaceNeeded = headerHeight + 40

          if (spaceLeft < minSpaceNeeded) {
            // Not enough space for heading + content, move to next page
            pdf.addPage()
            currentY = margin
          }

          pdf.addImage(headerData, 'JPEG', margin, currentY, headerWidth, headerHeight)
          currentY += headerHeight + 5
        }

        // Capture each journey component
        const journeyComponents = section3.querySelectorAll('.pdf-component')
        for (let journey of journeyComponents) {
          const canvas = await html2canvas(journey, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const imgWidth = contentWidth
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          const spaceLeft = pdfHeight - currentY - margin

          // If component fits, draw it
          if (imgHeight <= spaceLeft) {
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          } else if (imgHeight > contentHeight) {
            // Component is larger than full page - must split
            let remainingHeight = imgHeight
            let sourceY = 0
            const canvasHeightRatio = canvas.height / imgHeight

            while (remainingHeight > 0) {
              const availableHeight = pdfHeight - currentY - margin - 5
              const heightToDraw = Math.min(availableHeight, remainingHeight)
              const sourceHeight = Math.ceil(heightToDraw * canvasHeightRatio)
              const sourceYPos = Math.floor(sourceY * canvasHeightRatio)

              const sliceCanvas = document.createElement('canvas')
              sliceCanvas.width = canvas.width
              sliceCanvas.height = sourceHeight
              const sliceCtx = sliceCanvas.getContext('2d')
              sliceCtx.fillStyle = '#ffffff'
              sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
              sliceCtx.drawImage(canvas, 0, sourceYPos, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)

              const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
              pdf.addImage(sliceData, 'JPEG', margin, currentY, imgWidth, heightToDraw)

              remainingHeight -= heightToDraw
              sourceY += heightToDraw

              if (remainingHeight > 0) {
                pdf.addPage()
                currentY = margin
              } else {
                currentY += heightToDraw + 5
              }
            }
          } else {
            // Component doesn't fit but is smaller than full page - move to next page
            pdf.addPage()
            currentY = margin
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          }
        }
      }

      // Section 4: Page Content Details
      const section4 = hiddenContainer.querySelector('#pdf-section-4')
      if (section4) {
        const section4Header = section4.querySelector('h4')
        if (section4Header) {
          // Capture just the heading
          const headerCanvas = await html2canvas(section4Header, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const headerWidth = contentWidth
          const headerHeight = (headerCanvas.height * headerWidth) / headerCanvas.width
          const headerData = headerCanvas.toDataURL('image/jpeg', 0.95)

          // Check if there's enough space for heading + minimum content (40mm)
          const spaceLeft = pdfHeight - currentY - margin
          const minSpaceNeeded = headerHeight + 40

          if (spaceLeft < minSpaceNeeded) {
            // Not enough space for heading + content, move to next page
            pdf.addPage()
            currentY = margin
          }

          pdf.addImage(headerData, 'JPEG', margin, currentY, headerWidth, headerHeight)
          currentY += headerHeight + 5
        }

        // Get all components, page titles, separators, and headings in order
        const allElements = Array.from(section4.children).filter(el =>
          el.classList.contains('pdf-component') ||
          el.classList.contains('pdf-page-title') ||
          el.classList.contains('pdf-page-separator') ||
          el.classList.contains('pdf-journey-heading')
        )

        for (let element of allElements) {
          // Check if it's a page title or sub-heading (User Journeys for PageName)
          if (!element.classList.contains('pdf-component')) {
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              logging: false,
              backgroundColor: '#ffffff',
              imageTimeout: 0
            })
            const imgWidth = contentWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // Page titles need less space requirement than sub-headings
            const isPageTitle = element.classList.contains('pdf-page-title')
            const minContentSpace = isPageTitle ? 20 : 30

            // Check if there's enough space for heading + minimum content
            const spaceLeft = pdfHeight - currentY - margin
            const minSpaceNeeded = imgHeight + minContentSpace

            if (spaceLeft < minSpaceNeeded) {
              // Not enough space for heading + content, move to next page
              pdf.addPage()
              currentY = margin
            }

            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
            continue
          }

          // It's a component - apply smart page break logic
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const imgWidth = contentWidth
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          const spaceLeft = pdfHeight - currentY - margin

          // If component fits, draw it
          if (imgHeight <= spaceLeft) {
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          } else if (imgHeight > contentHeight) {
            // Component is larger than full page - must split
            let remainingHeight = imgHeight
            let sourceY = 0
            const canvasHeightRatio = canvas.height / imgHeight

            while (remainingHeight > 0) {
              const availableHeight = pdfHeight - currentY - margin - 5
              const heightToDraw = Math.min(availableHeight, remainingHeight)
              const sourceHeight = Math.ceil(heightToDraw * canvasHeightRatio)
              const sourceYPos = Math.floor(sourceY * canvasHeightRatio)

              const sliceCanvas = document.createElement('canvas')
              sliceCanvas.width = canvas.width
              sliceCanvas.height = sourceHeight
              const sliceCtx = sliceCanvas.getContext('2d')
              sliceCtx.fillStyle = '#ffffff'
              sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
              sliceCtx.drawImage(canvas, 0, sourceYPos, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)

              const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
              pdf.addImage(sliceData, 'JPEG', margin, currentY, imgWidth, heightToDraw)

              remainingHeight -= heightToDraw
              sourceY += heightToDraw

              if (remainingHeight > 0) {
                pdf.addPage()
                currentY = margin
              } else {
                currentY += heightToDraw + 5
              }
            }
          } else {
            // Component doesn't fit but is smaller than full page - move to next page
            pdf.addPage()
            currentY = margin
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          }
        }
      }

      // Section 5: General Assets
      const section5 = hiddenContainer.querySelector('#pdf-section-5')
      if (section5) {
        console.log('📦 Adding Section 5 (General Assets) to PDF')

        const section5Header = section5.querySelector('h4')
        if (section5Header) {
          // Capture just the heading
          const headerCanvas = await html2canvas(section5Header, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const headerWidth = contentWidth
          const headerHeight = (headerCanvas.height * headerWidth) / headerCanvas.width
          const headerData = headerCanvas.toDataURL('image/jpeg', 0.95)

          // Check if there's enough space for heading + minimum content (40mm)
          const spaceLeft = pdfHeight - currentY - margin
          const minSpaceNeeded = headerHeight + 40

          if (spaceLeft < minSpaceNeeded) {
            // Not enough space for heading + content, move to next page
            pdf.addPage()
            currentY = margin
          }

          pdf.addImage(headerData, 'JPEG', margin, currentY, headerWidth, headerHeight)
          currentY += headerHeight + 5
        }

        // Capture each component (images section and files section)
        const assetComponents = section5.querySelectorAll('.pdf-component')
        for (let component of assetComponents) {
          const canvas = await html2canvas(component, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0
          })
          const imgWidth = contentWidth
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          const spaceLeft = pdfHeight - currentY - margin

          // If component fits, draw it
          if (imgHeight <= spaceLeft) {
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          } else if (imgHeight > contentHeight) {
            // Component is larger than full page - must split
            let remainingHeight = imgHeight
            let sourceY = 0
            const canvasHeightRatio = canvas.height / imgHeight

            while (remainingHeight > 0) {
              const availableHeight = pdfHeight - currentY - margin - 5
              const heightToDraw = Math.min(availableHeight, remainingHeight)
              const sourceHeight = Math.ceil(heightToDraw * canvasHeightRatio)
              const sourceYPos = Math.floor(sourceY * canvasHeightRatio)

              const sliceCanvas = document.createElement('canvas')
              sliceCanvas.width = canvas.width
              sliceCanvas.height = sourceHeight
              const sliceCtx = sliceCanvas.getContext('2d')
              sliceCtx.fillStyle = '#ffffff'
              sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
              sliceCtx.drawImage(canvas, 0, sourceYPos, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight)

              const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
              pdf.addImage(sliceData, 'JPEG', margin, currentY, imgWidth, heightToDraw)

              remainingHeight -= heightToDraw
              sourceY += heightToDraw

              if (remainingHeight > 0) {
                pdf.addPage()
                currentY = margin
              } else {
                currentY += heightToDraw + 5
              }
            }
          } else {
            // Component doesn't fit but is smaller than full page - move to next page
            pdf.addPage()
            currentY = margin
            const imgData = canvas.toDataURL('image/jpeg', 0.95)
            pdf.addImage(imgData, 'JPEG', margin, currentY, imgWidth, imgHeight)
            currentY += imgHeight + 5
          }
        }
      }

      // Download
      pdf.save(`${briefData.projectName || 'Brief'}.pdf`)

      // Cleanup - remove hidden container
      if (hiddenContainer && hiddenContainer.parentNode) {
        document.body.removeChild(hiddenContainer)
      }

      console.log('PDF downloaded successfully')

      // Show success notification
      setTimeout(() => {
        showNotification('success', 'Success!', 'PDF exported successfully!')
        setIsExporting(false)
      }, 300)
    } catch (error) {
      setIsExporting(false)
      console.error('Error exporting PDF:', error)

      // Cleanup - remove hidden container if it exists
      const hiddenContainers = document.querySelectorAll('div[style*="left: -9999px"]')
      hiddenContainers.forEach(container => {
        if (container && container.parentNode) {
          container.parentNode.removeChild(container)
        }
      })

      // Show error notification
      setTimeout(() => {
        showNotification('error', 'Export Failed', error.message || 'Failed to export PDF')
      }, 300)
    }
  }

  return (
    <>
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50" style={{ display: autoExport ? 'none' : 'flex' }}>
      {/* Modal Container */}
      <div className="absolute inset-0 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                {readOnly ? 'View Brief' : (briefData.id ? 'Edit Brief' : 'Create New Brief')}
              </h2>
              <p className="text-sm text-gray-600">
                {briefData.projectName || 'Untitled Project'}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              {!readOnly && (
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              )}
              {briefData.id && (
                <Button
                  variant="primary"
                  onClick={() => setShowBuildAI(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  <Wand2 size={18} />
                  Build with AI
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleExportPDF}
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Export PDF
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Steps - Hidden for viewers */}
        {!readOnly && (
          <div className="bg-white border-b-2 border-gray-200">
            <div className="flex items-center justify-between max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
              {steps.map((step, index) => (
                <div key={step.num} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      currentStep === step.num
                        ? 'bg-primary text-white shadow-lg'
                        : currentStep > step.num
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                      currentStep === step.num ? 'bg-white text-primary' : 'bg-gray-200'
                    }`}>
                      {step.num}
                    </div>
                    <span className="font-semibold text-sm hidden md:block">{step.name}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${
                      currentStep > step.num ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Step 1: Project Brief */}
            {currentStep === 1 && (
              <div className="space-y-6 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Project Brief</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={briefData.projectName}
                    onChange={(e) => updateBrief('projectName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="e.g., Task Management Platform"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    What are you building? *
                  </label>
                  <textarea
                    value={briefData.whatBuilding}
                    onChange={(e) => updateBrief('whatBuilding', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Describe what you're building..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Why are you building it? *
                  </label>
                  <textarea
                    value={briefData.whyBuilding}
                    onChange={(e) => updateBrief('whyBuilding', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="What problem does it solve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Who will use it? *
                  </label>
                  <textarea
                    value={briefData.whoUsing}
                    onChange={(e) => updateBrief('whoUsing', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Target users..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Success Goals
                  </label>
                  <textarea
                    value={briefData.successGoals}
                    onChange={(e) => updateBrief('successGoals', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="What does success look like?"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Style Guide */}
            {currentStep === 3 && (
              <div className="space-y-6 bg-white rounded-lg shadow-lg p-8">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Style Guide</h2>
                  <p className="text-gray-500 mb-6">Define the visual identity and design system for this project</p>
                </div>

                {/* Theme */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, theme: opt.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          briefData.styleGuide.theme === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {opt.value === 'light' ? (
                          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
                            <div className="h-2 bg-gray-200 rounded mb-1.5 w-3/4"></div>
                            <div className="h-2 bg-gray-100 rounded mb-1.5"></div>
                            <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                          </div>
                        ) : (
                          <div className="bg-gray-900 rounded-lg p-3 mb-3">
                            <div className="h-2 bg-gray-600 rounded mb-1.5 w-3/4"></div>
                            <div className="h-2 bg-gray-700 rounded mb-1.5"></div>
                            <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                          </div>
                        )}
                        <div className={`text-sm font-semibold ${briefData.styleGuide.theme === opt.value ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Logo</h3>
                  <Button onClick={handleLogoUpload} variant="outline" className="mb-3">
                    {briefData.styleGuide.logo ? 'Replace Logo' : 'Upload Logo'}
                  </Button>
                  {briefData.styleGuide.logo && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                      <div className="relative group">
                        <img
                          src={briefData.styleGuide.logo}
                          alt="Logo"
                          className="w-full h-32 object-contain rounded-lg border-2 border-gray-200 bg-gray-50"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => downloadImage(briefData.styleGuide.logo, 0)}
                            className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                            title="Download logo"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, logo: null })}
                            className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                            title="Remove logo"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Colors</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={briefData.styleGuide.primaryColor}
                          onChange={(e) => updateBrief('styleGuide', { ...briefData.styleGuide, primaryColor: e.target.value })}
                          className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={briefData.styleGuide.primaryColor}
                          onChange={(e) => updateBrief('styleGuide', { ...briefData.styleGuide, primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-primary"
                          placeholder="#000000"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={briefData.styleGuide.secondaryColor}
                          onChange={(e) => updateBrief('styleGuide', { ...briefData.styleGuide, secondaryColor: e.target.value })}
                          className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={briefData.styleGuide.secondaryColor}
                          onChange={(e) => updateBrief('styleGuide', { ...briefData.styleGuide, secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:border-primary"
                          placeholder="#000000"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Typography</h3>
                  {briefData.styleGuide.typography && (
                    <link key={briefData.styleGuide.typography} rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${briefData.styleGuide.typography.replace(/ /g, '+')}:wght@400;600;700&display=swap`} />
                  )}
                  <div className="flex gap-3 mb-3">
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      placeholder="Search Google Fonts..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                    {briefData.styleGuide.typography && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border-2 border-primary rounded-lg text-sm font-semibold text-primary">
                        {briefData.styleGuide.typography}
                      </div>
                    )}
                  </div>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                      {(fontSearch ? GOOGLE_FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())) : GOOGLE_FONTS).map(font => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => { updateBrief('styleGuide', { ...briefData.styleGuide, typography: font }); setFontSearch('') }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            briefData.styleGuide.typography === font
                              ? 'bg-primary text-white font-semibold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                      {fontSearch && GOOGLE_FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())).length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-400">No fonts found for "{fontSearch}"</div>
                      )}
                    </div>
                  </div>
                  {briefData.styleGuide.typography && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-400 mb-2">Preview — {briefData.styleGuide.typography}</p>
                      <p style={{ fontFamily: `'${briefData.styleGuide.typography}', sans-serif` }} className="text-2xl font-bold text-gray-800">
                        The quick brown fox
                      </p>
                      <p style={{ fontFamily: `'${briefData.styleGuide.typography}', sans-serif` }} className="text-sm text-gray-500 mt-1">
                        0123456789 ABCDEFGHIJ abcdefghij
                      </p>
                    </div>
                  )}
                </div>

                {/* Shadows */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Shadows</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 'none', label: 'None', preview: 'border-2 border-gray-200' },
                      { value: 'subtle', label: 'Subtle', preview: 'shadow-sm border border-gray-200' },
                      { value: 'medium', label: 'Medium', preview: 'shadow-md' },
                      { value: 'heavy', label: 'Heavy', preview: 'shadow-xl' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, shadows: opt.value })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          briefData.styleGuide.shadows === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-full h-8 bg-white rounded mb-2 ${opt.preview}`}></div>
                        <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Border Radius</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {[
                      { value: '0px', label: '0px', rounded: 'rounded-none' },
                      { value: '4px', label: '4px', rounded: 'rounded' },
                      { value: '8px', label: '8px', rounded: 'rounded-lg' },
                      { value: '16px', label: '16px', rounded: 'rounded-2xl' },
                      { value: 'full', label: 'Full', rounded: 'rounded-full' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, borderRadius: opt.value })}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          briefData.styleGuide.borderRadius === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-full h-8 bg-primary/20 mb-2 ${opt.rounded}`}></div>
                        <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spacing */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Spacing</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'compact', label: 'Compact', desc: 'Tight, dense layout' },
                      { value: 'comfortable', label: 'Comfortable', desc: 'Balanced whitespace' },
                      { value: 'spacious', label: 'Spacious', desc: 'Airy, open layout' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, spacing: opt.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          briefData.styleGuide.spacing === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 mb-2">
                          {opt.value === 'compact' && <><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div></>}
                          {opt.value === 'comfortable' && <><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-2"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-2"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div></>}
                          {opt.value === 'spacious' && <><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-4"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div><div className="h-4"></div><div className="h-1.5 bg-gray-300 rounded w-full"></div></>}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animations */}
                <div>
                  <h3 className="text-base font-semibold text-gray-700 mb-3">Animations</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: 'none', label: 'None', desc: 'No transitions' },
                      { value: 'subtle', label: 'Subtle', desc: '150ms ease' },
                      { value: 'smooth', label: 'Smooth', desc: '300ms ease' },
                      { value: 'playful', label: 'Playful', desc: '500ms spring' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, animations: opt.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          briefData.styleGuide.animations === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Header */}
                <div className="border-t-2 border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-700">Header</h3>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={briefData.styleGuide.header?.enabled ?? true}
                        onChange={(e) => updateStyleGuideHeader({ enabled: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-600">Enable Header</span>
                    </label>
                  </div>

                  {/* Layout choices */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { value: 'logo-left', label: 'Left logo, right menu', preview: (
                        <div className="flex items-center justify-between bg-gray-100 rounded p-2 mb-2 h-8">
                          <div className="w-8 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold">L</div>
                          <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-4 h-2 bg-gray-300 rounded"></div>)}</div>
                        </div>
                      )},
                      { value: 'logo-center', label: 'Center logo, menus left-right', preview: (
                        <div className="flex items-center justify-between bg-gray-100 rounded p-2 mb-2 h-8">
                          <div className="flex gap-1">{[1,2].map(i => <div key={i} className="w-4 h-2 bg-gray-300 rounded"></div>)}</div>
                          <div className="w-8 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold">L</div>
                          <div className="flex gap-1">{[1,2].map(i => <div key={i} className="w-4 h-2 bg-gray-300 rounded"></div>)}</div>
                        </div>
                      )},
                      { value: 'off-canvas', label: 'Off canvas (hamburger)', preview: (
                        <div className="flex items-center justify-between bg-gray-100 rounded p-2 mb-2 h-8">
                          <div className="w-8 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold">L</div>
                          <div className="flex flex-col gap-0.5 justify-center items-end">
                            {[1,2,3].map(i => <div key={i} className="w-4 h-0.5 bg-gray-400 rounded"></div>)}
                          </div>
                        </div>
                      )},
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateStyleGuideHeader({ layout: opt.value })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          (briefData.styleGuide.header?.layout || 'logo-left') === opt.value
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {opt.preview}
                        <div className="text-xs font-semibold text-gray-700">{opt.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Menu items — drag-and-drop tree builder */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Menu Items</label>
                    <MenuBuilder
                      menuItems={briefData.styleGuide.header?.menuItems || []}
                      availablePages={[...flattenPages(briefData.siteMap.pages), ...(briefData.siteMap.otherPages || [])]}
                      onChange={(newItems) => updateStyleGuideHeader({ menuItems: newItems })}
                    />
                  </div>

                  {/* Notes */}
                  <textarea
                    value={briefData.styleGuide.header?.notes || ''}
                    onChange={(e) => updateStyleGuideHeader({ notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm resize-none mb-3"
                    placeholder="General notes about the header (behaviour, sticky, transparent, etc.)..."
                  />

                </div>

                {/* Footer */}
                <div className="border-t-2 border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-700">Footer</h3>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={briefData.styleGuide.footer?.enabled ?? true}
                        onChange={(e) => updateStyleGuideFooter({ enabled: e.target.checked })}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-600">Enable Footer</span>
                    </label>
                  </div>

                  {/* Column layout */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[1, 2, 3, 4].map(cols => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => updateStyleGuideFooter({ columns: cols })}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          (briefData.styleGuide.footer?.columns || 2) === cols
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`grid gap-1 mb-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                          {Array.from({ length: cols }).map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                          ))}
                        </div>
                        <div className="text-xs font-semibold text-gray-700">{cols} Column{cols > 1 ? 's' : ''}</div>
                      </button>
                    ))}
                  </div>

                  {/* Copyright */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={briefData.styleGuide.footer?.copyright ?? true}
                      onChange={(e) => updateStyleGuideFooter({ copyright: e.target.checked })}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-gray-600">Include copyright notice at the bottom</span>
                  </label>
                </div>

              </div>
            )}

            {/* Step 2: Site-Map */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">Site-Map</h2>
                  <p className="text-gray-600 mb-6">Build a visual hierarchy of your application's pages and structure</p>
                </div>

                {/* Section 1: Main site-map */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">Main site-map</h3>
                  <SiteMapBuilder
                    pages={briefData.siteMap.pages}
                    onChange={(pages) => updateBrief('siteMap', { ...briefData.siteMap, pages })}
                  />
                </div>

                {/* Section 2: Other pages */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-primary mb-2">Other pages</h3>
                  <p className="text-gray-600 mb-4 text-sm">Add pages not part of the main navigation, like Privacy Policy, Terms of Use, etc.</p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={otherPageName}
                      onChange={(e) => setOtherPageName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOtherPage() } }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                      placeholder="e.g. Privacy Policy, Terms of Use..."
                    />
                    <Button onClick={addOtherPage} variant="primary">
                      <Plus size={16} />
                    </Button>
                  </div>

                  {(briefData.siteMap.otherPages || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {briefData.siteMap.otherPages.map(page => (
                        <div key={page.id} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
                          <span className="text-gray-700">{page.name}</span>
                          <button onClick={() => removeOtherPage(page.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No other pages added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: User Journeys */}
            {currentStep === 4 && (
              <div className="space-y-6 bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">User Journeys</h2>
                <p className="text-gray-600 mb-6">Define how users complete key tasks</p>

                <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                  <h3 className="font-semibold text-primary mb-4">Add New Journey</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Journey Name
                    </label>
                    <input
                      type="text"
                      value={newJourney.name}
                      onChange={(e) => setNewJourney(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="e.g., User Creates a Project"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Steps
                    </label>
                    <div className="space-y-2">
                      {newJourney.steps.map((step, index) => (
                        <div key={index} className="flex gap-2">
                          <span className="text-gray-500 font-semibold mt-2 w-8">{index + 1}.</span>
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => updateJourneyStep(index, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addJourneyStep()
                              }
                            }}
                            className="journey-step-input flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                            placeholder={`Step ${index + 1}...`}
                          />
                          {newJourney.steps.length > 1 && (
                            <button
                              onClick={() => removeJourneyStep(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={addJourneyStep}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Add Step
                    </Button>
                  </div>

                  <Button onClick={addJourney} variant="primary">
                    Add Journey
                  </Button>
                </div>

                <div className="space-y-4">
                  {briefData.userJourneys.map((journey, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-primary">{journey.name}</h3>
                        <button
                          onClick={() => removeJourney(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <ol className="space-y-2">
                        {journey.steps.filter(s => s.trim()).map((step, stepIndex) => (
                          <li key={stepIndex} className="flex gap-3">
                            <span className="font-semibold text-gray-500">{stepIndex + 1}.</span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                  {briefData.userJourneys.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No user journeys added yet</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Page Content Details */}
            {currentStep === 5 && (() => {
              const mainPages = flattenPages(briefData.siteMap.pages)
              const otherPages = briefData.siteMap.otherPages || []
              const activePages = pageDetailsTab === 'main' ? mainPages : otherPages
              const currentPage = activePages.find(p => p.id === activePageTab) || activePages[0]

              if (!activePageTab && activePages.length > 0) {
                setActivePageTab(activePages[0].id)
              }

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">Page Content Details</h2>
                    <p className="text-gray-600">Add descriptions, features, and images for each page</p>
                  </div>

                  {/* Tab switcher: Main Structure / Other Pages */}
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex gap-2 mb-4 border-b-2 border-gray-100 pb-4">
                      {[
                        { key: 'main', label: 'Main Structure', count: mainPages.length },
                        { key: 'other', label: 'Other Pages', count: otherPages.length },
                      ].map(tab => (
                        <button
                          key={tab.key}
                          onClick={() => { setPageDetailsTab(tab.key); setActivePageTab(null) }}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                            pageDetailsTab === tab.key
                              ? 'bg-primary text-white shadow'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {tab.label}
                          <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${pageDetailsTab === tab.key ? 'bg-white/20' : 'bg-gray-200'}`}>{tab.count}</span>
                        </button>
                      ))}
                    </div>

                  {activePages.length === 0 ? (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                      <p className="text-yellow-800 font-semibold mb-2">No {pageDetailsTab === 'main' ? 'pages in site-map' : 'other pages'} yet</p>
                      <p className="text-yellow-700 text-sm">Go back to Step 2 to add pages first</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Page Tabs */}
                      <div className="flex flex-wrap gap-2">
                        {activePages.map(page => (
                          <button
                            key={page.id}
                            onClick={() => setActivePageTab(page.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              activePageTab === page.id
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={{ paddingLeft: page.level ? `${page.level * 12 + 16}px` : undefined }}
                          >
                            {page.level > 0 && '└─ '}
                            {page.name}
                          </button>
                        ))}
                      </div>

                      {/* Page Content Editor */}
                      {currentPage && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <h3 className="text-xl font-bold text-primary mb-4">
                            {currentPage.name}
                          </h3>

                          {/* Rich Text Editor */}
                          <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Page Description & Content
                            </label>
                            <ReactQuill
                              key={currentPage.id}
                              theme="snow"
                              value={briefData.pageContent[currentPage.id]?.content || ''}
                              onChange={(content) => updatePageContent(currentPage.id, content)}
                              modules={{
                                toolbar: [
                                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                  ['bold', 'italic', 'underline', 'strike'],
                                  [{ 'color': [] }, { 'background': [] }],
                                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                                  [{ 'align': [] }],
                                  ['blockquote', 'code-block'],
                                  ['link'],
                                  ['clean']
                                ]
                              }}
                              placeholder="Describe what this page contains..."
                              className="bg-white geologica-editor"
                              style={{ height: '300px', marginBottom: '50px', fontFamily: 'Geologica, sans-serif' }}
                            />
                          </div>

                          {/* Image Upload */}
                          <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Images & Screenshots
                            </label>
                            <Button
                              onClick={() => handleImageUpload(currentPage.id)}
                              variant="outline"
                              className="mb-4"
                            >
                              Upload Image
                            </Button>

                            {briefData.pageContent[currentPage.id]?.images?.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                {briefData.pageContent[currentPage.id].images.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={image}
                                      alt={`Upload ${index + 1}`}
                                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => downloadImage(image, index)}
                                        className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                        title="Download image"
                                      >
                                        <Download size={14} />
                                      </button>
                                      <button
                                        onClick={() => removeImage(currentPage.id, index)}
                                        className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                        title="Delete image"
                                      >
                                        <X size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* File Upload */}
                          <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Files & Documents
                            </label>
                            <Button
                              onClick={() => handleFileUpload(currentPage.id)}
                              variant="outline"
                              className="mb-4"
                            >
                              Upload Files (PDF, DOC, XLS, ZIP)
                            </Button>

                            {briefData.pageContent[currentPage.id]?.files?.length > 0 && (
                              <div className="space-y-2">
                                {briefData.pageContent[currentPage.id].files.map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <File size={20} className="text-blue-600 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                          {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                      <button
                                        onClick={() => downloadFile(file.url, file.name)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Download file"
                                      >
                                        <Download size={16} />
                                      </button>
                                      <button
                                        onClick={() => removeFile(currentPage.id, index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete file"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Page-Specific User Journeys */}
                          <div className="mt-8 border-t pt-6">
                            <h5 className="text-md font-bold text-primary mb-4">User Journeys for {currentPage.name}</h5>

                            {/* Add New Journey */}
                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                              <h6 className="font-semibold text-gray-700 mb-3">Add Journey</h6>

                              <div className="mb-3">
                                <input
                                  type="text"
                                  value={pageJourney.name}
                                  onChange={(e) => setPageJourney(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                  placeholder="Journey name (e.g., User views team details)"
                                />
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Steps</label>
                                <div className="space-y-2">
                                  {pageJourney.steps.map((step, index) => (
                                    <div key={index} className="flex gap-2">
                                      <span className="text-gray-500 font-semibold mt-2 w-6 text-sm">{index + 1}.</span>
                                      <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => updatePageJourneyStep(index, e.target.value)}
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addPageJourneyStep()
                                          }
                                        }}
                                        className="page-journey-step-input flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                                        placeholder={`Step ${index + 1}...`}
                                      />
                                      {pageJourney.steps.length > 1 && (
                                        <button
                                          onClick={() => removePageJourneyStep(index)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <Button
                                  onClick={addPageJourneyStep}
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                >
                                  Add Step
                                </Button>
                              </div>

                              <Button onClick={() => addPageJourney(currentPage.id)} variant="primary" size="sm">
                                Add Journey
                              </Button>
                            </div>

                            {/* List of Journeys */}
                            <div className="space-y-3">
                              {briefData.pageContent[currentPage.id]?.userJourneys?.map((journey, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h6 className="font-bold text-gray-800 text-sm">{journey.name}</h6>
                                    <button
                                      onClick={() => removePageJourney(currentPage.id, index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <ol className="space-y-1">
                                    {journey.steps.filter(s => s.trim()).map((step, stepIndex) => (
                                      <li key={stepIndex} className="flex gap-2 text-sm">
                                        <span className="font-semibold text-gray-500">{stepIndex + 1}.</span>
                                        <span className="text-gray-700">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              ))}
                              {(!briefData.pageContent[currentPage.id]?.userJourneys || briefData.pageContent[currentPage.id]?.userJourneys.length === 0) && (
                                <p className="text-center text-gray-400 py-4 text-sm">No user journeys for this page yet</p>
                              )}
                            </div>
                          </div>

                          {/* Forms Section */}
                          <div className="mt-8 border-t pt-6">
                            <h5 className="text-md font-bold text-primary mb-4">Forms for {currentPage.name}</h5>

                            {/* Add New Form */}
                            <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 mb-4">
                              <h6 className="font-semibold text-gray-700 mb-3">Add Form</h6>

                              <div className="mb-3">
                                <input
                                  type="text"
                                  value={pageForm.name}
                                  onChange={(e) => setPageForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                  placeholder="Form name (e.g., Registration Form)"
                                />
                              </div>

                              <div className="mb-3">
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Input Fields</label>
                                <div className="space-y-2">
                                  {pageForm.fields.map((field, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                      <input
                                        type="text"
                                        value={field.label}
                                        onChange={(e) => updateFormField(index, 'label', e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault()
                                            addFormField()
                                          }
                                        }}
                                        className="form-field-label-input w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
                                        placeholder="Field label (e.g., Email Address)"
                                      />
                                      <select
                                        value={field.type}
                                        onChange={(e) => updateFormField(index, 'type', e.target.value)}
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm bg-white"
                                      >
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="password">Password</option>
                                        <option value="number">Number</option>
                                        <option value="tel">Phone</option>
                                        <option value="date">Date</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Dropdown</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="radio">Radio</option>
                                        <option value="file">File Upload</option>
                                      </select>
                                      {pageForm.fields.length > 1 && (
                                        <button onClick={() => removeFormField(index)} className="text-red-500 hover:text-red-700">
                                          <X size={16} />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <Button onClick={addFormField} variant="outline" size="sm" className="mt-2">
                                  Add Field
                                </Button>
                              </div>

                              <Button onClick={() => addPageForm(currentPage.id)} variant="primary" size="sm">
                                Add Form
                              </Button>
                            </div>

                            {/* Forms List */}
                            <div className="space-y-3">
                              {briefData.pageContent[currentPage.id]?.forms?.map((form, index) => (
                                <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-3">
                                    <h6 className="font-bold text-gray-800 text-sm">{form.name}</h6>
                                    <button onClick={() => removePageForm(currentPage.id, index)} className="text-red-600 hover:text-red-700">
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <div className="space-y-1">
                                    {form.fields.map((field, fIdx) => (
                                      <div key={fIdx} className="flex items-center gap-3 text-sm py-1.5 px-3 bg-gray-50 rounded">
                                        <span className="text-gray-800 font-medium flex-1">{field.label}</span>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold capitalize">{field.type}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                              {(!briefData.pageContent[currentPage.id]?.forms || briefData.pageContent[currentPage.id]?.forms.length === 0) && (
                                <p className="text-center text-gray-400 py-4 text-sm">No forms for this page yet</p>
                              )}
                            </div>
                          </div>

                        </div>
                      )}
                    </div>
                  )}
                  </div>
                </div>
              )
            })()}

            {/* Step 6: Assets & Files */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye size={32} className="text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Assets & Files Overview</h2>
                      <p className="text-gray-600">All uploaded images and files organized by page</p>
                    </div>
                  </div>

                  {/* Brand Assets */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary">
                      Brand Assets
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
                      <Button onClick={handleLogoUpload} variant="outline" className="mb-3">
                        {briefData.styleGuide.logo ? 'Replace Logo' : 'Upload Logo'}
                      </Button>
                      {briefData.styleGuide.logo ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                          <div className="relative group">
                            <img
                              src={briefData.styleGuide.logo}
                              alt="Logo"
                              className="w-full h-32 object-contain rounded-lg border-2 border-gray-200 bg-white"
                            />
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => downloadImage(briefData.styleGuide.logo, 0)}
                                className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                title="Download logo"
                              >
                                <Download size={14} />
                              </button>
                              <button
                                onClick={() => updateBrief('styleGuide', { ...briefData.styleGuide, logo: null })}
                                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                title="Remove logo"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 mt-2">No logo uploaded yet</p>
                      )}
                    </div>
                  </div>

                  {/* Page-Specific Assets */}
                  {flattenPages(briefData.siteMap.pages).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary">
                        Page-Specific Assets
                      </h3>

                      {flattenPages(briefData.siteMap.pages).map((page, index) => {
                        const pageImages = briefData.pageContent[page.id]?.images || []
                        const pageFiles = briefData.pageContent[page.id]?.files || []

                        if (pageImages.length === 0 && pageFiles.length === 0) return null

                        return (
                          <div key={page.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-bold text-gray-800 mb-4">
                              {page.level > 0 && '└─ '}
                              {page.name}
                            </h4>

                            {/* Page Images */}
                            {pageImages.length > 0 && (
                              <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Images ({pageImages.length})
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                  {pageImages.map((image, idx) => (
                                    <div key={idx} className="relative group">
                                      <img
                                        src={image}
                                        alt={`${page.name} - Image ${idx + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                      />
                                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => downloadImage(image, idx)}
                                          className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                          title="Download image"
                                        >
                                          <Download size={14} />
                                        </button>
                                        <button
                                          onClick={() => removeImage(page.id, idx)}
                                          className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                          title="Delete image"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Page Files */}
                            {pageFiles.length > 0 && (
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Files ({pageFiles.length})
                                </label>
                                <div className="space-y-2">
                                  {pageFiles.map((file, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <File size={20} className="text-blue-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(file.size / 1024).toFixed(1)} KB
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 flex-shrink-0">
                                        <button
                                          onClick={() => downloadFile(file.url, file.name)}
                                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Download file"
                                        >
                                          <Download size={16} />
                                        </button>
                                        <button
                                          onClick={() => removeFile(page.id, idx)}
                                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete file"
                                        >
                                          <X size={16} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* General Assets */}
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary">
                      General Assets
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload images and files not tied to specific pages
                    </p>

                    {/* General Images */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        General Images
                      </label>
                      <Button
                        onClick={handleGeneralImageUpload}
                        variant="outline"
                        className="mb-4"
                      >
                        Upload Images
                      </Button>

                      {briefData.generalAssets.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                          {briefData.generalAssets.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`General Image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => downloadImage(image, index)}
                                  className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                  title="Download image"
                                >
                                  <Download size={14} />
                                </button>
                                <button
                                  onClick={() => removeGeneralImage(index)}
                                  className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                  title="Delete image"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* General Files */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        General Files
                      </label>
                      <Button
                        onClick={handleGeneralFileUpload}
                        variant="outline"
                        className="mb-4"
                      >
                        Upload Files (PDF, DOC, XLS, ZIP)
                      </Button>

                      {briefData.generalAssets.files.length > 0 && (
                        <div className="space-y-2">
                          {briefData.generalAssets.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <File size={20} className="text-blue-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => downloadFile(file.url, file.name)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Download file"
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  onClick={() => removeGeneralFile(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete file"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Preview & Export */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div id="brief-preview-content" className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye size={32} className="text-primary" />
                    <div>
                      <h2 className="text-2xl font-bold text-primary">Preview & Export</h2>
                      <p className="text-gray-600">Review your complete brief before exporting</p>
                    </div>
                  </div>

                  {/* Project Overview */}
                  <div id="pdf-header" className="mb-8">
                    <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary">
                      {briefData.projectName || 'Untitled Project'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Created on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {briefData.siteMap.pages ? flattenPages(briefData.siteMap.pages).length : 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Pages</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {briefData.userJourneys ? briefData.userJourneys.length : 0}
                        </div>
                        <div className="text-sm text-gray-600">User Journeys</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {briefData.pageContent ? Object.keys(briefData.pageContent).filter(key => briefData.pageContent[key]?.content).length : 0}
                        </div>
                        <div className="text-sm text-gray-600">Pages with Content</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Project Brief */}
                  <div id="pdf-section-1" className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                        <span className="pdf-number">1</span>
                      </div>
                      Project Brief
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">What are you building?</p>
                        <p className="text-gray-600">{briefData.whatBuilding || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Why are you building it?</p>
                        <p className="text-gray-600">{briefData.whyBuilding || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700 mb-1">Who will use it?</p>
                        <p className="text-gray-600">{briefData.whoUsing || 'Not specified'}</p>
                      </div>
                      {briefData.successGoals && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-1">Success Goals</p>
                          <p className="text-gray-600">{briefData.successGoals}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Site-Map (moved before Style Guide) */}
                  <div id="pdf-section-2" className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                        <span className="pdf-number">2</span>
                      </div>
                      Site-Map
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Main site-map</p>
                      {briefData.siteMap.pages && briefData.siteMap.pages.length > 0 ? (
                        <div className="font-mono text-sm text-gray-700 whitespace-pre mb-4">
                          {(() => {
                            const generatePreview = (pages, prefix = '') => {
                              let result = ''
                              pages.forEach((page, index) => {
                                const isLast = index === pages.length - 1
                                const connector = isLast ? '└── ' : '├── '
                                const childPrefix = prefix + (isLast ? '    ' : '│   ')
                                result += prefix + connector + page.name + '\n'
                                if (page.children && page.children.length > 0) {
                                  result += generatePreview(page.children, childPrefix)
                                }
                              })
                              return result
                            }
                            return generatePreview(briefData.siteMap.pages)
                          })()}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic mb-4">No pages defined</p>
                      )}
                      {(briefData.siteMap.otherPages || []).length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Other Pages</p>
                          <div className="flex flex-wrap gap-2">
                            {briefData.siteMap.otherPages.map(p => (
                              <span key={p.id} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600">• {p.name}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section SG: Style Guide */}
                  {briefData.styleGuide?.typography && (
                    <link key={briefData.styleGuide.typography} rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${briefData.styleGuide.typography.replace(/ /g, '+')}:wght@400;600;700&display=swap`} />
                  )}
                  <div id="pdf-section-sg" className="mb-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                        <span className="pdf-number">3</span>
                      </div>
                      Style Guide
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-5">
                      {/* Theme + Logo */}
                      <div className="grid grid-cols-2 gap-4 mb-1">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Theme</p>
                          <div className={`p-3 rounded-lg border-2 border-primary ${briefData.styleGuide?.theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                            <div className={`h-2 rounded mb-1.5 w-3/4 ${briefData.styleGuide?.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                            <div className={`h-2 rounded mb-1 ${briefData.styleGuide?.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
                            <p className={`text-xs font-semibold mt-2 ${briefData.styleGuide?.theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                              {briefData.styleGuide?.theme === 'dark' ? 'Dark' : 'Light'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Logo</p>
                          {briefData.styleGuide?.logo ? (
                            <div className="p-2 bg-white border-2 border-primary rounded-lg inline-flex items-center justify-center h-16">
                              <img src={briefData.styleGuide.logo} alt="Logo" className="h-full max-w-full object-contain" />
                            </div>
                          ) : (
                            <div className="p-3 bg-white border-2 border-gray-200 rounded-lg text-xs text-gray-400 italic">No logo uploaded</div>
                          )}
                        </div>
                      </div>
                      {/* Colors + Typography */}
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Primary Color</p>
                          <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-primary rounded-lg">
                            <div className="w-9 h-9 rounded flex-shrink-0" style={{ backgroundColor: briefData.styleGuide?.primaryColor || '#102542' }}></div>
                            <span className="font-mono text-sm font-semibold">{briefData.styleGuide?.primaryColor || '#102542'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Secondary Color</p>
                          <div className="flex items-center gap-2 p-2.5 bg-white border-2 border-primary rounded-lg">
                            <div className="w-9 h-9 rounded flex-shrink-0" style={{ backgroundColor: briefData.styleGuide?.secondaryColor || '#f87060' }}></div>
                            <span className="font-mono text-sm font-semibold">{briefData.styleGuide?.secondaryColor || '#f87060'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Typography</p>
                          <div className="p-2.5 bg-white border-2 border-primary rounded-lg">
                            <p className="text-sm font-bold text-primary">{briefData.styleGuide?.typography || 'Inter'}</p>
                            <p className="text-xs text-gray-400">Aa Bb Cc 123</p>
                          </div>
                        </div>
                      </div>
                      {/* Shadows */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Shadows</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: 'none', label: 'None', cls: 'border-2 border-gray-200' },
                            { value: 'subtle', label: 'Subtle', cls: 'shadow-sm border border-gray-200' },
                            { value: 'medium', label: 'Medium', cls: 'shadow-md' },
                            { value: 'heavy', label: 'Heavy', cls: 'shadow-xl' },
                          ].map(opt => (
                            <div key={opt.value} className={`p-3 rounded-lg border-2 ${(briefData.styleGuide?.shadows||'subtle') === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                              <div className={`w-full h-7 bg-white rounded mb-2 ${opt.cls}`}></div>
                              <p className={`text-xs font-semibold text-center ${(briefData.styleGuide?.shadows||'subtle') === opt.value ? 'text-primary' : 'text-gray-600'}`}>{opt.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Border Radius */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">Border Radius</p>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { value: '0px', label: '0px', cls: 'rounded-none' },
                            { value: '4px', label: '4px', cls: 'rounded' },
                            { value: '8px', label: '8px', cls: 'rounded-lg' },
                            { value: '16px', label: '16px', cls: 'rounded-2xl' },
                            { value: 'full', label: 'Full', cls: 'rounded-full' },
                          ].map(opt => (
                            <div key={opt.value} className={`p-3 rounded-lg border-2 ${(briefData.styleGuide?.borderRadius||'8px') === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                              <div className={`w-full h-7 bg-primary/20 mb-2 ${opt.cls}`}></div>
                              <p className={`text-xs font-semibold text-center ${(briefData.styleGuide?.borderRadius||'8px') === opt.value ? 'text-primary' : 'text-gray-600'}`}>{opt.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Spacing + Animations */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Spacing</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: 'compact', label: 'Compact', desc: 'Tight, dense layout', gap: 'gap-0.5' },
                              { value: 'comfortable', label: 'Comfortable', desc: 'Balanced whitespace', gap: 'gap-2' },
                              { value: 'spacious', label: 'Spacious', desc: 'Airy, open layout', gap: 'gap-4' },
                            ].map(opt => (
                              <div key={opt.value} className={`p-3 rounded-lg border-2 ${(briefData.styleGuide?.spacing||'comfortable') === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                                <div className={`flex flex-col ${opt.gap} mb-2`}>
                                  <div className="h-1.5 bg-gray-300 rounded"></div>
                                  <div className="h-1.5 bg-gray-300 rounded"></div>
                                  <div className="h-1.5 bg-gray-300 rounded"></div>
                                </div>
                                <p className={`text-xs font-semibold ${(briefData.styleGuide?.spacing||'comfortable') === opt.value ? 'text-primary' : 'text-gray-600'}`}>{opt.label}</p>
                                <p className="text-xs text-gray-400">{opt.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 mb-2">Animations</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'none', label: 'None', desc: 'No transitions' },
                              { value: 'subtle', label: 'Subtle', desc: '150ms ease' },
                              { value: 'smooth', label: 'Smooth', desc: '300ms ease' },
                              { value: 'playful', label: 'Playful', desc: '500ms spring' },
                            ].map(opt => (
                              <div key={opt.value} className={`p-3 rounded-lg border-2 ${(briefData.styleGuide?.animations||'smooth') === opt.value ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                                <p className={`text-xs font-semibold ${(briefData.styleGuide?.animations||'smooth') === opt.value ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</p>
                                <p className="text-xs text-gray-400">{opt.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Header + Footer cards at bottom of Style Guide */}
                    <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-200">
                      {/* Header card */}
                      <div id="pdf-section-header">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Header</p>
                        <div className={`p-3 rounded-lg border-2 ${briefData.styleGuide?.header?.enabled !== false ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${briefData.styleGuide?.header?.enabled !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {briefData.styleGuide?.header?.enabled !== false ? 'Enabled' : 'Disabled'}
                          </span>
                          {/* Visual layout diagram */}
                          {briefData.styleGuide?.header?.layout === 'logo-center' ? (
                            <div className="flex items-center justify-between bg-white rounded px-2 py-1.5 mb-2 border border-gray-200 h-8">
                              <div className="flex gap-1">{[1,2].map(i => <div key={i} className="w-6 h-1.5 bg-gray-300 rounded"></div>)}</div>
                              <div className="w-6 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold text-[9px]">L</div>
                              <div className="flex gap-1">{[1,2].map(i => <div key={i} className="w-6 h-1.5 bg-gray-300 rounded"></div>)}</div>
                            </div>
                          ) : briefData.styleGuide?.header?.layout === 'off-canvas' ? (
                            <div className="flex items-center justify-between bg-white rounded px-2 py-1.5 mb-2 border border-gray-200 h-8">
                              <div className="w-6 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold text-[9px]">L</div>
                              <div className="flex flex-col gap-0.5 justify-center items-end">
                                {[1,2,3].map(i => <div key={i} className="w-4 h-0.5 bg-gray-400 rounded"></div>)}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-white rounded px-2 py-1.5 mb-2 border border-gray-200 h-8">
                              <div className="w-6 h-4 bg-primary/30 rounded text-xs flex items-center justify-center text-gray-500 font-bold text-[9px]">L</div>
                              <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-6 h-1.5 bg-gray-300 rounded"></div>)}</div>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mb-2">
                            {briefData.styleGuide?.header?.layout === 'logo-center' ? 'Center logo' : briefData.styleGuide?.header?.layout === 'off-canvas' ? 'Off canvas (hamburger)' : 'Left logo, right menu'}
                          </p>
                          {/* Menu tree */}
                          {(briefData.styleGuide?.header?.menuItems || []).length > 0 && (
                            <pre className="font-mono text-xs text-gray-500 bg-white rounded border border-gray-100 px-2 py-1.5 overflow-x-auto">{
                              (() => {
                                const renderTree = (items, prefix = '') => {
                                  let out = ''
                                  items.forEach((item, i) => {
                                    const isLast = i === items.length - 1
                                    out += prefix + (isLast ? '└── ' : '├── ') + item.name + '\n'
                                    if (item.children?.length > 0) out += renderTree(item.children, prefix + (isLast ? '    ' : '│   '))
                                  })
                                  return out
                                }
                                return renderTree(briefData.styleGuide.header.menuItems)
                              })()
                            }</pre>
                          )}
                          {briefData.styleGuide?.header?.notes && (
                            <p className="text-xs text-gray-500 italic mt-1">{briefData.styleGuide.header.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Footer card */}
                      <div id="pdf-section-footer">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Footer</p>
                        <div className={`p-3 rounded-lg border-2 ${briefData.styleGuide?.footer?.enabled !== false ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${briefData.styleGuide?.footer?.enabled !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {briefData.styleGuide?.footer?.enabled !== false ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                          <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: `repeat(${briefData.styleGuide?.footer?.columns || 2}, 1fr)` }}>
                            {Array.from({ length: briefData.styleGuide?.footer?.columns || 2 }).map((_, i) => (
                              <div key={i} className="h-6 bg-gray-200 rounded"></div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{briefData.styleGuide?.footer?.columns || 2} columns • {briefData.styleGuide?.footer?.copyright !== false ? 'With copyright' : 'No copyright'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: User Journeys */}
                  <div id="pdf-section-3" className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                        <span className="pdf-number">4</span>
                      </div>
                      User Journeys
                    </h4>
                    {briefData.userJourneys && briefData.userJourneys.length > 0 ? (
                      <div className="space-y-4">
                        {briefData.userJourneys.map((journey, idx) => (
                          <div key={idx} className="bg-gray-50 p-6 rounded-lg">
                            <p className="font-semibold text-gray-800 mb-3">{journey.name}</p>
                            <ol className="space-y-2">
                              {journey.steps.filter(s => s.trim()).map((step, stepIdx) => (
                                <li key={stepIdx} className="flex gap-3 text-gray-600">
                                  <span className="font-semibold">{stepIdx + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-500 italic">No user journeys defined</p>
                      </div>
                    )}
                  </div>

                  {/* Section 4: Page Content Details */}
                  <div id="pdf-section-4" className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                        <span className="pdf-number">5</span>
                      </div>
                      Page Content Details
                    </h4>
                    {(() => {
                      const allPagesForContent = [...flattenPages(briefData.siteMap.pages || []), ...(briefData.siteMap.otherPages || [])]
                      return allPagesForContent.length > 0 ? (
                      <div className="space-y-6">
                        {allPagesForContent.map((page, idx, allPg) => {
                          const content = briefData.pageContent[page.id]
                          if (!content || (isQuillEmpty(content.content) && (!content.images || content.images.length === 0) && (!content.files || content.files.length === 0) && (!content.userJourneys || content.userJourneys.length === 0) && (!content.forms || content.forms.length === 0))) return null

                          // Check if we need a dashed separator after this page
                          const nextPage = allPg[idx + 1]
                          const showSeparator = nextPage && nextPage.level === 0 && (() => {
                            const firstParentIndex = allPg.findIndex(p => p.level === 0)
                            return idx + 1 !== firstParentIndex
                          })()

                          return (
                            <div key={idx}>
                              <div className="space-y-3">
                                {/* Page Title */}
                                <div className="pt-4 pb-2 border-b border-gray-300">
                                  <p className="font-bold text-primary text-base">{page.name}</p>
                                </div>

                                {/* Text Content */}
                                {content.content && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <div
                                      className="text-gray-600 text-sm prose max-w-none preview-content"
                                      dangerouslySetInnerHTML={{ __html: content.content }}
                                    />
                                  </div>
                                )}

                                {/* Images */}
                                {content.images && content.images.length > 0 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                                      {content.images.map((image, imgIdx) => (
                                        <div key={imgIdx} className="relative group">
                                          <img
                                            src={image}
                                            alt={`${page.name} image ${imgIdx + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                          />
                                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                              onClick={() => downloadImage(image, imgIdx)}
                                              className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
                                              title="Download image"
                                            >
                                              <Download size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Files */}
                                {content.files && content.files.length > 0 && (
                                  <div className="bg-gray-50 p-6 rounded-lg">
                                    <p className="font-semibold text-gray-700 mb-3 text-sm">Files ({content.files.length})</p>
                                    <div className="space-y-2">
                                      {content.files.map((file, fileIdx) => (
                                        <div
                                          key={fileIdx}
                                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                        >
                                          <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <File size={20} className="text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-gray-900 truncate">
                                                {file.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => downloadFile(file.url, file.name)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Download file"
                                          >
                                            <Download size={16} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Page-Specific User Journeys */}
                                {content.userJourneys && content.userJourneys.length > 0 && (
                                  <div className="space-y-3">
                                    <div className="pt-3 pb-2 border-b border-gray-200">
                                      <p className="font-semibold text-gray-700 text-sm">User Journeys for {page.name}</p>
                                    </div>
                                    {content.userJourneys.map((journey, jIdx) => (
                                      <div key={jIdx} className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                                        <p className="font-semibold text-gray-800 mb-2 text-sm">{journey.name}</p>
                                        <ol className="space-y-1">
                                          {journey.steps.filter(s => s.trim()).map((step, stepIdx) => (
                                            <li key={stepIdx} className="flex gap-2 text-gray-600 text-sm">
                                              <span className="font-semibold">{stepIdx + 1}.</span>
                                              <span>{step}</span>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {content.forms && content.forms.length > 0 && (
                                  <div className="space-y-3 mt-4">
                                    <div className="pt-3 pb-2 border-b border-gray-200">
                                      <p className="font-semibold text-gray-700 text-sm">Forms for {page.name}</p>
                                    </div>
                                    {content.forms.map((form, fIdx) => (
                                      <div key={fIdx} className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                                        <p className="font-semibold text-gray-800 mb-2 text-sm">{form.name}</p>
                                        <div className="space-y-1">
                                          {form.fields.map((field, fieldIdx) => (
                                            <div key={fieldIdx} className="flex items-center gap-3 text-sm py-1.5 px-3 bg-gray-50 rounded">
                                              <span className="text-gray-800 font-medium flex-1">{field.label}</span>
                                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-semibold capitalize">{field.type}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Dashed Separator Between Parent Pages */}
                              {showSeparator && (
                                <div className="my-12 border-t-4 border-dashed border-gray-300"></div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-500 italic">No page content defined</p>
                      </div>
                    )
                    })()}
                  </div>

                  {/* Section 5: General Assets */}
                  {(briefData.generalAssets?.images?.length > 0 || briefData.generalAssets?.files?.length > 0) && (
                    <div id="pdf-section-5" className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm pdf-circle">
                          <span className="pdf-number">6</span>
                        </div>
                        General Assets
                      </h4>

                      {/* General Images */}
                      {briefData.generalAssets?.images?.length > 0 && (
                        <div className="mb-6">
                          <p className="font-semibold text-gray-700 mb-3">General Images ({briefData.generalAssets.images.length})</p>
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                              {briefData.generalAssets.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`General Image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => downloadImage(image, index)}
                                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                                      title="Download image"
                                    >
                                      <Download size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* General Files */}
                      {briefData.generalAssets?.files?.length > 0 && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-3">General Files ({briefData.generalAssets.files.length})</p>
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <div className="space-y-3">
                              {briefData.generalAssets.files.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <File size={24} className="text-blue-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => downloadFile(file.url, file.name)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                                    title="Download file"
                                  >
                                    <Download size={18} />
                                    <span className="text-sm font-medium">Download</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Export Actions */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg text-center border-2 border-primary">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Export?</h4>
                    <p className="text-gray-600 mb-6">{readOnly ? 'Export this brief as a PDF' : 'Your brief is complete and ready to be exported as a PDF'}</p>
                    <div className="flex gap-4 justify-center">
                      {!readOnly && (
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Save size={20} />
                          {saving ? 'Saving...' : 'Save Brief'}
                        </Button>
                      )}
                      <Button
                        onClick={handleExportPDF}
                        variant="primary"
                        className="flex items-center gap-2 text-lg px-8 py-3"
                      >
                        <Download size={24} />
                        Export to PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="bg-white border-t-2 border-gray-200">
          <div className={`flex ${readOnly ? 'justify-center' : 'justify-between'} max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4`}>
            {readOnly ? (
              // Viewer: Only show Export button
              <Button
                onClick={handleExportPDF}
                variant="primary"
                className="flex items-center gap-2 px-8"
              >
                <Download size={18} />
                Export PDF
              </Button>
            ) : (
              <>
                {/* PM/Admin: Show full navigation */}
                <Button
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  variant="outline"
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Previous
                </Button>
                {currentStep < 7 ? (
                  <Button
                    onClick={() => setCurrentStep(prev => Math.min(7, prev + 1))}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={18} />
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save size={18} />
                      {saving ? 'Saving...' : 'Save Brief'}
                    </Button>
                    <Button
                      onClick={handleExportPDF}
                      variant="primary"
                      className="flex items-center gap-2"
                    >
                      <Download size={18} />
                      Export PDF
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Notification Modal - Outside main modal so it shows even when modal is hidden */}
    <NotificationModal
      isOpen={notification.isOpen}
      type={notification.type}
      title={notification.title}
      message={notification.message}
      onClose={closeNotification}
    />

    {showBuildAI && (
      <BuildPromptsModal
        brief={briefData}
        onClose={() => setShowBuildAI(false)}
      />
    )}
    </>
  )
}

export default BriefModal
