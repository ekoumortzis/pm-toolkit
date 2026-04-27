import { useState, useEffect, useMemo, useCallback } from 'react'
import { Copy, Check, Sparkles, Palette, Code, Info, RotateCcw, BookOpen, ChevronDown, ChevronRight, Settings, FileText, Edit2, Trash2, Lightbulb } from 'lucide-react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'
import PageHeader from '../common/PageHeader'

const PromptBuilder = () => {
  // Project Details
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [framework, setFramework] = useState('react-vite')
  const [styling, setStyling] = useState('tailwind')
  const [routing, setRouting] = useState('react-router')
  const [stateManagement, setStateManagement] = useState('context')

  // Design Colors
  const [primaryColor, setPrimaryColor] = useState('#102542')
  const [secondaryColor, setSecondaryColor] = useState('#F87171')

  // Feature Selections
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [authService, setAuthService] = useState('clerk')
  const [databaseService, setDatabaseService] = useState('neon')
  const [paymentService, setPaymentService] = useState('stripe')
  const [emailService, setEmailService] = useState('resend')

  // API Keys/Config for Services
  const [clerkApiKey, setClerkApiKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [jwtSecret, setJwtSecret] = useState('')
  const [neonDbUrl, setNeonDbUrl] = useState('')
  const [mongoDbUri, setMongoDbUri] = useState('')

  // Forms state
  const [formTemplate, setFormTemplate] = useState('custom')
  const [formName, setFormName] = useState('My Form')
  const [formGrid, setFormGrid] = useState('1') // '1', '2', or '3' columns
  const [formFields, setFormFields] = useState([])
  const [conditionalRules, setConditionalRules] = useState([])

  // Common Components state
  const [headerStyle, setHeaderStyle] = useState('horizontal') // 'horizontal', 'centered', 'sidebar'
  const [headerMenuItems, setHeaderMenuItems] = useState([
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' }
  ])
  const [footerStyle, setFooterStyle] = useState('simple') // 'simple', 'multi-column', 'newsletter'
  const [footerLinks, setFooterLinks] = useState([
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' }
  ])
  const [modalType, setModalType] = useState('center') // 'center', 'side-panel', 'full-screen'
  const [cardStyle, setCardStyle] = useState('basic') // 'basic', 'image-top', 'horizontal'
  const [accordionStyle, setAccordionStyle] = useState('single') // 'single', 'multiple'
  const [tabsStyle, setTabsStyle] = useState('horizontal') // 'horizontal', 'vertical'

  // UI State
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const [showGuide, setShowGuide] = useState(null)
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false)

  // Logic Modal State
  const [showLogicModal, setShowLogicModal] = useState(false)
  const [showFormMapModal, setShowFormMapModal] = useState(false)
  const [editingRule, setEditingRule] = useState(null)
  const [flowNodes, setFlowNodes] = useState([])
  const [flowEdges, setFlowEdges] = useState([])
  const [tempRule, setTempRule] = useState({
    triggerField: '',
    condition: 'equals',
    value: '',
    action: 'show',
    targetFields: [], // Changed to array for multiple field selection
    targetField: '', // Keep for backwards compatibility with changeOptions
    conditionalOptions: []
  })

  // Update React Flow nodes and edges when form changes
  useEffect(() => {
    if (!showFormMapModal) return

    const nodes = []
    const edges = []

    let yOffset = 50
    const xStart = 100
    const ySpacing = 150
    const xSpacing = 300

    // Separate always visible fields from conditional ones
    const alwaysVisible = formFields.filter(field => {
      const hasShowRule = conditionalRules.some(r =>
        r.action === 'show' && r.targetFields?.includes(field.id)
      )
      return !hasShowRule
    })

    // Create nodes for always visible fields
    alwaysVisible.forEach((field, idx) => {
      nodes.push({
        id: field.id,
        type: 'default',
        position: { x: xStart, y: yOffset },
        data: {
          label: (
            <div className="px-4 py-3" style={{ minWidth: '200px' }}>
              <div className="font-bold text-base mb-1">{field.label || 'Unnamed'}</div>
              <div className="flex gap-1 flex-wrap">
                <span className="text-xs bg-white/80 px-2 py-0.5 rounded">{field.type}</span>
                <span className="text-xs bg-white/80 px-2 py-0.5 rounded">
                  {field.width === '33' ? '1/3' : field.width === '50' ? '1/2' : 'full'}
                </span>
              </div>
            </div>
          )
        },
        style: {
          background: '#c7f5d9',
          border: '2px solid #86efac',
          borderRadius: '12px',
          padding: 0,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      })

      // Find conditional rules for this field
      const fieldRules = conditionalRules.filter(r =>
        r.action === 'show' && r.triggerField === field.id && r.targetFields
      )

      fieldRules.forEach((rule, ruleIdx) => {
        const conditionNodeId = `condition-${field.id}-${ruleIdx}`

        // Create condition node
        nodes.push({
          id: conditionNodeId,
          type: 'default',
          position: { x: xStart + xSpacing, y: yOffset + (ruleIdx * ySpacing) },
          data: {
            label: (
              <div className="px-4 py-2 text-center">
                <div className="text-xs text-purple-900 mb-1">when:</div>
                <div className="font-bold text-sm">= "{rule.value}"</div>
              </div>
            )
          },
          style: {
            background: '#e9d5ff',
            border: '2px solid #c084fc',
            borderRadius: '10px',
            padding: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }
        })

        // Edge from trigger field to condition
        edges.push({
          id: `e-${field.id}-${conditionNodeId}`,
          source: field.id,
          target: conditionNodeId,
          animated: true,
          style: { stroke: '#9333ea', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#9333ea'
          }
        })

        // Create target field nodes
        const targetFields = (rule.targetFields || [])
          .map(id => formFields.find(f => f.id === id))
          .filter(Boolean)

        targetFields.forEach((target, tIdx) => {
          const targetNodeId = `target-${rule.id}-${target.id}`

          nodes.push({
            id: targetNodeId,
            type: 'default',
            position: {
              x: xStart + xSpacing * 2,
              y: yOffset + (ruleIdx * ySpacing) + (tIdx * 100) - 50
            },
            data: {
              label: (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span>👁️</span>
                    <div className="font-bold text-sm">{target.label}</div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    <span className="text-xs bg-white/80 px-2 py-0.5 rounded">{target.type}</span>
                    <span className="text-xs bg-white/80 px-2 py-0.5 rounded">
                      {target.width === '33' ? '1/3' : target.width === '50' ? '1/2' : 'full'}
                    </span>
                  </div>
                </div>
              )
            },
            style: {
              background: '#bfdbfe',
              border: '2px solid #93c5fd',
              borderRadius: '12px',
              padding: 0,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }
          })

          // Edge from condition to target
          edges.push({
            id: `e-${conditionNodeId}-${targetNodeId}`,
            source: conditionNodeId,
            target: targetNodeId,
            animated: true,
            style: { stroke: '#3b82f6', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#3b82f6'
            }
          })
        })
      })

      yOffset += ySpacing * Math.max(fieldRules.length, 1) + 50
    })

    setFlowNodes(nodes)
    setFlowEdges(edges)
  }, [formFields, conditionalRules, showFormMapModal])

  // Design Options
  const [shadows, setShadows] = useState('medium')
  const [roundness, setRoundness] = useState('rounded')
  const [spacing, setSpacing] = useState('comfortable')
  const [animations, setAnimations] = useState('subtle')
  const [typography, setTypography] = useState('geologica')
  const [hoveredFont, setHoveredFont] = useState('geologica')
  const [fontSearch, setFontSearch] = useState('')

  // Tech Stack Options (Most Common)
  const techStack = {
    framework: [
      { id: 'react-vite', label: 'React + Vite' },
      { id: 'nextjs', label: 'Next.js' },
      { id: 'vue', label: 'Vue 3' }
    ],
    styling: [
      { id: 'tailwind', label: 'Tailwind CSS' },
      { id: 'bootstrap', label: 'Bootstrap' },
      { id: 'mui', label: 'Material-UI' },
      { id: 'styled', label: 'Styled Components' }
    ],
    routing: [
      { id: 'react-router', label: 'React Router' },
      { id: 'nextjs-router', label: 'Next.js Router' },
      { id: 'none', label: 'No Router' }
    ],
    stateManagement: [
      { id: 'context', label: 'React Context' },
      { id: 'redux', label: 'Redux Toolkit' },
      { id: 'zustand', label: 'Zustand' },
      { id: 'none', label: 'None' }
    ]
  }

  const designOptions = {
    shadows: [
      { id: 'none', label: 'None', shadow: 'none' },
      { id: 'subtle', label: 'Subtle', shadow: '0 1px 3px rgba(0,0,0,0.12)' },
      { id: 'medium', label: 'Medium', shadow: '0 4px 6px rgba(0,0,0,0.1)' },
      { id: 'heavy', label: 'Heavy', shadow: '0 10px 25px rgba(0,0,0,0.15)' }
    ],
    roundness: [
      { id: 'sharp', label: '0px', radius: '0px' },
      { id: 'slight', label: '4px', radius: '4px' },
      { id: 'rounded', label: '8px', radius: '8px' },
      { id: 'very-rounded', label: '16px', radius: '16px' },
      { id: 'pill', label: 'Full', radius: '9999px' }
    ],
    spacing: [
      { id: 'compact', label: 'Compact', value: '0.5rem' },
      { id: 'comfortable', label: 'Comfortable', value: '1rem' },
      { id: 'spacious', label: 'Spacious', value: '1.5rem' }
    ],
    animations: [
      { id: 'none', label: 'None', value: 'none' },
      { id: 'subtle', label: 'Subtle', value: '150ms' },
      { id: 'smooth', label: 'Smooth', value: '300ms' },
      { id: 'playful', label: 'Playful', value: '500ms' }
    ],
    typography: [
      { id: 'geologica', label: 'Geologica', font: 'Geologica' },
      { id: 'inter', label: 'Inter', font: 'Inter' },
      { id: 'roboto', label: 'Roboto', font: 'Roboto' },
      { id: 'open-sans', label: 'Open Sans', font: 'Open Sans' },
      { id: 'lato', label: 'Lato', font: 'Lato' },
      { id: 'montserrat', label: 'Montserrat', font: 'Montserrat' },
      { id: 'poppins', label: 'Poppins', font: 'Poppins' },
      { id: 'raleway', label: 'Raleway', font: 'Raleway' },
      { id: 'nunito', label: 'Nunito', font: 'Nunito' },
      { id: 'work-sans', label: 'Work Sans', font: 'Work Sans' },
      { id: 'source-sans', label: 'Source Sans Pro', font: 'Source Sans Pro' },
      { id: 'ubuntu', label: 'Ubuntu', font: 'Ubuntu' },
      { id: 'pt-sans', label: 'PT Sans', font: 'PT Sans' },
      { id: 'noto-sans', label: 'Noto Sans', font: 'Noto Sans' },
      { id: 'rubik', label: 'Rubik', font: 'Rubik' },
      { id: 'karla', label: 'Karla', font: 'Karla' },
      { id: 'dm-sans', label: 'DM Sans', font: 'DM Sans' },
      { id: 'josefin-sans', label: 'Josefin Sans', font: 'Josefin Sans' },
      { id: 'mulish', label: 'Mulish', font: 'Mulish' },
      { id: 'quicksand', label: 'Quicksand', font: 'Quicksand' },
      { id: 'barlow', label: 'Barlow', font: 'Barlow' },
      { id: 'oswald', label: 'Oswald', font: 'Oswald' },
      { id: 'oxygen', label: 'Oxygen', font: 'Oxygen' },
      { id: 'manrope', label: 'Manrope', font: 'Manrope' },
      { id: 'heebo', label: 'Heebo', font: 'Heebo' },
      { id: 'exo-2', label: 'Exo 2', font: 'Exo 2' },
      { id: 'titillium-web', label: 'Titillium Web', font: 'Titillium Web' },
      { id: 'cabin', label: 'Cabin', font: 'Cabin' },
      { id: 'varela-round', label: 'Varela Round', font: 'Varela Round' },
      { id: 'fira-sans', label: 'Fira Sans', font: 'Fira Sans' },
      { id: 'archivo', label: 'Archivo', font: 'Archivo' },
      { id: 'red-hat-display', label: 'Red Hat Display', font: 'Red Hat Display' },
      { id: 'sora', label: 'Sora', font: 'Sora' },
      { id: 'space-grotesk', label: 'Space Grotesk', font: 'Space Grotesk' },
      { id: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', font: 'Plus Jakarta Sans' },
      { id: 'albert-sans', label: 'Albert Sans', font: 'Albert Sans' },
      { id: 'outfit', label: 'Outfit', font: 'Outfit' },
      { id: 'lexend', label: 'Lexend', font: 'Lexend' },
      { id: 'comfortaa', label: 'Comfortaa', font: 'Comfortaa' },
      { id: 'jost', label: 'Jost', font: 'Jost' },
      { id: 'fjalla-one', label: 'Fjalla One', font: 'Fjalla One' },
      { id: 'hind', label: 'Hind', font: 'Hind' },
      { id: 'dosis', label: 'Dosis', font: 'Dosis' },
      { id: 'source-code-pro', label: 'Source Code Pro', font: 'Source Code Pro' },
      { id: 'fira-code', label: 'Fira Code', font: 'Fira Code' },
      { id: 'jetbrains-mono', label: 'JetBrains Mono', font: 'JetBrains Mono' },
      { id: 'roboto-mono', label: 'Roboto Mono', font: 'Roboto Mono' },
      { id: 'ibm-plex-sans', label: 'IBM Plex Sans', font: 'IBM Plex Sans' },
      { id: 'ibm-plex-mono', label: 'IBM Plex Mono', font: 'IBM Plex Mono' },
      { id: 'noto-serif', label: 'Noto Serif', font: 'Noto Serif' },
      { id: 'inconsolata', label: 'Inconsolata', font: 'Inconsolata' },
      { id: 'maven-pro', label: 'Maven Pro', font: 'Maven Pro' },
      { id: 'bebas-neue', label: 'Bebas Neue', font: 'Bebas Neue' },
      { id: 'cinzel', label: 'Cinzel', font: 'Cinzel' },
      { id: 'cabin-condensed', label: 'Cabin Condensed', font: 'Cabin Condensed' },
      { id: 'asap', label: 'Asap', font: 'Asap' },
      { id: 'prompt', label: 'Prompt', font: 'Prompt' },
      { id: 'barlow-condensed', label: 'Barlow Condensed', font: 'Barlow Condensed' },
      { id: 'nunito-sans', label: 'Nunito Sans', font: 'Nunito Sans' },
      { id: 'aleo', label: 'Aleo', font: 'Aleo' },
      { id: 'nanum-gothic', label: 'Nanum Gothic', font: 'Nanum Gothic' },
      { id: 'archivo-narrow', label: 'Archivo Narrow', font: 'Archivo Narrow' },
      { id: 'yanone-kaffeesatz', label: 'Yanone Kaffeesatz', font: 'Yanone Kaffeesatz' },
      { id: 'libre-franklin', label: 'Libre Franklin', font: 'Libre Franklin' },
      { id: 'signika', label: 'Signika', font: 'Signika' },
      { id: 'playfair', label: 'Playfair Display', font: 'Playfair Display' },
      { id: 'merriweather', label: 'Merriweather', font: 'Merriweather' },
      { id: 'lora', label: 'Lora', font: 'Lora' },
      { id: 'pt-serif', label: 'PT Serif', font: 'PT Serif' },
      { id: 'crimson-text', label: 'Crimson Text', font: 'Crimson Text' },
      { id: 'eb-garamond', label: 'EB Garamond', font: 'EB Garamond' },
      { id: 'libre-baskerville', label: 'Libre Baskerville', font: 'Libre Baskerville' },
      { id: 'cormorant', label: 'Cormorant', font: 'Cormorant' },
      { id: 'bitter', label: 'Bitter', font: 'Bitter' },
      { id: 'spectral', label: 'Spectral', font: 'Spectral' },
      { id: 'cardo', label: 'Cardo', font: 'Cardo' },
      { id: 'alegreya', label: 'Alegreya', font: 'Alegreya' },
      { id: 'arvo', label: 'Arvo', font: 'Arvo' },
      { id: 'gelasio', label: 'Gelasio', font: 'Gelasio' },
      { id: 'old-standard-tt', label: 'Old Standard TT', font: 'Old Standard TT' },
      { id: 'vollkorn', label: 'Vollkorn', font: 'Vollkorn' },
      { id: 'rokkitt', label: 'Rokkitt', font: 'Rokkitt' },
      { id: 'crimson-pro', label: 'Crimson Pro', font: 'Crimson Pro' },
      { id: 'alice', label: 'Alice', font: 'Alice' },
      { id: 'sorts-mill-goudy', label: 'Sorts Mill Goudy', font: 'Sorts Mill Goudy' },
      { id: 'pacifico', label: 'Pacifico', font: 'Pacifico' },
      { id: 'dancing-script', label: 'Dancing Script', font: 'Dancing Script' },
      { id: 'caveat', label: 'Caveat', font: 'Caveat' },
      { id: 'satisfy', label: 'Satisfy', font: 'Satisfy' },
      { id: 'permanent-marker', label: 'Permanent Marker', font: 'Permanent Marker' },
      { id: 'indie-flower', label: 'Indie Flower', font: 'Indie Flower' },
      { id: 'shadows-into-light', label: 'Shadows Into Light', font: 'Shadows Into Light' },
      { id: 'lobster', label: 'Lobster', font: 'Lobster' },
      { id: 'righteous', label: 'Righteous', font: 'Righteous' },
      { id: 'anton', label: 'Anton', font: 'Anton' },
      { id: 'russo-one', label: 'Russo One', font: 'Russo One' },
      { id: 'abril-fatface', label: 'Abril Fatface', font: 'Abril Fatface' },
      { id: 'passion-one', label: 'Passion One', font: 'Passion One' },
      { id: 'alfa-slab-one', label: 'Alfa Slab One', font: 'Alfa Slab One' },
      { id: 'fugaz-one', label: 'Fugaz One', font: 'Fugaz One' },
      { id: 'amatic-sc', label: 'Amatic SC', font: 'Amatic SC' },
      { id: 'cookie', label: 'Cookie', font: 'Cookie' },
      { id: 'sacramento', label: 'Sacramento', font: 'Sacramento' },
      { id: 'great-vibes', label: 'Great Vibes', font: 'Great Vibes' }
    ]
  }

  // Service Options with Guides
  const services = {
    auth: [
      {
        id: 'clerk',
        name: 'Clerk',
        description: 'Complete user management solution with pre-built UI components',
        setup: [
          '1. Go to clerk.com and create free account',
          '2. Create new application in dashboard',
          '3. Copy API keys from dashboard',
          '4. Install: npm install @clerk/clerk-react',
          '5. Add keys to .env: VITE_CLERK_PUBLISHABLE_KEY',
          '6. Wrap app with <ClerkProvider>'
        ],
        whatIs: 'Clerk is a complete user management platform that handles authentication, user profiles, and session management. It provides pre-built UI components for login, signup, and user profiles, so you don\'t have to build these from scratch.'
      },
      {
        id: 'supabase',
        name: 'Supabase Auth',
        description: 'Open-source Firebase alternative with built-in authentication',
        setup: [
          '1. Go to supabase.com and create free account',
          '2. Create new project (takes ~2 minutes)',
          '3. Get API keys from Project Settings > API',
          '4. Install: npm install @supabase/supabase-js',
          '5. Add keys to .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY',
          '6. Initialize client in your app'
        ],
        whatIs: 'Supabase Auth is part of Supabase (an open-source Firebase alternative). It provides authentication through email/password, magic links, and social providers. It\'s free to start and includes a PostgreSQL database.'
      },
      {
        id: 'custom',
        name: 'Custom JWT',
        description: 'Build your own authentication system with JSON Web Tokens',
        setup: [
          '1. Install packages: npm install bcrypt jsonwebtoken express-validator',
          '2. Create User model in your database',
          '3. Hash passwords with bcrypt before storing',
          '4. Generate JWT tokens on successful login',
          '5. Store token in localStorage on frontend',
          '6. Send token in Authorization header for protected routes'
        ],
        whatIs: 'JWT (JSON Web Tokens) is a standard for securely transmitting information between parties. Building custom auth means you control everything but need to handle security yourself (password hashing, token expiration, refresh tokens, etc.).'
      }
    ],
    database: [
      {
        id: 'neon',
        name: 'Neon + Prisma',
        description: 'Serverless PostgreSQL with type-safe ORM',
        setup: [
          '1. Go to neon.tech and create free account',
          '2. Create new project (instant setup)',
          '3. Copy connection string from dashboard',
          '4. Install: npm install @prisma/client && npm install -D prisma',
          '5. Run: npx prisma init',
          '6. Add DATABASE_URL to .env',
          '7. Define schema in prisma/schema.prisma',
          '8. Run: npx prisma migrate dev'
        ],
        whatIs: 'Neon is serverless PostgreSQL that auto-scales and has a generous free tier. Prisma is an ORM (Object-Relational Mapping) tool that generates type-safe database queries from your schema, making database work easier and safer.'
      },
      {
        id: 'supabase-db',
        name: 'Supabase Database',
        description: 'PostgreSQL with real-time capabilities',
        setup: [
          '1. Use your Supabase project from authentication',
          '2. Go to Table Editor in dashboard',
          '3. Create tables visually or use SQL editor',
          '4. Set up Row Level Security (RLS) policies',
          '5. Use same Supabase client to query data',
          '6. Real-time subscriptions work automatically'
        ],
        whatIs: 'Supabase Database is PostgreSQL with extra features like real-time subscriptions (data updates instantly in your app) and Row Level Security (users can only access their own data). Perfect if you\'re already using Supabase Auth.'
      },
      {
        id: 'mongodb',
        name: 'MongoDB Atlas',
        description: 'NoSQL document database in the cloud',
        setup: [
          '1. Go to mongodb.com/cloud/atlas and create account',
          '2. Create free cluster (M0 tier)',
          '3. Add your IP address to whitelist',
          '4. Create database user with password',
          '5. Get connection string from Connect button',
          '6. Install: npm install mongoose',
          '7. Add MONGODB_URI to .env',
          '8. Connect in your app'
        ],
        whatIs: 'MongoDB is a NoSQL database that stores data as flexible JSON-like documents instead of tables. Great for rapid development and apps where data structure might change. Atlas is MongoDB\'s cloud hosting with a free tier.'
      }
    ],
    payments: [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Industry-standard payment processing',
        setup: [
          '1. Go to stripe.com and create account',
          '2. Get API keys from Developers > API keys',
          '3. Install: npm install @stripe/stripe-js stripe',
          '4. Add keys to .env: VITE_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY',
          '5. Create products/prices in Stripe dashboard',
          '6. Implement checkout flow in your app',
          '7. Set up webhook endpoint for payment confirmations'
        ],
        whatIs: 'Stripe is the most popular online payment processor. It handles credit cards, subscriptions, invoices, and supports 135+ currencies. Very reliable, great documentation, but requires understanding of webhooks for security.'
      },
      {
        id: 'lemonsqueezy',
        name: 'Lemon Squeezy',
        description: 'All-in-one platform with tax handling',
        setup: [
          '1. Go to lemonsqueezy.com and create account',
          '2. Create store and products in dashboard',
          '3. Get API key from Settings > API',
          '4. Install: npm install @lemonsqueezy/lemonsqueezy.js',
          '5. Add LEMON_SQUEEZY_API_KEY to .env',
          '6. Use Lemon.js for checkout (no backend needed)',
          '7. Set up webhook for order notifications'
        ],
        whatIs: 'Lemon Squeezy is a "merchant of record" - they handle all payment processing, taxes, VAT, and compliance for you. Perfect for SaaS and digital products. Simpler than Stripe but slightly higher fees (5% + payment processor fees).'
      }
    ],
    email: [
      {
        id: 'resend',
        name: 'Resend',
        description: 'Modern email API for developers',
        setup: [
          '1. Go to resend.com and create account',
          '2. Verify your domain (or use onboarding domain for testing)',
          '3. Get API key from dashboard',
          '4. Install: npm install resend',
          '5. Add RESEND_API_KEY to .env',
          '6. Create email templates',
          '7. Send emails via API'
        ],
        whatIs: 'Resend is a modern email API built for developers. It makes sending transactional emails (welcome emails, password resets, notifications) simple. Free tier includes 3,000 emails/month. Great developer experience with React email templates.'
      }
    ]
  }

  // Categorized features for better scalability
  const featureCategories = [
    {
      id: 'essentials',
      label: 'Project Essentials',
      icon: Code,
      features: [
        { id: 'project', label: 'Project Setup', description: 'Tech stack & best practices', hasConfig: true },
        { id: 'style', label: 'Style Guide', description: 'Design system & colors', hasConfig: true }
      ]
    },
    {
      id: 'services',
      label: 'Third-Party Services',
      icon: Code,
      features: [
        { id: 'auth', label: 'Authentication', description: 'User login & signup', hasConfig: true },
        { id: 'database', label: 'Database', description: 'Data storage', hasConfig: true }
      ]
    },
    {
      id: 'forms',
      label: 'Forms & Inputs',
      icon: FileText,
      features: [
        { id: 'forms', label: 'Form Builder', description: 'Custom forms with conditional logic', hasConfig: true }
      ]
    },
    {
      id: 'components',
      label: 'Common Components',
      icon: Palette,
      features: [
        { id: 'header', label: 'Header/Navigation', description: 'Top navigation bar', hasConfig: true },
        { id: 'footer', label: 'Footer', description: 'Bottom page footer', hasConfig: true },
        { id: 'modal', label: 'Modal/Dialog', description: 'Popup dialogs', hasConfig: true },
        { id: 'cards', label: 'Cards/Listings', description: 'Content cards & lists', hasConfig: true },
        { id: 'accordion', label: 'Accordion/Collapse', description: 'Expandable sections', hasConfig: true },
        { id: 'tabs', label: 'Tabs', description: 'Tabbed content', hasConfig: true },
        { id: 'breadcrumbs', label: 'Breadcrumbs', description: 'Navigation breadcrumbs', hasConfig: false },
        { id: 'pagination', label: 'Pagination', description: 'Page navigation', hasConfig: false }
      ]
    },
    {
      id: 'pages',
      label: 'Pages & Features',
      icon: FileText,
      features: [
        { id: 'dashboard', label: 'Dashboard', description: 'Main user interface', hasConfig: false },
        { id: 'settings', label: 'Settings Page', description: 'User preferences & profile', hasConfig: false }
      ]
    },
    {
      id: 'backend',
      label: 'Backend & API',
      icon: Code,
      features: [
        { id: 'api', label: 'REST API', description: 'Backend endpoints', hasConfig: false },
        { id: 'graphql', label: 'GraphQL API', description: 'GraphQL endpoints', hasConfig: false },
        { id: 'websockets', label: 'WebSockets', description: 'Real-time features', hasConfig: false }
      ]
    }
  ]

  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState(['essentials', 'services', 'components'])
  const [activeConfig, setActiveConfig] = useState(null) // Which feature's config is being shown

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleFeatureClick = (featureId, hasConfig) => {
    toggleFeature(featureId)
    if (hasConfig && !selectedFeatures.includes(featureId)) {
      // If selecting a feature with config, show its config
      setActiveConfig(featureId)
    } else if (selectedFeatures.includes(featureId)) {
      // If deselecting, close config if it's open
      if (activeConfig === featureId) {
        setActiveConfig(null)
      }
    }
  }
  // Generate prompt based on selections
  const generatePrompt = () => {
    if (selectedFeatures.length === 0) {
      return ''
    }

    let prompt = ``

    // Sort features so 'project' always comes first, then 'style', then others
    const sortedFeatures = [...selectedFeatures].sort((a, b) => {
      if (a === 'project') return -1
      if (b === 'project') return 1
      if (a === 'style') return -1
      if (b === 'style') return 1
      return 0
    })

    sortedFeatures.forEach(featureId => {
      if (featureId === 'project') {
        prompt += `# Project Setup\n\n`
        if (projectTitle) prompt += `Create application: "${projectTitle}"\n\n`
        if (projectDescription) prompt += `Description: ${projectDescription}\n\n`

        const frameworkLabel = techStack.framework.find(f => f.id === framework)?.label || framework
        const stylingLabel = techStack.styling.find(s => s.id === styling)?.label || styling
        const routingLabel = techStack.routing.find(r => r.id === routing)?.label || routing
        const stateLabel = techStack.stateManagement.find(s => s.id === stateManagement)?.label || stateManagement

        prompt += `Tech Stack:\n`
        prompt += `- Framework: ${frameworkLabel}\n`
        prompt += `- Styling: ${stylingLabel}\n`
        prompt += `- Routing: ${routingLabel}\n`
        prompt += `- State Management: ${stateLabel}\n\n`

        prompt += `Best Practices:\n\n`

        prompt += `Design & UX:\n`
        prompt += `- Mobile-first, pixel-perfect responsive design\n`

        // Context-aware breakpoints based on styling choice
        if (styling === 'tailwind') {
          prompt += `- Use Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)\n`
        } else if (styling === 'bootstrap') {
          prompt += `- Use Bootstrap breakpoints: sm (576px), md (768px), lg (992px), xl (1200px), xxl (1400px)\n`
        } else if (styling === 'mui') {
          prompt += `- Use Material-UI breakpoints: xs (0px), sm (600px), md (900px), lg (1200px), xl (1536px)\n`
        } else {
          prompt += `- Implement responsive breakpoints for mobile, tablet, and desktop\n`
        }

        prompt += `- WCAG 2.1 AA accessibility compliance\n`
        prompt += `- Intuitive navigation with clear user feedback\n`
        prompt += `- Consistent spacing and visual hierarchy\n\n`

        prompt += `Code Quality:\n`
        prompt += `- Clean, component-based architecture\n`
        prompt += `- Proper error handling and validation\n`
        prompt += `- Reusable and modular components\n\n`

        prompt += `Performance:\n`
        prompt += `- Code splitting and lazy loading\n`
        prompt += `- Optimized images (WebP, lazy loading)\n`
        prompt += `- Fast initial load (< 3 seconds)\n\n`

        prompt += `Security:\n`
        prompt += `- Input sanitization (prevent XSS)\n`
        prompt += `- Secure API communication (HTTPS)\n`
        prompt += `- Environment variables for sensitive data\n\n`
      }
      else if (featureId === 'style') {
        prompt += `## Design System\n\n`
        prompt += `Colors:\n`
        prompt += `- Primary: ${primaryColor}\n`
        prompt += `- Secondary: ${secondaryColor}\n\n`
        prompt += `Visual Style:\n`
        prompt += `- Shadows: ${shadows} (${designOptions.shadows.find(s => s.id === shadows)?.label})\n`
        prompt += `- Border Radius: ${roundness} (${designOptions.roundness.find(r => r.id === roundness)?.label})\n`
        prompt += `- Spacing: ${spacing}\n`
        prompt += `- Animations: ${animations} (${designOptions.animations.find(a => a.id === animations)?.label})\n`
        prompt += `- Typography: ${typography} (${designOptions.typography.find(t => t.id === typography)?.label})\n\n`
        prompt += `Apply this design system consistently across all components.\n\n`
      }
      else if (featureId === 'auth') {
        const service = services.auth.find(s => s.id === authService)
        prompt += `## Authentication System (${service.name})\n\n`

        prompt += `### CONFIGURATION\n\n`

        // Add API keys/config if provided
        if (authService === 'clerk' && clerkApiKey) {
          prompt += `**Clerk Setup:**\n`
          prompt += `- Publishable Key: ${clerkApiKey}\n`
          prompt += `- Install: \`npm install @clerk/clerk-react\`\n`
          prompt += `- Wrap app with <ClerkProvider publishableKey="${clerkApiKey}">\n\n`
        } else if (authService === 'supabase' && (supabaseUrl || supabaseKey)) {
          prompt += `**Supabase Setup:**\n`
          if (supabaseUrl) prompt += `- Project URL: ${supabaseUrl}\n`
          if (supabaseKey) prompt += `- Anon Key: ${supabaseKey}\n`
          prompt += `- Install: \`npm install @supabase/supabase-js\`\n`
          prompt += `- Initialize client with URL and anon key\n\n`
        } else if (authService === 'custom' && jwtSecret) {
          prompt += `**Custom JWT Setup:**\n`
          prompt += `- JWT Secret: ${jwtSecret}\n`
          prompt += `- Install: \`npm install jsonwebtoken bcryptjs\`\n`
          prompt += `- Store JWT secret in environment variable\n\n`
        }

        prompt += `### REQUIRED PAGES\n\n`

        prompt += `**1. Login Page (/login):**\n`
        prompt += `- Email input field (type="email", required, validation)\n`
        prompt += `- Password input field (type="password", required, min 8 characters)\n`
        prompt += `- "Login" button (disabled while loading)\n`
        prompt += `- Loading spinner during authentication\n`
        prompt += `- Error message display for failed login\n`
        prompt += `- Link to signup page\n`
        prompt += `- "Forgot Password?" link\n`
        if (authService === 'clerk' || authService === 'supabase') {
          prompt += `- "Continue with Google" button (OAuth)\n`
        }
        prompt += `- Redirect to dashboard after successful login\n\n`

        prompt += `**2. Signup Page (/signup):**\n`
        prompt += `- Name/Username field (required)\n`
        prompt += `- Email field (required, validate email format)\n`
        prompt += `- Password field (required, min 8 chars, show strength indicator)\n`
        prompt += `- Confirm password field (must match password)\n`
        prompt += `- "Create Account" button\n`
        prompt += `- Show validation errors in real-time\n`
        prompt += `- Link to login page\n`
        if (authService === 'clerk' || authService === 'supabase') {
          prompt += `- "Continue with Google" button\n`
        }
        prompt += `- Redirect to dashboard after signup\n\n`

        prompt += `### AUTHENTICATION LOGIC\n\n`

        prompt += `**Protected Routes:**\n`
        prompt += `- Create ProtectedRoute component\n`
        prompt += `- Check if user is authenticated\n`
        prompt += `- If not authenticated: redirect to /login\n`
        prompt += `- If authenticated: render the requested page\n`
        prompt += `- Wrap all protected pages (dashboard, settings, etc.) with ProtectedRoute\n\n`

        prompt += `**Session Management:**\n`
        prompt += `- Store authentication token/session securely\n`
        prompt += `- Add token to API request headers automatically\n`
        prompt += `- Handle token expiration (redirect to login)\n`
        prompt += `- Implement logout functionality (clear session, redirect to login)\n\n`

        prompt += `**User Context:**\n`
        prompt += `- Create AuthContext with React Context API\n`
        prompt += `- Provide: currentUser, loading, login(), signup(), logout()\n`
        prompt += `- Make user data accessible throughout app\n\n`
      }
      else if (featureId === 'database') {
        const service = services.database.find(s => s.id === databaseService)
        prompt += `## Database Setup (${service.name})\n\n`

        prompt += `### DATABASE CONFIGURATION\n\n`

        // Add database configuration if provided
        if (databaseService === 'neon' && neonDbUrl) {
          prompt += `**Neon Postgres Setup:**\n`
          prompt += `- Connection URL: ${neonDbUrl}\n`
          prompt += `- Install: \`npm install @neondatabase/serverless\`\n`
          prompt += `- Store DATABASE_URL in .env file\n`
          prompt += `- Use connection pooling for serverless\n\n`
        } else if (databaseService === 'supabase-db' && (supabaseUrl || supabaseKey)) {
          prompt += `**Supabase Database:**\n`
          if (supabaseUrl) prompt += `- Project URL: ${supabaseUrl}\n`
          if (supabaseKey) prompt += `- Anon Key: ${supabaseKey}\n`
          prompt += `- Built-in PostgreSQL database\n`
          prompt += `- Use Supabase client for queries\n\n`
        } else if (databaseService === 'mongodb' && mongoDbUri) {
          prompt += `**MongoDB Setup:**\n`
          prompt += `- Connection URI: ${mongoDbUri}\n`
          prompt += `- Install: \`npm install mongodb mongoose\`\n`
          prompt += `- Use Mongoose for schema and models\n\n`
        }

        prompt += `### USER MODEL/SCHEMA\n\n`

        prompt += `Create User model with these fields:\n`
        prompt += `- id/\_id: Primary key (auto-generated)\n`
        prompt += `- email: String, unique, required, validated\n`
        prompt += `- password: String, hashed (use bcrypt), required\n`
        prompt += `- name: String, optional\n`
        prompt += `- createdAt: Timestamp, default now\n`
        prompt += `- updatedAt: Timestamp, auto-update\n\n`

        prompt += `### DATABASE OPERATIONS\n\n`

        prompt += `**Create User (Signup):**\n`
        prompt += `1. Validate email format and uniqueness\n`
        prompt += `2. Hash password with bcrypt (10 rounds)\n`
        prompt += `3. Insert user into database\n`
        prompt += `4. Return user object (exclude password)\n\n`

        prompt += `**Read User (Login/Profile):**\n`
        prompt += `1. Query by email or id\n`
        prompt += `2. Never return password in response\n`
        prompt += `3. Handle user not found error\n\n`

        prompt += `**Update User (Profile Edit):**\n`
        prompt += `1. Find user by id\n`
        prompt += `2. Update allowed fields only (name, email)\n`
        prompt += `3. If updating email: check uniqueness first\n`
        prompt += `4. If updating password: hash new password\n`
        prompt += `5. Return updated user (exclude password)\n\n`

        prompt += `**Delete User (Account Deletion):**\n`
        prompt += `1. Find user by id\n`
        prompt += `2. Verify user owns the account (check auth)\n`
        prompt += `3. Delete user record\n`
        prompt += `4. Clean up related data if any\n\n`

        prompt += `### DATA VALIDATION\n\n`
        prompt += `- Email: Must be valid email format, unique in database\n`
        prompt += `- Password: Minimum 8 characters, must be hashed\n`
        prompt += `- All required fields: Check before insert/update\n`
        prompt += `- Return clear error messages for validation failures\n\n`
      }
      else if (featureId === 'dashboard') {
        prompt += `## User Dashboard Page\n\n`

        prompt += `### LAYOUT STRUCTURE\n\n`

        prompt += `**Top Navigation Bar:**\n`
        prompt += `- Logo/brand name (left side, clickable → home)\n`
        prompt += `- Search bar (center, if applicable)\n`
        prompt += `- User menu dropdown (right side):\n`
        prompt += `  * User avatar/name\n`
        prompt += `  * "Profile" link → /profile\n`
        prompt += `  * "Settings" link → /settings\n`
        prompt += `  * "Logout" button\n`
        prompt += `- Height: 64px, fixed position, shadow\n`
        prompt += `- Background: white or primary color\n\n`

        prompt += `**Sidebar Navigation (Desktop):**\n`
        prompt += `- Width: 240px, fixed left side\n`
        prompt += `- Navigation links:\n`
        prompt += `  * Dashboard (icon + label)\n`
        prompt += `  * Profile\n`
        prompt += `  * Settings\n`
        prompt += `  * [Add other relevant links]\n`
        prompt += `- Highlight active page\n`
        prompt += `- Collapse to icons only on tablet\n`
        prompt += `- Hide on mobile (use hamburger menu)\n\n`

        prompt += `**Main Content Area:**\n`
        prompt += `- Margin-left: 240px (desktop), 0 (mobile)\n`
        prompt += `- Padding: 24px\n`
        prompt += `- Display cards/widgets in grid:\n`
        prompt += `  * Grid: 3 columns desktop, 2 tablet, 1 mobile\n`
        prompt += `  * Gap: 24px between cards\n`
        prompt += `- Each card:\n`
        prompt += `  * White background\n`
        prompt += `  * Rounded corners (8px)\n`
        prompt += `  * Shadow for depth\n`
        prompt += `  * Padding: 20px\n`
        prompt += `  * Title at top\n\n`

        prompt += `**Responsive Behavior:**\n`
        prompt += `- Desktop (≥1024px): Sidebar + top nav + 3-column grid\n`
        prompt += `- Tablet (768-1023px): Icon sidebar + top nav + 2-column grid\n`
        prompt += `- Mobile (<768px): No sidebar + top nav + hamburger + 1-column grid\n\n`
      }
      else if (featureId === 'settings') {
        prompt += `## Settings & Profile Page (/settings)\n\n`
        prompt += `This page combines user profile management and account settings in one place.\n\n`

        prompt += `### PAGE LAYOUT\n\n`

        prompt += `- Use same navigation as dashboard\n`
        prompt += `- Main content: Max-width 800px, centered\n`
        prompt += `- Organize in sections with clear headings\n`
        prompt += `- Each section in white card with padding\n\n`

        prompt += `### PROFILE SECTION\n\n`

        prompt += `**Fields to Edit:**\n`
        prompt += `1. Avatar/Profile Picture:\n`
        prompt += `   - Show current avatar (circle, 100px diameter)\n`
        prompt += `   - "Change Photo" button → opens file picker\n`
        prompt += `   - Accept: image/jpeg, image/png\n`
        prompt += `   - Max size: 5MB\n`
        prompt += `   - Show preview before upload\n\n`

        prompt += `2. Name Field:\n`
        prompt += `   - Text input, current value pre-filled\n`
        prompt += `   - Required, max 50 characters\n`
        prompt += `   - Update button or auto-save on blur\n\n`

        prompt += `3. Email Field:\n`
        prompt += `   - Email input, current email pre-filled\n`
        prompt += `   - Validate email format\n`
        prompt += `   - Check uniqueness before saving\n`
        prompt += `   - Show "Email updated successfully" message\n\n`

        prompt += `### PASSWORD CHANGE SECTION\n\n`

        prompt += `**Form Fields:**\n`
        prompt += `1. Current Password: password input, required\n`
        prompt += `2. New Password: password input, min 8 chars, show strength\n`
        prompt += `3. Confirm New Password: must match new password\n\n`

        prompt += `**Validation:**\n`
        prompt += `- Verify current password is correct\n`
        prompt += `- New password must be different from current\n`
        prompt += `- New password minimum 8 characters\n`
        prompt += `- Confirm password must match exactly\n`
        prompt += `- Show error for each validation failure\n`
        prompt += `- Show success message after change\n`
        prompt += `- Clear form after successful change\n\n`

        prompt += `### NOTIFICATION PREFERENCES\n\n`

        prompt += `**Toggle Switches:**\n`
        prompt += `- Email notifications: ON/OFF toggle\n`
        prompt += `- Push notifications: ON/OFF toggle\n`
        prompt += `- Marketing emails: ON/OFF toggle\n`
        prompt += `- Save preferences immediately on toggle\n`
        prompt += `- Show "Preferences saved" toast message\n\n`

        prompt += `### ACTIVITY HISTORY (Optional)\n\n`

        prompt += `**Recent Activity List:**\n`
        prompt += `- Show last 10 user actions/activities\n`
        prompt += `- Each item displays:\n`
        prompt += `  * Action description (e.g., "Logged in", "Updated profile", "Changed password")\n`
        prompt += `  * Timestamp (relative: "2 hours ago" or absolute: "Jan 15, 2025 at 3:30 PM")\n`
        prompt += `  * Device/location if available (e.g., "Chrome on Mac, San Francisco")\n`
        prompt += `- Paginate if more than 10 items\n`
        prompt += `- Style: List with subtle borders, gray text for timestamp\n\n`

        prompt += `### ACCOUNT DELETION\n\n`

        prompt += `**Danger Zone Section:**\n`
        prompt += `- Red background or border to indicate danger\n`
        prompt += `- "Delete Account" button in red\n`
        prompt += `- Click → show confirmation modal:\n`
        prompt += `  * Title: "Delete Account?"\n`
        prompt += `  * Message: "This action cannot be undone. All your data will be permanently deleted."\n`
        prompt += `  * Input: "Type DELETE to confirm"\n`
        prompt += `  * Buttons: "Cancel" (gray) + "Delete Forever" (red, disabled until typed)\n`
        prompt += `- After deletion: logout and redirect to homepage\n\n`
      }
      else if (featureId === 'forms') {
        const formTitle = formName || (formTemplate === 'custom' ? 'Custom Form' : formTemplate.charAt(0).toUpperCase() + formTemplate.slice(1) + ' Form')
        prompt += `## ${formTitle}\n\n`

        prompt += `### FORM STRUCTURE - READ CAREFULLY\n\n`

        // Separate always visible from conditional fields
        const alwaysVisibleFields = formFields.filter(field => {
          const hasShowRule = conditionalRules.some(r =>
            r.action === 'show' && r.targetFields?.includes(field.id)
          )
          return !hasShowRule
        })

        const conditionalFieldIds = new Set()
        conditionalRules.forEach(rule => {
          if (rule.action === 'show' && rule.targetFields) {
            rule.targetFields.forEach(id => conditionalFieldIds.add(id))
          }
        })

        if (formFields.length > 0) {
          prompt += `**ALWAYS VISIBLE FIELDS** (render these immediately):\n\n`

          alwaysVisibleFields.forEach((field, idx) => {
            const widthMap = { '33': '33.33%', '50': '50%', '100': '100%' }
            const widthPercent = widthMap[field.width || '100']

            prompt += `${idx + 1}. "${field.label || 'Unnamed Field'}"\n`
            prompt += `   - Type: ${field.type}\n`
            prompt += `   - Width: ${widthPercent} of container\n`
            prompt += `   - Required: ${field.required ? 'YES - add asterisk (*) to label, validate on submit' : 'NO'}\n`

            if (field.placeholder) {
              prompt += `   - Placeholder text: "${field.placeholder}"\n`
            }

            if (field.type === 'dropdown' && field.options && field.options.length > 0) {
              const cleanOptions = field.options.filter(opt => opt.trim())
              if (cleanOptions.length > 0) {
                prompt += `   - Dropdown options: ${cleanOptions.map(opt => `"${opt}"`).join(', ')}\n`
              }
            }

            prompt += `   - CSS: Use flexbox or grid. Set width to ${widthPercent}. Add responsive behavior for mobile.\n`
            prompt += `\n`
          })

          // Show conditional fields
          const conditionalFields = formFields.filter(field => conditionalFieldIds.has(field.id))

          if (conditionalFields.length > 0) {
            prompt += `\n**CONDITIONAL FIELDS** (render only when conditions are met):\n\n`

            conditionalFields.forEach((field, idx) => {
              const widthMap = { '33': '33.33%', '50': '50%', '100': '100%' }
              const widthPercent = widthMap[field.width || '100']

              prompt += `${idx + 1}. "${field.label || 'Unnamed Field'}"\n`
              prompt += `   - Type: ${field.type}\n`
              prompt += `   - Width: ${widthPercent} of container\n`
              prompt += `   - Required: ${field.required ? 'YES (when visible)' : 'NO'}\n`

              if (field.placeholder) {
                prompt += `   - Placeholder: "${field.placeholder}"\n`
              }

              if (field.type === 'dropdown' && field.options && field.options.length > 0) {
                const cleanOptions = field.options.filter(opt => opt.trim())
                if (cleanOptions.length > 0) {
                  prompt += `   - Options: ${cleanOptions.map(opt => `"${opt}"`).join(', ')}\n`
                }
              }

              // Find what triggers this field
              const triggers = conditionalRules.filter(r =>
                r.action === 'show' && r.targetFields?.includes(field.id)
              )

              prompt += `   - VISIBILITY CONDITION:\n`
              triggers.forEach(rule => {
                const triggerField = formFields.find(f => f.id === rule.triggerField)
                if (triggerField) {
                  prompt += `     * Show when "${triggerField.label}" equals "${rule.value}"\n`
                }
              })

              prompt += `\n`
            })
          }
        }

        if (conditionalRules.length > 0) {
          prompt += `\n### CONDITIONAL LOGIC - IMPLEMENTATION INSTRUCTIONS\n\n`

          prompt += `**Step 1: Setup State**\n`
          prompt += `\`\`\`javascript\n`
          prompt += `const [formData, setFormData] = useState({\n`
          formFields.forEach(field => {
            const defaultVal = field.type === 'checkbox' ? 'false' : "``"
            prompt += `  '${field.label}': ${defaultVal},\n`
          })
          prompt += `})\n`

          // Add visibility state for conditional fields
          if (conditionalFieldIds.size > 0) {
            prompt += `\n// Track visibility of conditional fields\n`
            prompt += `const [fieldVisibility, setFieldVisibility] = useState({\n`
            conditionalFields.forEach(field => {
              prompt += `  '${field.label}': false,\n`
            })
            prompt += `})\n`
          }
          prompt += `\`\`\`\n\n`

          prompt += `**Step 2: Rules Logic**\n\n`
          conditionalRules.forEach((rule, idx) => {
            const triggerField = formFields.find(f => f.id === rule.triggerField)

            if (triggerField) {
              prompt += `Rule ${idx + 1}:\n`
              prompt += `- TRIGGER: When user changes "${triggerField.label}"\n`
              prompt += `- CONDITION: If value equals "${rule.value}"\n`

              if (rule.action === 'show' || rule.action === 'hide') {
                const targetFields = rule.targetFields || [rule.targetField]
                const targetFieldLabels = targetFields
                  .map(id => formFields.find(f => f.id === id)?.label)
                  .filter(Boolean)

                prompt += `- ACTION: ${rule.action.toUpperCase()} field(s): ${targetFieldLabels.map(l => `"${l}"`).join(', ')}\n`
                prompt += `- CODE:\n`
                prompt += `\`\`\`javascript\n`
                prompt += `useEffect(() => {\n`
                prompt += `  if (formData['${triggerField.label}'] === '${rule.value}') {\n`
                targetFieldLabels.forEach(label => {
                  const shouldShow = rule.action === 'show'
                  prompt += `    setFieldVisibility(prev => ({ ...prev, '${label}': ${shouldShow} }))\n`
                })
                prompt += `  } else {\n`
                targetFieldLabels.forEach(label => {
                  const shouldShow = rule.action === 'show'
                  prompt += `    setFieldVisibility(prev => ({ ...prev, '${label}': ${!shouldShow} }))\n`
                })
                prompt += `  }\n`
                prompt += `}, [formData['${triggerField.label}']])\n`
                prompt += `\`\`\`\n\n`

                prompt += `- RENDER: Wrap field in conditional:\n`
                prompt += `\`\`\`jsx\n`
                targetFieldLabels.forEach(label => {
                  prompt += `{fieldVisibility['${label}'] && (\n`
                  prompt += `  <div>/* ${label} field component */</div>\n`
                  prompt += `)}\n`
                })
                prompt += `\`\`\`\n\n`
              }
            }
          })

          prompt += `**Step 3: Handle Form Changes**\n`
          prompt += `\`\`\`javascript\n`
          prompt += `const handleChange = (fieldName, value) => {\n`
          prompt += `  setFormData(prev => ({ ...prev, [fieldName]: value }))\n`
          prompt += `  // Conditional logic useEffects will trigger automatically\n`
          prompt += `}\n`
          prompt += `\`\`\`\n\n`
        }

        prompt += `### LAYOUT INSTRUCTIONS\n\n`
        prompt += `- Use CSS Grid or Flexbox for form layout\n`
        prompt += `- Each field respects its width: 33.33%, 50%, or 100%\n`
        prompt += `- On mobile (< 768px): ALL fields become 100% width (full width)\n`
        prompt += `- Add proper spacing between fields (16px gap recommended)\n`
        prompt += `- Align labels above inputs\n`
        prompt += `- Style required fields with asterisk (*) in red\n\n`

        prompt += `### VALIDATION RULES\n\n`
        formFields.filter(f => f.required).forEach(field => {
          prompt += `- "${field.label}": Required field - show error "This field is required" if empty on submit\n`
        })

        const emailFields = formFields.filter(f => f.type === 'email')
        if (emailFields.length > 0) {
          emailFields.forEach(field => {
            prompt += `- "${field.label}": Validate email format - show error "Invalid email address" if format wrong\n`
          })
        }

        prompt += `\n### FORM BEHAVIOR\n\n`
        prompt += `- Show loading spinner on submit button while processing\n`
        prompt += `- Disable submit button while loading\n`
        prompt += `- Display success message after successful submission\n`
        prompt += `- Display error message if submission fails\n`
        prompt += `- Clear form after successful submission\n`
        prompt += `- Validate all visible required fields before allowing submission\n\n`
      }
      else if (featureId === 'payments') {
        const service = services.payments.find(s => s.id === paymentService)
        prompt += `## Payment Processing (${service.name})\n`
        prompt += `- Pricing cards display\n`
        prompt += `- Checkout flow\n`
        prompt += `- Payment confirmation\n`
        prompt += `- Store payment data\n\n`
      }
      else if (featureId === 'emails') {
        prompt += `## Email Notifications (${emailService === 'resend' ? 'Resend' : emailService})\n`
        prompt += `- Welcome email template\n`
        prompt += `- Password reset email\n`
        prompt += `- Notification emails\n`
        prompt += `- Branded HTML templates\n\n`
      }
      // COMMON COMPONENTS
      else if (featureId === 'header') {
        prompt += `## Header/Navigation Component\n\n`

        prompt += `### HEADER STYLE: ${headerStyle.toUpperCase()}\n\n`

        if (headerStyle === 'horizontal') {
          prompt += `**Horizontal Header Layout:**\n`
          prompt += `- Fixed position at top, width 100%, height 64px\n`
          prompt += `- Background: white with shadow\n`
          prompt += `- Left side: Logo/brand name (clickable → home)\n`
          prompt += `- Center/Right: Navigation menu\n`
          prompt += `- Mobile (< 768px): Hamburger menu icon, slide-out menu\n\n`
        } else if (headerStyle === 'centered') {
          prompt += `**Centered Header Layout:**\n`
          prompt += `- Logo centered at top\n`
          prompt += `- Navigation menu centered below logo\n`
          prompt += `- Horizontal menu items with spacing\n`
          prompt += `- Elegant, minimal design\n\n`
        } else if (headerStyle === 'sidebar') {
          prompt += `**Sidebar Navigation:**\n`
          prompt += `- Fixed left sidebar, width 240px, full height\n`
          prompt += `- Logo at top\n`
          prompt += `- Vertical menu items with icons\n`
          prompt += `- Collapse to icons-only on tablet\n`
          prompt += `- Hide on mobile, use hamburger\n\n`
        }

        prompt += `**Navigation Menu Items:**\n`
        headerMenuItems.forEach((item, idx) => {
          prompt += `${idx + 1}. "${item.label}" → ${item.link}\n`
        })
        prompt += `\n`

        prompt += `**Navigation Features:**\n`
        prompt += `- Highlight active page\n`
        prompt += `- Hover effect on menu items\n`
        prompt += `- Smooth transitions\n`
        prompt += `- User menu dropdown (if authenticated):\n`
        prompt += `  * Avatar/name\n`
        prompt += `  * Profile link\n`
        prompt += `  * Settings link\n`
        prompt += `  * Logout button\n`
        prompt += `- Login/Signup buttons (if not authenticated)\n\n`
      }
      else if (featureId === 'footer') {
        prompt += `## Footer Component\n\n`

        prompt += `### FOOTER STYLE: ${footerStyle.toUpperCase()}\n\n`

        if (footerStyle === 'simple') {
          prompt += `**Simple Footer:**\n`
          prompt += `- Single row, centered content\n`
          prompt += `- Copyright text: "© 2025 [Brand Name]. All rights reserved."\n`
          prompt += `- Links in a row: ${footerLinks.map(l => l.label).join(' | ')}\n`
          prompt += `- Background: gray-50, padding: 24px\n`
          prompt += `- Border-top: 1px solid gray-200\n\n`
        } else if (footerStyle === 'multi-column') {
          prompt += `**Multi-Column Footer:**\n`
          prompt += `- 4 columns on desktop, 2 on tablet, 1 on mobile\n`
          prompt += `- Column 1: Company info + logo\n`
          prompt += `- Column 2: Product links\n`
          prompt += `- Column 3: Resources links\n`
          prompt += `- Column 4: Social media icons\n`
          prompt += `- Bottom row: Copyright + legal links\n`
          prompt += `- Background: dark gray or brand color\n`
          prompt += `- Text: white or light gray\n\n`
        } else if (footerStyle === 'newsletter') {
          prompt += `**Footer with Newsletter:**\n`
          prompt += `- Top section: Newsletter signup\n`
          prompt += `  * Heading: "Subscribe to our newsletter"\n`
          prompt += `  * Email input + Subscribe button\n`
          prompt += `  * Side-by-side layout\n`
          prompt += `- Bottom section: Links + copyright\n`
          prompt += `- Background gradient\n\n`
        }

        prompt += `**Footer Links:**\n`
        footerLinks.forEach((link, idx) => {
          prompt += `${idx + 1}. "${link.label}" → ${link.link}\n`
        })
        prompt += `\n`
      }
      else if (featureId === 'modal') {
        prompt += `## Modal/Dialog Component\n\n`

        prompt += `### MODAL TYPE: ${modalType.toUpperCase()}\n\n`

        if (modalType === 'center') {
          prompt += `**Centered Modal:**\n`
          prompt += `- Overlay: Fixed, full screen, black with 50% opacity\n`
          prompt += `- Modal box: Centered, max-width 500px, white background\n`
          prompt += `- Rounded corners: 12px, shadow: large\n`
          prompt += `- Padding: 24px\n`
          prompt += `- Close button (X): Top-right corner\n`
          prompt += `- Click overlay → close modal\n`
          prompt += `- ESC key → close modal\n`
          prompt += `- Prevent body scroll when open\n\n`
        } else if (modalType === 'side-panel') {
          prompt += `**Side Panel Modal:**\n`
          prompt += `- Slide in from right side\n`
          prompt += `- Full height, width 400px\n`
          prompt += `- Smooth slide animation (300ms)\n`
          prompt += `- Overlay on left side\n`
          prompt += `- Close button at top\n`
          prompt += `- Perfect for filters, settings, forms\n\n`
        } else if (modalType === 'full-screen') {
          prompt += `**Full-Screen Modal:**\n`
          prompt += `- Covers entire viewport\n`
          prompt += `- Close button: top-right corner, large\n`
          prompt += `- Centered content, max-width for readability\n`
          prompt += `- Good for image galleries, detailed views\n\n`
        }

        prompt += `**Modal Structure:**\n`
        prompt += `- Header: Title + close button\n`
        prompt += `- Body: Main content (scrollable if needed)\n`
        prompt += `- Footer: Action buttons (Cancel + Confirm)\n\n`

        prompt += `**Accessibility:**\n`
        prompt += `- Trap focus inside modal\n`
        prompt += `- Return focus to trigger element on close\n`
        prompt += `- aria-modal="true"\n`
        prompt += `- role="dialog"\n\n`
      }
      else if (featureId === 'cards') {
        prompt += `## Cards & Listings Component\n\n`

        prompt += `### CARD STYLE: ${cardStyle.toUpperCase()}\n\n`

        if (cardStyle === 'basic') {
          prompt += `**Basic Card:**\n`
          prompt += `- White background, rounded corners (8px)\n`
          prompt += `- Shadow: medium\n`
          prompt += `- Padding: 20px\n`
          prompt += `- Structure:\n`
          prompt += `  * Title (h3, bold, 18px)\n`
          prompt += `  * Description (p, gray-600, 14px)\n`
          prompt += `  * Optional: Button or link at bottom\n`
          prompt += `- Hover: Lift effect (shadow increase + translateY(-2px))\n\n`
        } else if (cardStyle === 'image-top') {
          prompt += `**Image-Top Card:**\n`
          prompt += `- Image at top (width 100%, height 200px, object-fit cover)\n`
          prompt += `- Rounded top corners\n`
          prompt += `- Content below image:\n`
          prompt += `  * Title\n`
          prompt += `  * Description\n`
          prompt += `  * Tags or metadata\n`
          prompt += `  * Action button\n`
          prompt += `- Perfect for blog posts, products, portfolios\n\n`
        } else if (cardStyle === 'horizontal') {
          prompt += `**Horizontal Card:**\n`
          prompt += `- Image on left (width 40%, height 100%)\n`
          prompt += `- Content on right (width 60%):\n`
          prompt += `  * Title\n`
          prompt += `  * Description\n`
          prompt += `  * Metadata (date, author, etc.)\n`
          prompt += `- Good for news articles, list items\n\n`
        }

        prompt += `**List/Grid Layout:**\n`
        prompt += `- Grid: 3 columns desktop, 2 tablet, 1 mobile\n`
        prompt += `- Gap: 24px between cards\n`
        prompt += `- Responsive breakpoints: 1024px, 768px\n\n`
      }
      else if (featureId === 'accordion') {
        prompt += `## Accordion/Collapse Component\n\n`

        prompt += `### ACCORDION TYPE: ${accordionStyle.toUpperCase()}\n\n`

        if (accordionStyle === 'single') {
          prompt += `**Single Open (Accordion):**\n`
          prompt += `- Only one section open at a time\n`
          prompt += `- Opening new section closes previous\n`
          prompt += `- Good for FAQs, documentation\n\n`
        } else if (accordionStyle === 'multiple') {
          prompt += `**Multiple Open (Collapse):**\n`
          prompt += `- Multiple sections can be open simultaneously\n`
          prompt += `- Each section independent\n`
          prompt += `- Good for filters, categories\n\n`
        }

        prompt += `**Structure:**\n`
        prompt += `- Each item:\n`
        prompt += `  * Header: Title + expand/collapse icon (chevron)\n`
        prompt += `  * Content: Hidden/shown with smooth height transition\n`
        prompt += `  * Border between items\n`
        prompt += `- Icon rotates when expanded (chevron-down → chevron-up)\n`
        prompt += `- Smooth animation (300ms ease)\n\n`

        prompt += `**Styling:**\n`
        prompt += `- Header: Clickable, hover effect, padding 16px\n`
        prompt += `- Content: Padding 16px, gray background\n`
        prompt += `- Active header: Bold text or colored background\n\n`
      }
      else if (featureId === 'tabs') {
        prompt += `## Tabs Component\n\n`

        prompt += `### TAB STYLE: ${tabsStyle.toUpperCase()}\n\n`

        if (tabsStyle === 'horizontal') {
          prompt += `**Horizontal Tabs:**\n`
          prompt += `- Tab buttons in a row at top\n`
          prompt += `- Active tab: Bottom border (3px, primary color)\n`
          prompt += `- Inactive tabs: Gray text, hover effect\n`
          prompt += `- Content below tabs\n`
          prompt += `- Smooth content transition (fade)\n\n`
        } else if (tabsStyle === 'vertical') {
          prompt += `**Vertical Tabs:**\n`
          prompt += `- Tabs on left side (width 200px)\n`
          prompt += `- Content on right side (flex-grow)\n`
          prompt += `- Active tab: Left border (3px) + background color\n`
          prompt += `- Good for settings pages, dashboards\n\n`
        }

        prompt += `**Tab Structure:**\n`
        prompt += `- Tab buttons:\n`
        prompt += `  * Padding: 12px 20px\n`
        prompt += `  * Cursor: pointer\n`
        prompt += `  * Active state clearly visible\n`
        prompt += `- Content panels:\n`
        prompt += `  * Only show active panel\n`
        prompt += `  * Fade in animation\n`
        prompt += `  * Padding: 20px\n\n`
      }
      else if (featureId === 'breadcrumbs') {
        prompt += `## Breadcrumbs Component\n\n`
        prompt += `**Navigation Path Display:**\n`
        prompt += `- Show current page location: Home > Category > Subcategory > Current Page\n`
        prompt += `- Separator: "/" or ">" symbol\n`
        prompt += `- All items clickable except last (current page)\n`
        prompt += `- Last item: Bold or different color\n`
        prompt += `- Hover effect on clickable items\n\n`

        prompt += `**Styling:**\n`
        prompt += `- Display: inline-flex with gap\n`
        prompt += `- Font-size: 14px\n`
        prompt += `- Links: blue or primary color\n`
        prompt += `- Current page: gray-700, not clickable\n`
        prompt += `- Margin: 16px 0\n\n`
      }
      else if (featureId === 'pagination') {
        prompt += `## Pagination Component\n\n`
        prompt += `**Page Navigation:**\n`
        prompt += `- Numbered buttons: 1, 2, 3, ..., n\n`
        prompt += `- Previous/Next buttons with arrows\n`
        prompt += `- Current page: Highlighted (primary color background, white text)\n`
        prompt += `- Other pages: White background, border, hover effect\n`
        prompt += `- Disabled state for first/last pages\n\n`

        prompt += `**Features:**\n`
        prompt += `- Show "..." for large page ranges (e.g., 1, 2, 3, ... 10)\n`
        prompt += `- Always show first and last page\n`
        prompt += `- Show 2 pages before and after current\n`
        prompt += `- Mobile: Show fewer page numbers\n\n`

        prompt += `**Styling:**\n`
        prompt += `- Button size: 40px x 40px\n`
        prompt += `- Gap: 8px between buttons\n`
        prompt += `- Rounded corners: 6px\n`
        prompt += `- Center aligned on page\n\n`
      }
      else if (featureId === 'api') {
        prompt += `## REST API\n`
        prompt += `- GET, POST, PUT, DELETE endpoints\n`
        prompt += `- Request validation\n`
        prompt += `- Error handling\n`
        prompt += `- Authentication middleware\n\n`
      }
      else if (featureId === 'graphql') {
        prompt += `## GraphQL API\n`
        prompt += `- GraphQL schema definition\n`
        prompt += `- Queries and mutations\n`
        prompt += `- Resolvers\n`
        prompt += `- Apollo Server setup\n\n`
      }
      else if (featureId === 'websockets') {
        prompt += `## WebSockets (Real-time)\n`
        prompt += `- WebSocket server setup\n`
        prompt += `- Real-time event handling\n`
        prompt += `- Client connection management\n`
        prompt += `- Broadcasting updates\n\n`
      }
    })

    if (prompt) {
      prompt += `\nMake it production-ready with clean code, proper error handling, and responsive design.`
    }
    return prompt
  }

  // Auto-generate prompt when selections change
  useEffect(() => {
    const prompt = generatePrompt()
    setCurrentPrompt(prompt)
  }, [projectTitle, projectDescription, framework, styling, routing, stateManagement, primaryColor, secondaryColor, shadows, roundness, spacing, animations, typography, selectedFeatures, authService, databaseService, paymentService, emailService, clerkApiKey, supabaseUrl, supabaseKey, jwtSecret, neonDbUrl, mongoDbUri, formTemplate, formName, formGrid, formFields, conditionalRules])

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setProjectTitle('')
    setProjectDescription('')
    setFramework('react-vite')
    setStyling('tailwind')
    setRouting('react-router')
    setStateManagement('context')
    setPrimaryColor('#102542')
    setSecondaryColor('#F87171')
    setShadows('medium')
    setRoundness('rounded')
    setSpacing('comfortable')
    setAnimations('subtle')
    setTypography('geologica')
    setHoveredFont('geologica')
    setFontSearch('')
    setFontDropdownOpen(false)
    setSelectedFeatures([])
    setExpandedCategories(['essentials', 'services'])
    setActiveConfig(null)
    setAuthService('clerk')
    setDatabaseService('neon')
    setPaymentService('stripe')
    setEmailService('resend')
    setClerkApiKey('')
    setSupabaseUrl('')
    setSupabaseKey('')
    setJwtSecret('')
    setNeonDbUrl('')
    setMongoDbUri('')
    setFormTemplate('custom')
    setFormName('My Form')
    setFormGrid('1')
    setFormFields([])
    setConditionalRules([])
    setCurrentPrompt('')
    setCopied(false)
    setShowGuide(null)
  }

  return (
    <div>
      <PageHeader
        icon={Lightbulb}
        title="AI Prompts"
        subtitle="Access ready-to-use prompts for building apps and features with AI tools"
        actions={
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors border border-gray-300 rounded-lg"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        }
      />

      <div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 2/12 - Features Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-8">
              <h2 className="text-base font-bold text-gray-800 mb-4">Select Features</h2>
              <div className="space-y-3">
                {featureCategories.map(category => (
                  <div key={category.id}>
                    <h3 className="text-xs font-semibold text-gray-700 mb-2">{category.label}</h3>
                    <div className="space-y-1">
                      {category.features.map(feature => (
                        <button
                          key={feature.id}
                          onClick={() => {
                            toggleFeature(feature.id)
                            if (feature.hasConfig) {
                              setActiveConfig(selectedFeatures.includes(feature.id) ? null : feature.id)
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                            selectedFeatures.includes(feature.id)
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {feature.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center 6/12 - Configuration */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[800px]">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="text-primary" size={20} />
                <h2 className="text-xl font-bold text-gray-800">Configuration</h2>
              </div>

              {!activeConfig && (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <div className="text-center">
                    <p className="text-lg mb-2">No feature selected</p>
                    <p className="text-sm">Select a feature above to configure it</p>
                  </div>
                </div>
              )}

              {/* Configuration Content - Inline */}
              {activeConfig && (
                <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                  {/* Show which feature is being configured */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {featureCategories
                          .flatMap(cat => cat.features)
                          .find(f => f.id === activeConfig)?.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {featureCategories
                          .flatMap(cat => cat.features)
                          .find(f => f.id === activeConfig)?.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveConfig(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Configuration content based on activeConfig */}
              {activeConfig === 'project' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g., TaskFlow Pro"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your app..."
                      className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Framework</label>
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        {techStack.framework.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Styling</label>
                      <select
                        value={styling}
                        onChange={(e) => setStyling(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        {techStack.styling.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Routing</label>
                      <select
                        value={routing}
                        onChange={(e) => setRouting(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        {techStack.routing.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <select
                        value={stateManagement}
                        onChange={(e) => setStateManagement(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      >
                        {techStack.stateManagement.map(opt => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeConfig === 'style' && (
                <div className="space-y-4">
                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shadows */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Shadows</label>
                    <div className="grid grid-cols-4 gap-3">
                      {designOptions.shadows.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setShadows(opt.id)}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            shadows === opt.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div
                            className="w-10 h-10 bg-white rounded"
                            style={{ boxShadow: opt.shadow }}
                          />
                          <div className="text-xs font-semibold">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Border Radius</label>
                    <div className="grid grid-cols-5 gap-2">
                      {designOptions.roundness.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setRoundness(opt.id)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            roundness === opt.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div
                            className="w-10 h-10 bg-gray-300"
                            style={{ borderRadius: opt.radius }}
                          />
                          <div className="text-xs font-semibold">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Spacing</label>
                    <div className="grid grid-cols-3 gap-3">
                      {designOptions.spacing.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setSpacing(opt.id)}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            spacing === opt.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 bg-gray-300 rounded" />
                            <div className="w-5 h-5 bg-gray-300 rounded" style={{ marginLeft: opt.value }} />
                          </div>
                          <div className="text-xs font-semibold">{opt.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Animations */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Animations</label>
                    <div className="grid grid-cols-4 gap-3">
                      {designOptions.animations.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setAnimations(opt.id)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            animations === opt.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="text-xs font-semibold text-center">{opt.label}</div>
                          <div className="text-xs text-gray-600 text-center">{opt.value}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Typography (Google Fonts)</label>
                    <div className="relative">
                      <button
                        onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-left flex items-center justify-between"
                      >
                        <span>{designOptions.typography.find(t => t.id === typography)?.label}</span>
                        <span className="text-gray-400">{fontDropdownOpen ? '▲' : '▼'}</span>
                      </button>

                      {fontDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden">
                          <div className="p-3 border-b border-gray-200">
                            <input
                              type="text"
                              placeholder="Search fonts..."
                              value={fontSearch}
                              onChange={(e) => setFontSearch(e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-0" style={{ height: '400px' }}>
                            <div className="border-r border-gray-200 overflow-y-auto">
                              {designOptions.typography
                                .filter(opt => opt.label.toLowerCase().includes(fontSearch.toLowerCase()))
                                .map(opt => (
                                  <button
                                    key={opt.id}
                                    onMouseEnter={() => setHoveredFont(opt.id)}
                                    onClick={() => {
                                      setTypography(opt.id)
                                      setHoveredFont(opt.id)
                                      setFontDropdownOpen(false)
                                      setFontSearch('')
                                    }}
                                    className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors ${
                                      typography === opt.id ? 'bg-blue-100' : ''
                                    } ${hoveredFont === opt.id ? 'bg-blue-50' : ''}`}
                                    style={{ fontFamily: opt.font }}
                                  >
                                    <div className="text-sm font-semibold">{opt.label}</div>
                                  </button>
                                ))}
                            </div>

                            <div className="p-4 bg-gray-50 overflow-hidden">
                              <div className="text-xs text-gray-500 mb-3 font-mono">Preview:</div>
                              <div
                                className="text-2xl font-bold text-gray-800 mb-3"
                                style={{ fontFamily: designOptions.typography.find(t => t.id === hoveredFont)?.font }}
                              >
                                {designOptions.typography.find(t => t.id === hoveredFont)?.label}
                              </div>
                              <div
                                className="text-base text-gray-700 mb-3 break-words"
                                style={{ fontFamily: designOptions.typography.find(t => t.id === hoveredFont)?.font }}
                              >
                                The quick brown fox jumps over the lazy dog
                              </div>

                              <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-2">Font Weights:</div>
                                <div className="space-y-1">
                                  {[400, 500, 600, 700].map(weight => (
                                    <div
                                      key={weight}
                                      className="text-sm text-gray-700"
                                      style={{
                                        fontFamily: designOptions.typography.find(t => t.id === hoveredFont)?.font,
                                        fontWeight: weight
                                      }}
                                    >
                                      Typography ({weight})
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* HEADER CONFIGURATION */}
              {activeConfig === 'header' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Header</h3>

                  {/* Header Style Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Header Style:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'horizontal', label: 'Horizontal', desc: 'Logo left, menu right' },
                        { id: 'centered', label: 'Centered', desc: 'Logo & menu centered' },
                        { id: 'sidebar', label: 'Sidebar', desc: 'Fixed left navigation' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setHeaderStyle(style.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            headerStyle === style.id
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-20 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
                            {style.id === 'horizontal' && 'Logo | Menu →'}
                            {style.id === 'centered' && '← Logo →'}
                            {style.id === 'sidebar' && '| Nav'}
                          </div>
                          <div className="font-semibold text-sm">{style.label}</div>
                          <div className="text-xs text-gray-600">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Menu Items:</label>
                    <div className="space-y-2">
                      {headerMenuItems.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...headerMenuItems]
                              updated[idx].label = e.target.value
                              setHeaderMenuItems(updated)
                            }}
                            placeholder="Label"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={item.link}
                            onChange={(e) => {
                              const updated = [...headerMenuItems]
                              updated[idx].link = e.target.value
                              setHeaderMenuItems(updated)
                            }}
                            placeholder="/path"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => setHeaderMenuItems(headerMenuItems.filter((_, i) => i !== idx))}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setHeaderMenuItems([...headerMenuItems, { label: 'New Item', link: '/new' }])}
                        className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        + Add Menu Item
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER CONFIGURATION */}
              {activeConfig === 'footer' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Footer</h3>

                  {/* Footer Style Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Footer Style:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'simple', label: 'Simple', desc: 'Single row layout' },
                        { id: 'multi-column', label: 'Multi-Column', desc: '4 column layout' },
                        { id: 'newsletter', label: 'Newsletter', desc: 'With signup form' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setFooterStyle(style.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            footerStyle === style.id
                              ? 'border-primary bg-blue-50'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-16 bg-gray-200 rounded mb-2"></div>
                          <div className="font-semibold text-sm">{style.label}</div>
                          <div className="text-xs text-gray-600">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Footer Links:</label>
                    <div className="space-y-2">
                      {footerLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => {
                              const updated = [...footerLinks]
                              updated[idx].label = e.target.value
                              setFooterLinks(updated)
                            }}
                            placeholder="Label"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={link.link}
                            onChange={(e) => {
                              const updated = [...footerLinks]
                              updated[idx].link = e.target.value
                              setFooterLinks(updated)
                            }}
                            placeholder="/path"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => setFooterLinks(footerLinks.filter((_, i) => i !== idx))}
                            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setFooterLinks([...footerLinks, { label: 'New Link', link: '/new' }])}
                        className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                      >
                        + Add Link
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONFIGURATION */}
              {activeConfig === 'modal' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Modal</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Modal Type:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'center', label: 'Centered', desc: 'Classic popup' },
                        { id: 'side-panel', label: 'Side Panel', desc: 'Slides from right' },
                        { id: 'full-screen', label: 'Full Screen', desc: 'Covers viewport' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setModalType(type.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            modalType === type.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="font-semibold text-sm">{type.label}</div>
                          <div className="text-xs text-gray-600">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CARDS CONFIGURATION */}
              {activeConfig === 'cards' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Cards</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Card Style:</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'basic', label: 'Basic', desc: 'Simple layout' },
                        { id: 'image-top', label: 'Image Top', desc: 'Image header' },
                        { id: 'horizontal', label: 'Horizontal', desc: 'Image left' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setCardStyle(style.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            cardStyle === style.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="font-semibold text-sm">{style.label}</div>
                          <div className="text-xs text-gray-600">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ACCORDION CONFIGURATION */}
              {activeConfig === 'accordion' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Accordion</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Behavior:</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'single', label: 'Single Open', desc: 'One section at a time' },
                        { id: 'multiple', label: 'Multiple Open', desc: 'Multiple sections' }
                      ].map(type => (
                        <button
                          key={type.id}
                          onClick={() => setAccordionStyle(type.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            accordionStyle === type.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="font-semibold text-sm">{type.label}</div>
                          <div className="text-xs text-gray-600">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TABS CONFIGURATION */}
              {activeConfig === 'tabs' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-800">Configure Tabs</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Orientation:</label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'horizontal', label: 'Horizontal', desc: 'Tabs at top' },
                        { id: 'vertical', label: 'Vertical', desc: 'Tabs on left' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setTabsStyle(style.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            tabsStyle === style.id ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="h-20 bg-gray-200 rounded mb-2"></div>
                          <div className="font-semibold text-sm">{style.label}</div>
                          <div className="text-xs text-gray-600">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeConfig === 'auth' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Authentication Service:</label>

                  {/* Selection Boxes */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => setAuthService('clerk')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        authService === 'clerk' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Clerk</div>
                    </button>

                    <button
                      onClick={() => setAuthService('supabase')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        authService === 'supabase' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Supabase Auth</div>
                    </button>

                    <button
                      onClick={() => setAuthService('custom')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        authService === 'custom' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Custom JWT</div>
                    </button>
                  </div>

                  {/* Service Details */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {authService === 'clerk' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Publishable Key:
                          </label>
                          <input
                            type="text"
                            value={clerkApiKey}
                            onChange={(e) => setClerkApiKey(e.target.value)}
                            placeholder="pk_test_1A2b3C4d5E6f7G8h9I0j1K2l3M4n5O6p7Q8r9S0t"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                          />
                          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">How to get your key:</p>
                            <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                              <li>Go to clerk.com and sign in</li>
                              <li>Select your application or create a new one</li>
                              <li>Click on "API Keys" in the left sidebar</li>
                              <li>Copy the "Publishable key"</li>
                              <li>Paste it in the field above</li>
                            </ol>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            Complete user management platform with pre-built UI components. Perfect for PMs who want authentication working quickly.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 10 min • <strong>Cost:</strong> Free up to 10K users
                          </div>
                        </div>
                      </>
                    )}

                    {authService === 'supabase' && (
                      <>
                        <div className="mb-4 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Project URL:</label>
                            <input
                              type="text"
                              value={supabaseUrl}
                              onChange={(e) => setSupabaseUrl(e.target.value)}
                              placeholder="https://abcdefghijklmnop.supabase.co"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">Anon Key:</label>
                            <input
                              type="text"
                              value={supabaseKey}
                              onChange={(e) => setSupabaseKey(e.target.value)}
                              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                            />
                          </div>
                          <div className="p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">How to get your keys:</p>
                            <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                              <li>Go to supabase.com and sign in</li>
                              <li>Select your project</li>
                              <li>Click "Project Settings" → "API"</li>
                              <li>Copy URL and anon key</li>
                            </ol>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            Open-source Firebase alternative. Combines authentication with PostgreSQL database.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 15 min • <strong>Cost:</strong> Very generous free tier
                          </div>
                        </div>
                      </>
                    )}

                    {authService === 'custom' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">JWT Secret Key:</label>
                          <input
                            type="text"
                            value={jwtSecret}
                            onChange={(e) => setJwtSecret(e.target.value)}
                            placeholder="a3f8c9d4e7b2f1a6c8e5d9b3f7a2c6e1d4b8f3a7c2e9d6b1f4a8c3e7d2b5f9a6c3"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                          />
                          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">How to generate:</p>
                            <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                              <li>Open terminal</li>
                              <li>Run: <code className="bg-gray-200 px-1 rounded text-xs">node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"</code></li>
                              <li>Copy and paste above</li>
                            </ol>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            Build your own authentication from scratch. Full control but requires more coding.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 2-4 hours • <strong>Cost:</strong> Free (DIY)
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeConfig === 'database' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Database Service:</label>

                  {/* Selection Boxes */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                      onClick={() => setDatabaseService('neon')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        databaseService === 'neon' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Neon + Prisma</div>
                    </button>

                    <button
                      onClick={() => setDatabaseService('supabase-db')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        databaseService === 'supabase-db' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Supabase DB</div>
                    </button>

                    <button
                      onClick={() => setDatabaseService('mongodb')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        databaseService === 'mongodb' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">MongoDB</div>
                    </button>
                  </div>

                  {/* Service Details */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {databaseService === 'neon' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">Database URL:</label>
                          <input
                            type="text"
                            value={neonDbUrl}
                            onChange={(e) => setNeonDbUrl(e.target.value)}
                            placeholder="postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                          />
                          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">How to get connection string:</p>
                            <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                              <li>Go to neon.tech</li>
                              <li>Select project → Dashboard</li>
                              <li>Copy "Connection string"</li>
                            </ol>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            Serverless PostgreSQL with Prisma ORM. Auto-scales with type-safe queries.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 15 min • <strong>Cost:</strong> Free tier: 0.5GB
                          </div>
                        </div>
                      </>
                    )}

                    {databaseService === 'supabase-db' && (
                      <>
                        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs font-semibold text-gray-700 mb-2">📝 Note:</p>
                          <p className="text-xs text-gray-600">
                            Uses same credentials as Supabase Auth. If you configured Auth above, you're all set!
                          </p>
                        </div>

                        {(!supabaseUrl || !supabaseKey) && (
                          <div className="mb-4 space-y-3">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">Project URL:</label>
                              <input
                                type="text"
                                value={supabaseUrl}
                                onChange={(e) => setSupabaseUrl(e.target.value)}
                                placeholder="https://abcdefghijklmnop.supabase.co"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-2">Anon Key:</label>
                              <input
                                type="text"
                                value={supabaseKey}
                                onChange={(e) => setSupabaseKey(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                              />
                            </div>
                          </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            PostgreSQL with real-time features. Perfect if using Supabase Auth.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 5 min • <strong>Cost:</strong> Free tier: 500MB
                          </div>
                        </div>
                      </>
                    )}

                    {databaseService === 'mongodb' && (
                      <>
                        <div className="mb-4">
                          <label className="block text-xs font-semibold text-gray-700 mb-2">MongoDB URI:</label>
                          <input
                            type="text"
                            value={mongoDbUri}
                            onChange={(e) => setMongoDbUri(e.target.value)}
                            placeholder="mongodb+srv://username:password@cluster0.abc123.mongodb.net/myDatabase"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono"
                          />
                          <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-1">How to get connection string:</p>
                            <ol className="text-xs text-gray-600 space-y-0.5 list-decimal list-inside">
                              <li>Go to mongodb.com/cloud/atlas</li>
                              <li>Click "Connect" on your cluster</li>
                              <li>Choose "Connect your application"</li>
                              <li>Copy connection string</li>
                              <li>Replace &lt;password&gt; with your password</li>
                            </ol>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-600 mb-2">
                            <strong className="text-gray-800">What is it?</strong><br />
                            NoSQL database with flexible JSON-like documents. Great for rapid development.
                          </div>
                          <div className="text-xs text-gray-600">
                            <strong className="text-gray-800">Setup time:</strong> 20 min • <strong>Cost:</strong> Free tier: 512MB
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeConfig === 'payments' && (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Payment Service:</label>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setPaymentService('stripe')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentService === 'stripe' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Stripe</div>
                    </button>

                    <button
                      onClick={() => setPaymentService('lemonsqueezy')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        paymentService === 'lemonsqueezy' ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <div className="font-semibold text-sm text-center text-gray-800">Lemon Squeezy</div>
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-600 mb-2">
                      <strong className="text-gray-800">{paymentService === 'stripe' ? 'Stripe' : 'Lemon Squeezy'}</strong><br />
                      {paymentService === 'stripe'
                        ? 'Industry-standard payment processing. Handles cards, subscriptions, 135+ currencies.'
                        : 'All-in-one platform. Handles payments, taxes, VAT, and compliance automatically.'}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong className="text-gray-800">Fee:</strong> {paymentService === 'stripe' ? '2.9% + 30¢' : '5% + payment fees'}
                    </div>
                  </div>
                </div>
              )}

              {activeConfig === 'forms' && (
                <div className="space-y-4">
                  {/* Form Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Form Name:</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g., Contact Form, Registration Form"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Form Template:</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['login', 'signup', 'contact', 'custom'].map(template => (
                        <button
                          key={template}
                          onClick={() => {
                            setFormTemplate(template)
                            // Auto-populate fields for predefined templates
                            if (template === 'login') {
                              setFormFields([
                                { id: '1', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
                                { id: '2', label: 'Password', type: 'password', required: true, placeholder: '••••••••' }
                              ])
                              setConditionalRules([])
                            } else if (template === 'signup') {
                              setFormFields([
                                { id: '1', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
                                { id: '2', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
                                { id: '3', label: 'Password', type: 'password', required: true, placeholder: '••••••••' },
                                { id: '4', label: 'Confirm Password', type: 'password', required: true, placeholder: '••••••••' }
                              ])
                              setConditionalRules([])
                            } else if (template === 'contact') {
                              setFormFields([
                                { id: '1', label: 'Name', type: 'text', required: true, placeholder: 'Your name' },
                                { id: '2', label: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
                                { id: '3', label: 'Subject', type: 'text', required: true, placeholder: 'How can we help?' },
                                { id: '4', label: 'Message', type: 'textarea', required: true, placeholder: 'Your message...' }
                              ])
                              setConditionalRules([])
                            } else {
                              setFormFields([])
                              setConditionalRules([])
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formTemplate === template ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          <div className="text-sm font-semibold text-center capitalize">{template}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form Structure Preview Button */}
                  {formFields.length > 0 && (
                    <button
                      onClick={() => setShowFormMapModal(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl p-4 transition-all flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <span className="text-2xl">📋</span>
                      <span>View Form Structure</span>
                      <span className="text-sm opacity-90">({formFields.length} fields, {conditionalRules.length} rules)</span>
                    </button>
                  )}

                  {/* Custom Form Builder */}
                  {formTemplate && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-semibold text-gray-700">Form Fields:</label>
                        {formTemplate === 'custom' && (
                          <button
                            onClick={() => {
                              const newField = {
                                id: Date.now().toString(),
                                label: '',
                                type: 'text',
                                required: false,
                                placeholder: '',
                                options: [], // For dropdowns
                                width: '100' // 33.3%, 50%, or 100%
                              }
                              setFormFields([...formFields, newField])
                            }}
                            className="text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            + Add Field
                          </button>
                        )}
                      </div>

                      {/* Field List */}
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {formFields.map((field, index) => (
                          <div key={field.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-3">
                                {/* Label */}
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) => {
                                    const updated = [...formFields]
                                    updated[index].label = e.target.value
                                    setFormFields(updated)
                                  }}
                                  placeholder="Field Label"
                                  disabled={formTemplate !== 'custom'}
                                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary disabled:bg-gray-100"
                                />

                                <div className="grid grid-cols-3 gap-2">
                                  {/* Type */}
                                  <select
                                    value={field.type}
                                    onChange={(e) => {
                                      const updated = [...formFields]
                                      updated[index].type = e.target.value
                                      if (e.target.value === 'dropdown' && !updated[index].options) {
                                        updated[index].options = []
                                      }
                                      setFormFields(updated)
                                    }}
                                    disabled={formTemplate !== 'custom'}
                                    className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary disabled:bg-gray-100"
                                  >
                                    <option value="text">Text</option>
                                    <option value="email">Email</option>
                                    <option value="password">Password</option>
                                    <option value="phone">Phone</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="date-range">Date Range</option>
                                    <option value="dropdown">Dropdown</option>
                                    <option value="textarea">Text Area</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio</option>
                                  </select>

                                  {/* Width */}
                                  <select
                                    value={field.width || '100'}
                                    onChange={(e) => {
                                      const updated = [...formFields]
                                      updated[index].width = e.target.value
                                      setFormFields(updated)
                                    }}
                                    disabled={formTemplate !== 'custom'}
                                    className="px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary disabled:bg-gray-100"
                                    title="Field width"
                                  >
                                    <option value="33">📏 33% (1/3)</option>
                                    <option value="50">📏 50% (1/2)</option>
                                    <option value="100">📏 100% (Full)</option>
                                  </select>

                                  {/* Required */}
                                  <label className="flex items-center gap-2 px-2 py-1.5 text-xs border border-gray-300 rounded bg-white">
                                    <input
                                      type="checkbox"
                                      checked={field.required}
                                      onChange={(e) => {
                                        const updated = [...formFields]
                                        updated[index].required = e.target.checked
                                        setFormFields(updated)
                                      }}
                                      disabled={formTemplate !== 'custom'}
                                      className="w-3 h-3"
                                    />
                                    <span>Required</span>
                                  </label>
                                </div>

                                {/* Placeholder */}
                                <input
                                  type="text"
                                  value={field.placeholder}
                                  onChange={(e) => {
                                    const updated = [...formFields]
                                    updated[index].placeholder = e.target.value
                                    setFormFields(updated)
                                  }}
                                  placeholder="Placeholder text"
                                  disabled={formTemplate !== 'custom'}
                                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary disabled:bg-gray-100"
                                />

                                {/* Dropdown Options */}
                                {field.type === 'dropdown' && (
                                  <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700">Dropdown Options (one per line):</label>
                                    <textarea
                                      value={field.options?.join('\n') || ''}
                                      onChange={(e) => {
                                        const updated = [...formFields]
                                        // Keep all lines including empty ones while typing
                                        updated[index].options = e.target.value.split('\n')
                                        setFormFields(updated)
                                      }}
                                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                                      disabled={formTemplate !== 'custom'}
                                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary h-24 resize-none disabled:bg-gray-100 font-mono"
                                    />
                                    <p className="text-xs text-gray-500">Press Enter to add new line</p>
                                  </div>
                                )}
                              </div>

                              {/* Remove Button */}
                              {formTemplate === 'custom' && (
                                <button
                                  onClick={() => {
                                    setFormFields(formFields.filter(f => f.id !== field.id))
                                    // Remove related conditional rules
                                    setConditionalRules(conditionalRules.filter(r => r.triggerField !== field.id && r.targetField !== field.id))
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
                </div>
              )}
            </div>

            {/* OLD CONDITIONAL LOGIC SECTION REMOVED - NOW SEPARATE BELOW */}
            {false && formTemplate === 'custom' && formFields.length > 1 && (
                    <div className="border-t pt-4">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-semibold text-gray-700">Conditional Logic (Advanced):</label>
                          <button
                            onClick={() => {
                              const newRule = {
                                id: Date.now().toString(),
                                triggerField: '',
                                condition: 'equals',
                                value: '',
                                action: 'show',
                                targetField: '',
                                conditionalOptions: []
                              }
                              setConditionalRules([...conditionalRules, newRule])
                            }}
                            className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            + Add Rule
                          </button>
                        </div>

                        {/* Help Text with Examples */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-2">
                          <p className="font-semibold text-blue-900">💡 How to create complex conditional logic:</p>
                          <div className="space-y-2 text-blue-800">
                            <div>
                              <strong>Example 1:</strong> When Dropdown A = "Option 1", show multiple fields
                              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                                <li>Rule 1: When "Dropdown A" equals "Option 1" → Show "Dropdown B"</li>
                                <li>Rule 2: When "Dropdown A" equals "Option 1" → Change "Dropdown B" options to "4, 5, 6"</li>
                                <li>Rule 3: When "Dropdown A" equals "Option 1" → Show "Text Input A"</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Example 2:</strong> Different fields for different selections
                              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                                <li>Rule 1: When "Dropdown A" equals "Option 1" → Show "Dropdown B"</li>
                                <li>Rule 2: When "Dropdown A" equals "Option 1" → Change "Dropdown B" options to "3, 4"</li>
                                <li>Rule 3: When "Dropdown A" equals "Option 2" → Show "Checkbox C"</li>
                                <li>Rule 4: When "Dropdown A" equals "Option 2" → Hide "Dropdown B"</li>
                              </ul>
                            </div>
                            <p className="text-blue-900 font-semibold mt-2">
                              ⚡ Tip: Create multiple rules with the same trigger condition to apply multiple actions!
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {conditionalRules.map((rule, index) => {
                          // Check if this rule has the same trigger as previous rule for visual grouping
                          const prevRule = index > 0 ? conditionalRules[index - 1] : null
                          const sameAsPrevious = prevRule &&
                            prevRule.triggerField === rule.triggerField &&
                            prevRule.condition === rule.condition &&
                            prevRule.value === rule.value

                          return (
                          <div key={rule.id} className={`p-4 rounded-lg border-2 ${
                            sameAsPrevious
                              ? 'bg-purple-100 border-purple-400 ml-4'
                              : 'bg-purple-50 border-purple-200'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-semibold text-purple-900">
                                    {sameAsPrevious ? (
                                      <>↳ Additional Action for same condition</>
                                    ) : (
                                      <>Rule {index + 1}: IF... THEN...</>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      // Duplicate this rule
                                      const duplicated = {
                                        ...rule,
                                        id: Date.now().toString(),
                                        targetField: '',
                                        action: 'show'
                                      }
                                      const newRules = [...conditionalRules]
                                      newRules.splice(index + 1, 0, duplicated)
                                      setConditionalRules(newRules)
                                    }}
                                    className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded hover:bg-purple-300 transition-colors"
                                    title="Duplicate to add another action for same condition"
                                  >
                                    📋 Clone
                                  </button>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  {/* Trigger Field */}
                                  <select
                                    value={rule.triggerField}
                                    onChange={(e) => {
                                      const updated = [...conditionalRules]
                                      updated[index].triggerField = e.target.value
                                      // Reset value when trigger field changes
                                      updated[index].value = ''
                                      setConditionalRules(updated)
                                    }}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                  >
                                    <option value="">Select Field</option>
                                    {formFields.filter(f => f.type === 'dropdown' || f.type === 'radio').map(f => (
                                      <option key={f.id} value={f.id}>{f.label || 'Unnamed Field'}</option>
                                    ))}
                                  </select>

                                  {/* Condition */}
                                  <select
                                    value={rule.condition}
                                    onChange={(e) => {
                                      const updated = [...conditionalRules]
                                      updated[index].condition = e.target.value
                                      setConditionalRules(updated)
                                    }}
                                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                  >
                                    <option value="equals">Equals</option>
                                    <option value="notEquals">Not Equals</option>
                                  </select>

                                  {/* Value - Dynamic based on trigger field type */}
                                  {(() => {
                                    const triggerField = formFields.find(f => f.id === rule.triggerField)
                                    const hasOptions = triggerField && (triggerField.type === 'dropdown' || triggerField.type === 'radio') && triggerField.options && triggerField.options.length > 0

                                    if (hasOptions) {
                                      // Show dropdown with trigger field's options
                                      return (
                                        <select
                                          value={rule.value}
                                          onChange={(e) => {
                                            const updated = [...conditionalRules]
                                            updated[index].value = e.target.value
                                            setConditionalRules(updated)
                                          }}
                                          className="px-3 py-2 text-sm border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 bg-green-50"
                                        >
                                          <option value="">✨ Select from options</option>
                                          {triggerField.options.filter(opt => opt.trim()).map((opt, i) => (
                                            <option key={i} value={opt}>{opt}</option>
                                          ))}
                                        </select>
                                      )
                                    } else {
                                      // Show text input for other field types
                                      return (
                                        <input
                                          type="text"
                                          value={rule.value}
                                          onChange={(e) => {
                                            const updated = [...conditionalRules]
                                            updated[index].value = e.target.value
                                            setConditionalRules(updated)
                                          }}
                                          placeholder="Enter value"
                                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                        />
                                      )
                                    }
                                  })()}
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-semibold text-gray-700">Then do this action:</label>
                                  <div className="grid grid-cols-2 gap-3">
                                    {/* Action */}
                                    <select
                                      value={rule.action}
                                      onChange={(e) => {
                                        const updated = [...conditionalRules]
                                        updated[index].action = e.target.value
                                        setConditionalRules(updated)
                                      }}
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    >
                                      <option value="show">👁️ Show Field</option>
                                      <option value="hide">🙈 Hide Field</option>
                                      <option value="changeOptions">🔄 Change Options</option>
                                    </select>

                                    {/* Target Field */}
                                    <select
                                      value={rule.targetField}
                                      onChange={(e) => {
                                        const updated = [...conditionalRules]
                                        updated[index].targetField = e.target.value
                                        setConditionalRules(updated)
                                      }}
                                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                    >
                                      <option value="">Select Target Field</option>
                                      {formFields.filter(f => f.id !== rule.triggerField).map(f => (
                                        <option key={f.id} value={f.id}>
                                          {f.label || 'Unnamed Field'} ({f.type})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {/* Conditional Options (if action is changeOptions) */}
                                {rule.action === 'changeOptions' && (
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700">New options (one per line):</label>
                                    <textarea
                                      value={rule.conditionalOptions?.join('\n') || ''}
                                      onChange={(e) => {
                                        const updated = [...conditionalRules]
                                        // Keep all lines including empty ones while typing
                                        updated[index].conditionalOptions = e.target.value.split('\n')
                                        setConditionalRules(updated)
                                      }}
                                      placeholder="Option A&#10;Option B&#10;Option C"
                                      className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-primary h-20 resize-none font-mono"
                                    />
                                    <p className="text-xs text-gray-500">Press Enter to add new line</p>
                                  </div>
                                )}
                              </div>

                              {/* Remove Rule */}
                              <button
                                onClick={() => {
                                  setConditionalRules(conditionalRules.filter(r => r.id !== rule.id))
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold"
                                title="Delete this rule"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          )
                        })}
                      </div>

                      {conditionalRules.length === 0 && (
                        <div className="text-xs text-gray-500 italic text-center py-4">
                          No conditional rules yet. Click "+ Add Rule" to create interdependent fields.
                        </div>
                      )}

                      {/* Logic Summary */}
                      {conditionalRules.length > 0 && (() => {
                        // Group rules by their trigger condition
                        const grouped = conditionalRules.reduce((summary, rule) => {
                          const triggerField = formFields.find(f => f.id === rule.triggerField)
                          const targetField = formFields.find(f => f.id === rule.targetField)

                          if (!triggerField || !targetField) return summary

                          const key = `${rule.triggerField}_${rule.condition}_${rule.value}`
                          if (!summary[key]) {
                            summary[key] = {
                              trigger: `When "${triggerField.label}" ${rule.condition === 'equals' ? '=' : '≠'} "${rule.value}"`,
                              actions: []
                            }
                          }

                          let actionText = ''
                          if (rule.action === 'show') actionText = `Show "${targetField.label}"`
                          else if (rule.action === 'hide') actionText = `Hide "${targetField.label}"`
                          else if (rule.action === 'changeOptions') {
                            const opts = rule.conditionalOptions?.filter(o => o.trim()).join(', ') || 'N/A'
                            actionText = `Change "${targetField.label}" options to [${opts}]`
                          }

                          summary[key].actions.push(actionText)
                          return summary
                        }, {})

                        return (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-xs font-semibold text-green-900 mb-2">📊 Logic Summary ({Object.keys(grouped).length} condition{Object.keys(grouped).length > 1 ? 's' : ''}):</p>
                            <div className="space-y-2 text-xs text-green-800">
                              {Object.values(grouped).map((group, idx) => (
                                <div key={idx} className="bg-white rounded p-2">
                                  <strong className="text-green-900">{group.trigger}:</strong>
                                  <ul className="list-disc ml-5 mt-1">
                                    {group.actions.map((action, i) => (
                                      <li key={i}>{action}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

            {/* Conditional Logic Section - Separate from Form Builder */}
            {selectedFeatures.includes('forms') && formFields.length > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-purple-600">🔗</span> Conditional Logic
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Create smart forms with fields that show/hide based on user selections
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setTempRule({
                        triggerField: '',
                        condition: 'equals',
                        value: '',
                        action: 'show',
                        targetFields: [],
                        targetField: '',
                        conditionalOptions: []
                      })
                      setEditingRule(null)
                      setShowLogicModal(true)
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <span className="text-xl">+</span> Add Logic Rule
                  </button>
                </div>

                {conditionalRules.length === 0 ? (
                  <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-dashed border-purple-300">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">No Logic Rules Yet</h3>
                    <p className="text-gray-600 mb-4">
                      Create conditional logic to make your forms dynamic and intelligent
                    </p>
                    <button
                      onClick={() => {
                        setTempRule({
                          triggerField: '',
                          condition: 'equals',
                          value: '',
                          action: 'show',
                          targetField: '',
                          conditionalOptions: []
                        })
                        setEditingRule(null)
                        setShowLogicModal(true)
                      }}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Create Your First Rule
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conditionalRules.map((rule, index) => {
                      const triggerField = formFields.find(f => f.id === rule.triggerField)

                      // Handle both single and multiple target fields
                      const targetFields = rule.action === 'changeOptions'
                        ? (rule.targetField ? [formFields.find(f => f.id === rule.targetField)] : [])
                        : (rule.targetFields || []).map(id => formFields.find(f => f.id === id)).filter(Boolean)

                      if (!triggerField || targetFields.length === 0) return null

                      return (
                        <div
                          key={rule.id}
                          className="bg-white rounded-lg p-4 border-2 border-purple-200 hover:border-purple-400 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              {/* Rule Header */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                  RULE {index + 1}
                                </span>
                                <span className="text-gray-400">=</span>
                              </div>

                              {/* WHEN */}
                              <div className="mb-3">
                                <p className="text-xs font-bold text-gray-500 mb-1">WHEN</p>
                                <p className="text-sm text-gray-900">
                                  <span className="font-bold">"{triggerField.label}"</span> equals <span className="font-bold text-purple-600">"{rule.value}"</span>
                                </p>
                              </div>

                              {/* THEN */}
                              <div className="mb-3">
                                <p className="text-xs font-bold text-gray-500 mb-1">THEN</p>
                                <div className="text-sm text-gray-900">
                                  {rule.action === 'show' && (
                                    <div>
                                      <span className="font-semibold">👁️ Show field:</span>
                                      <ul className="ml-6 mt-1 space-y-0.5">
                                        {targetFields.map((field, i) => (
                                          <li key={i}>
                                            • <span className="font-bold">"{field.label}"</span> <span className="text-gray-500">({field.type})</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {rule.action === 'hide' && (
                                    <div>
                                      <span className="font-semibold">🙈 Hide field:</span>
                                      <ul className="ml-6 mt-1 space-y-0.5">
                                        {targetFields.map((field, i) => (
                                          <li key={i}>
                                            • <span className="font-bold">"{field.label}"</span> <span className="text-gray-500">({field.type})</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {rule.action === 'changeOptions' && targetFields[0] && (
                                    <div>
                                      <span className="font-semibold">🔄 Change options</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* PREVIEW */}
                              <div className="bg-green-50 rounded p-2 border border-green-200">
                                <p className="text-xs font-bold text-green-800 mb-0.5">📊 PREVIEW:</p>
                                <p className="text-xs text-green-700">
                                  User selects "a" in A → B appears
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setTempRule(rule)
                                  setEditingRule(rule.id)
                                  setShowLogicModal(true)
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-300 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Delete this logic rule?')) {
                                    setConditionalRules(conditionalRules.filter(r => r.id !== rule.id))
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-300 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right 4/12 - Generated Prompt */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-primary via-blue-900 to-purple-900 rounded-2xl p-6 text-white sticky top-8">
              <h2 className="text-2xl font-bold mb-2">Your Prompt</h2>
              <p className="text-blue-100">
                {!currentPrompt
                  ? 'Fill in details and select features'
                  : 'Ready to copy and use'
                }
              </p>
            </div>

            {!currentPrompt ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No prompt yet
                </h3>
                <p className="text-gray-600">
                  Add project title, description, and select features to generate your custom prompt
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-blue-900 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">
                      📋 Custom Prompt
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy Prompt
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <textarea
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    className="w-full h-[600px] px-4 py-3 border-2 border-gray-300 rounded-xl font-mono text-sm focus:outline-none focus:border-primary resize-vertical"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    ✏️ You can edit this prompt before copying
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logic Rule Modal */}
        {showLogicModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowLogicModal(false)}>
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-white font-bold text-2xl">
                  {editingRule ? '✏️ Edit Logic Rule' : '➕ Create Logic Rule'}
                </h3>
                <button
                  onClick={() => setShowLogicModal(false)}
                  className="text-white hover:text-gray-200 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Trigger Field */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    1️⃣ WHEN this field...
                  </label>
                  <select
                    value={tempRule.triggerField}
                    onChange={(e) => {
                      setTempRule({ ...tempRule, triggerField: e.target.value, value: '' })
                    }}
                    className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select a field...</option>
                    {formFields.filter(f => f.type === 'dropdown' || f.type === 'radio').map(f => (
                      <option key={f.id} value={f.id}>{f.label || 'Unnamed Field'} ({f.type})</option>
                    ))}
                  </select>
                </div>

                {/* Condition & Value */}
                {tempRule.triggerField && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        2️⃣ ...has this condition...
                      </label>
                      <select
                        value={tempRule.condition}
                        onChange={(e) => setTempRule({ ...tempRule, condition: e.target.value })}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="equals">Equals (=)</option>
                        <option value="notEquals">Not Equals (≠)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        3️⃣ ...with this value...
                      </label>
                      {(() => {
                        const triggerField = formFields.find(f => f.id === tempRule.triggerField)
                        const hasOptions = triggerField && (triggerField.type === 'dropdown' || triggerField.type === 'radio') && triggerField.options && triggerField.options.length > 0

                        if (hasOptions) {
                          return (
                            <select
                              value={tempRule.value}
                              onChange={(e) => setTempRule({ ...tempRule, value: e.target.value })}
                              className="w-full px-4 py-3 text-base border-2 border-green-400 bg-green-50 rounded-lg focus:outline-none focus:border-green-600"
                            >
                              <option value="">Select a value...</option>
                              {triggerField.options.filter(opt => opt.trim()).map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                              ))}
                            </select>
                          )
                        } else {
                          return (
                            <input
                              type="text"
                              value={tempRule.value}
                              onChange={(e) => setTempRule({ ...tempRule, value: e.target.value })}
                              placeholder="Enter value..."
                              className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                            />
                          )
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Action */}
                {tempRule.value && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      4️⃣ THEN do this action...
                    </label>
                    <select
                      value={tempRule.action}
                      onChange={(e) => setTempRule({ ...tempRule, action: e.target.value })}
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                    >
                      <option value="show">👁️ Show a field</option>
                      <option value="hide">🙈 Hide a field</option>
                      <option value="changeOptions">🔄 Change dropdown options</option>
                    </select>
                  </div>
                )}

                {/* Target Field(s) */}
                {tempRule.action && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                      5️⃣ ...to {tempRule.action === 'changeOptions' ? 'this field' : 'these fields'} {tempRule.action !== 'changeOptions' && <span className="text-purple-600">(select multiple)</span>}
                    </label>

                    {/* For show/hide: Multiple selection with checkboxes */}
                    {(tempRule.action === 'show' || tempRule.action === 'hide') && (
                      <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-300 rounded-lg p-4">
                        {formFields.filter(f => f.id !== tempRule.triggerField).length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">No other fields available</p>
                        ) : (
                          formFields.filter(f => f.id !== tempRule.triggerField).map(f => (
                            <label
                              key={f.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                tempRule.targetFields?.includes(f.id)
                                  ? 'bg-purple-50 border-purple-500'
                                  : 'bg-white border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={tempRule.targetFields?.includes(f.id) || false}
                                onChange={(e) => {
                                  const currentFields = tempRule.targetFields || []
                                  if (e.target.checked) {
                                    setTempRule({ ...tempRule, targetFields: [...currentFields, f.id] })
                                  } else {
                                    setTempRule({ ...tempRule, targetFields: currentFields.filter(id => id !== f.id) })
                                  }
                                }}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                              <div className="flex-1">
                                <span className="font-semibold text-gray-800">{f.label || 'Unnamed Field'}</span>
                                <span className="text-sm text-gray-500 ml-2">({f.type})</span>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    )}

                    {/* For changeOptions: Single selection dropdown */}
                    {tempRule.action === 'changeOptions' && (
                      <select
                        value={tempRule.targetField}
                        onChange={(e) => setTempRule({ ...tempRule, targetField: e.target.value })}
                        className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select target field...</option>
                        {formFields.filter(f => f.id !== tempRule.triggerField && (f.type === 'dropdown' || f.type === 'radio')).map(f => (
                          <option key={f.id} value={f.id}>{f.label || 'Unnamed Field'} ({f.type})</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Conditional Options (if action is changeOptions) */}
                {tempRule.action === 'changeOptions' && tempRule.targetField && (
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      6️⃣ New options (one per line):
                    </label>
                    <textarea
                      value={tempRule.conditionalOptions?.join('\n') || ''}
                      onChange={(e) => {
                        setTempRule({ ...tempRule, conditionalOptions: e.target.value.split('\n') })
                      }}
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 h-32 resize-none font-mono"
                    />
                    <p className="text-sm text-gray-600 mt-2">Press Enter to add a new line</p>
                  </div>
                )}

                {/* Preview */}
                {tempRule.triggerField && tempRule.value && (
                  (tempRule.action === 'changeOptions' && tempRule.targetField) ||
                  ((tempRule.action === 'show' || tempRule.action === 'hide') && tempRule.targetFields && tempRule.targetFields.length > 0)
                ) && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-400">
                    <p className="text-sm font-bold text-green-900 mb-2">✅ PREVIEW:</p>
                    <p className="text-base text-gray-800">
                      When user selects "<span className="font-bold text-purple-600">{tempRule.value}</span>" in{' '}
                      <span className="font-bold">{formFields.find(f => f.id === tempRule.triggerField)?.label}</span>,{' '}
                      then{' '}

                      {/* For changeOptions: single field */}
                      {tempRule.action === 'changeOptions' && (
                        <>
                          change options of{' '}
                          <span className="font-bold">{formFields.find(f => f.id === tempRule.targetField)?.label}</span>
                          {tempRule.conditionalOptions && (
                            <span className="block mt-2 text-sm text-gray-600">
                              New options: {tempRule.conditionalOptions.filter(o => o.trim()).join(', ')}
                            </span>
                          )}
                        </>
                      )}

                      {/* For show/hide: multiple fields */}
                      {(tempRule.action === 'show' || tempRule.action === 'hide') && tempRule.targetFields && (
                        <>
                          <span className="font-bold">{tempRule.action}</span>:
                          <ul className="list-disc ml-6 mt-2">
                            {tempRule.targetFields.map(fieldId => {
                              const field = formFields.find(f => f.id === fieldId)
                              return field ? (
                                <li key={fieldId} className="font-semibold">
                                  {field.label} <span className="text-gray-600 font-normal">({field.type})</span>
                                </li>
                              ) : null
                            })}
                          </ul>
                        </>
                      )}
                    </p>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      // Validation
                      const hasTargets = tempRule.action === 'changeOptions'
                        ? tempRule.targetField
                        : (tempRule.targetFields && tempRule.targetFields.length > 0)

                      if (!tempRule.triggerField || !tempRule.value || !hasTargets) {
                        alert('Please fill in all required fields')
                        return
                      }

                      if (editingRule) {
                        // Update existing rule
                        setConditionalRules(conditionalRules.map(r =>
                          r.id === editingRule ? { ...tempRule, id: editingRule } : r
                        ))
                      } else {
                        // Add new rule
                        setConditionalRules([...conditionalRules, { ...tempRule, id: Date.now().toString() }])
                      }

                      setShowLogicModal(false)
                      setEditingRule(null)
                    }}
                    disabled={
                      !tempRule.triggerField ||
                      !tempRule.value ||
                      (tempRule.action === 'changeOptions' ? !tempRule.targetField : (!tempRule.targetFields || tempRule.targetFields.length === 0))
                    }
                    className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingRule ? '💾 Save Changes' : '✨ Create Rule'}
                  </button>
                  <button
                    onClick={() => {
                      setShowLogicModal(false)
                      setEditingRule(null)
                    }}
                    className="px-6 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Setup Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowGuide(null)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-gradient-to-r from-primary to-blue-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl">
                  Setup Guide
                </h3>
                <button
                  onClick={() => setShowGuide(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {showGuide === 'auth' && services.auth.map(service => (
                  <div key={service.id} className={`p-4 rounded-xl border-2 ${authService === service.id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="bg-white rounded-lg p-4 mb-3">
                      <p className="font-semibold text-gray-800 mb-2">What is it?</p>
                      <p className="text-sm text-gray-700">{service.whatIs}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Setup Steps:</p>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {service.setup.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}

                {showGuide === 'database' && services.database.map(service => (
                  <div key={service.id} className={`p-4 rounded-xl border-2 ${databaseService === service.id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="bg-white rounded-lg p-4 mb-3">
                      <p className="font-semibold text-gray-800 mb-2">What is it?</p>
                      <p className="text-sm text-gray-700">{service.whatIs}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Setup Steps:</p>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {service.setup.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}

                {showGuide === 'payments' && services.payments.map(service => (
                  <div key={service.id} className={`p-4 rounded-xl border-2 ${paymentService === service.id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="bg-white rounded-lg p-4 mb-3">
                      <p className="font-semibold text-gray-800 mb-2">What is it?</p>
                      <p className="text-sm text-gray-700">{service.whatIs}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Setup Steps:</p>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {service.setup.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}

                {showGuide === 'email' && services.email.map(service => (
                  <div key={service.id} className={`p-4 rounded-xl border-2 ${emailService === service.id ? 'border-primary bg-blue-50' : 'border-gray-200'}`}>
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                    <div className="bg-white rounded-lg p-4 mb-3">
                      <p className="font-semibold text-gray-800 mb-2">What is it?</p>
                      <p className="text-sm text-gray-700">{service.whatIs}</p>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Setup Steps:</p>
                      <ol className="text-sm text-gray-700 space-y-1">
                        {service.setup.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Form Flow Chart Modal */}
        {showFormMapModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-3xl">🗺️</span>
                  <div>
                    <h2 className="text-2xl font-bold">Form Structure</h2>
                    <p className="text-sm opacity-90">Complete overview of your form with all conditional logic</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFormMapModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Structure Preview Content */}
              <div className="flex-1 overflow-auto p-8 bg-gray-50">
                <div className="bg-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📋</span> Form Structure Preview
                  </h3>

                  {formFields.length > 0 ? (
                    <div className="font-mono text-sm space-y-1">
                      {formFields.map((field, idx) => {
                        const isLast = idx === formFields.length - 1
                        const connector = isLast ? '└──' : '├──'

                        // Check if this field has conditional rules
                        const showRules = conditionalRules.filter(r =>
                          r.action === 'show' && r.targetFields?.includes(field.id)
                        )
                        const isConditional = showRules.length > 0

                        // Find what triggers this field
                        const triggers = showRules.map(rule => {
                          const triggerField = formFields.find(f => f.id === rule.triggerField)
                          return { field: triggerField?.label, value: rule.value }
                        })

                        return (
                          <div key={field.id}>
                            <div className="flex items-start gap-2">
                              <span className="text-gray-400">{connector}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${isConditional ? 'text-blue-700' : 'text-green-700'}`}>
                                    {field.label || 'Unnamed'}
                                  </span>
                                  <span className="text-xs text-gray-500">({field.type})</span>
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                    {field.width === '33' ? '1/3' : field.width === '50' ? '1/2' : 'full'}
                                  </span>
                                  {isConditional ? (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                      conditional
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                      always visible
                                    </span>
                                  )}
                                </div>

                                {/* Show what triggers this field */}
                                {triggers.length > 0 && (
                                  <div className="ml-4 mt-1 text-xs text-gray-600">
                                    {triggers.map((trigger, tIdx) => (
                                      <div key={tIdx} className="flex items-center gap-1">
                                        <span className="text-gray-400">↳</span>
                                        <span>Shows when: <span className="font-semibold">{trigger.field}</span> = "{trigger.value}"</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Show what this field triggers */}
                                {(() => {
                                  const triggeredRules = conditionalRules.filter(r =>
                                    r.action === 'show' && r.triggerField === field.id && r.targetFields
                                  )

                                  if (triggeredRules.length === 0) return null

                                  return (
                                    <div className="ml-4 mt-2 space-y-1">
                                      {triggeredRules.map((rule, rIdx) => {
                                        const targets = (rule.targetFields || [])
                                          .map(id => formFields.find(f => f.id === id))
                                          .filter(Boolean)

                                        return (
                                          <div key={rIdx} className="text-xs">
                                            <div className="flex items-center gap-1 text-purple-700">
                                              <span className="text-gray-400">│</span>
                                              <span className="font-semibold">When = "{rule.value}"</span>
                                              <span>→ shows:</span>
                                            </div>
                                            <div className="ml-4 space-y-0.5">
                                              {targets.map((target, tIdx) => (
                                                <div key={tIdx} className="flex items-center gap-1 text-blue-700">
                                                  <span className="text-gray-400">│   └──</span>
                                                  <span className="font-semibold">{target.label}</span>
                                                  <span className="text-gray-500">({target.type})</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )
                                })()}
                              </div>
                            </div>
                            {!isLast && <div className="text-gray-400 ml-0">│</div>}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No fields to display yet
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{formFields.length}</span> fields •
                  <span className="font-semibold ml-1">{conditionalRules.length}</span> conditional rules
                </div>
                <button
                  onClick={() => setShowFormMapModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PromptBuilder
