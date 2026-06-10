/**
 * Converts ReactQuill HTML output to clean readable text for prompts.
 * Preserves structure: headings, bold, lists, paragraphs — as plain text.
 */
const htmlToText = (html) => {
  if (!html) return ''
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent

      const tag = node.tagName?.toLowerCase()
      const inner = Array.from(node.childNodes).map(processNode).join('')

      switch (tag) {
        case 'h1': return `\n${inner.trim().toUpperCase()}\n`
        case 'h2': return `\n${inner.trim().toUpperCase()}\n`
        case 'h3': return `\n### ${inner.trim()}\n`
        case 'p':  return inner.trim() ? `\n${inner.trim()}\n` : ''
        case 'strong': case 'b': return inner ? `**${inner}**` : ''
        case 'em': case 'i': return inner ? `_${inner}_` : ''
        case 'br': return '\n'
        case 'ul': return `\n${inner}`
        case 'ol': return `\n${inner}`
        case 'li': return `- ${inner.trim()}\n`
        case 'a':  return inner
        case 'span': return inner
        case 'div': return inner.trim() ? `\n${inner.trim()}\n` : ''
        default:   return inner
      }
    }

    return processNode(doc.body).replace(/\n{3,}/g, '\n\n').trim()
  } catch {
    // Fallback: strip tags only
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }
}

const treeText = (pages, prefix = '') => {
  let out = ''
  pages.forEach((page, i) => {
    const isLast = i === pages.length - 1
    out += prefix + (isLast ? '└── ' : '├── ') + page.name + '\n'
    if (page.children?.length > 0)
      out += treeText(page.children, prefix + (isLast ? '    ' : '│   '))
  })
  return out
}

const menuTreeText = (items, prefix = '') => {
  let out = ''
  items.forEach((item, i) => {
    const isLast = i === items.length - 1
    out += prefix + (isLast ? '└── ' : '├── ') + item.name + '\n'
    if (item.children?.length > 0)
      out += menuTreeText(item.children, prefix + (isLast ? '    ' : '│   '))
  })
  return out
}

const flattenPages = (pages, level = 0) => {
  let result = []
  pages.forEach(page => {
    result.push({ ...page, level })
    if (page.children?.length > 0)
      result = result.concat(flattenPages(page.children, level + 1))
  })
  return result
}

// Root-level page names that map to "/" instead of "/home"
const ROOT_NAMES = ['home', 'homepage', 'index', 'landing', 'landing page', 'home page']

const pageSlug = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
const isRootPage = (name) => ROOT_NAMES.includes(name.toLowerCase().trim())

// Build the URL path for a page based on its position in the tree
const getPagePath = (targetId, pages, parentPath = '') => {
  for (const page of pages) {
    const slug = isRootPage(page.name) && parentPath === '' ? '' : pageSlug(page.name)
    const path = parentPath === '' && slug === '' ? '/' : `${parentPath}/${slug}`
    if (page.id === targetId) return path
    if (page.children?.length > 0) {
      const found = getPagePath(targetId, page.children, path === '/' ? '' : path)
      if (found) return found
    }
  }
  return null
}

// Build route path → file path mapping
const routeToFile = (path) => {
  if (path === '/') return 'src/app/page.tsx'
  return `src/app${path}/page.tsx`
}

// Flatten menu items to name→path pairs for header prompt
const menuWithPaths = (items, pages, parentPath = '') => {
  let out = ''
  items.forEach((item, i) => {
    const isLast = i === items.length - 1
    const path = getPagePath(item.id, pages) || `/${pageSlug(item.name)}`
    out += (isLast ? '└── ' : '├── ') + item.name + `  →  ${path}\n`
    if (item.children?.length > 0) {
      const childPrefix = isLast ? '    ' : '│   '
      item.children.forEach((child, ci) => {
        const childIsLast = ci === item.children.length - 1
        const childPath = getPagePath(child.id, pages) || `/${pageSlug(item.name)}/${pageSlug(child.name)}`
        out += childPrefix + (childIsLast ? '└── ' : '├── ') + child.name + `  →  ${childPath}\n`
      })
    }
  })
  return out
}

/**
 * Generates an ordered series of Claude Code prompts from a brief.
 * Each prompt is ONE focused task — no front-loading, no broad asks.
 */
export const generateBuildPrompts = (brief) => {
  const {
    projectName = 'My Project',
    whatBuilding = '',
    whyBuilding = '',
    whoUsing = '',
    successGoals = '',
    siteMap = { pages: [], otherPages: [] },
    styleGuide = {},
    userJourneys = [],
    pageContent = {}
  } = brief

  const sg = styleGuide
  const pages = siteMap.pages || []
  const otherPages = siteMap.otherPages || []
  const allPages = flattenPages(pages)
  const menuItems = sg.header?.menuItems || []

  const phases = []
  let phaseNum = 0
  const nextPhase = () => ++phaseNum

  // ─── PHASE 1: Bootstrap ───────────────────────────────────────────────────────
  // Context only — let Claude recommend the stack, then scaffold it.
  // Deliberately NOT asking it to build anything yet.
  phases.push({
    phase: nextPhase(),
    title: 'Project Bootstrap',
    icon: '🚀',
    prompts: [
      {
        title: 'Project context (read before starting)',
        content: `I'm building a project called "${projectName}". Read this context before we start — don't create anything yet.

**What:** ${whatBuilding || '(not specified)'}
**Who will use it:** ${whoUsing || '(not specified)'}
**Why:** ${whyBuilding || '(not specified)'}
${successGoals ? `**Success goals:** ${successGoals}` : ''}

**We will use this stack:**
- Framework: **Next.js latest** (App Router, TypeScript)
- Styling: **Tailwind CSS** + custom CSS variables for design tokens
- State: React built-in hooks (useState, useContext) — no Redux
- Package manager: npm

Confirm you understand the project and stack. Don't create any files yet.`
      },
      {
        title: 'Scaffold the project',
        content: `Scaffold a new Next.js project for "${projectName}".

Run exactly this command:
\`\`\`
npx create-next-app@latest ${pageSlug(projectName)} --typescript --tailwind --app --src-dir --import-alias "@/*"
\`\`\`

After scaffolding, note the installed Next.js version and use its conventions for all subsequent steps (e.g. if Next.js 15+ is installed, use async params/searchParams in page components; if Tailwind v4 is installed, use @import "tailwindcss" in CSS instead of tailwind.config.js).

Then:
1. \`cd ${pageSlug(projectName)}\`
2. Delete the default placeholder content in \`src/app/page.tsx\` and \`src/app/globals.css\`
3. Create these empty folders:
   \`\`\`
   src/components/   ← reusable UI components
   src/styles/       ← design tokens
   src/utils/        ← helper functions
   src/types/        ← TypeScript types
   public/images/    ← static images
   \`\`\`
4. Leave \`src/app/page.tsx\` rendering only: \`<main>Coming soon</main>\`

Do NOT build any real pages or components yet. Just the empty scaffold.`
      }
    ]
  })

  // ─── PHASE 2: Design tokens ───────────────────────────────────────────────────
  // One file only. Claude Code loves clear file targets.
  phases.push({
    phase: nextPhase(),
    title: 'Design Tokens',
    icon: '🎨',
    prompts: [
      {
        title: 'Create design tokens file',
        content: `Create ONE file: \`src/styles/tokens.css\`

**Theme: ${(sg.theme || 'light').toUpperCase()}**

Add these CSS custom properties exactly:

\`\`\`css
:root {
  /* Brand colors */
  --color-primary:   ${sg.primaryColor || '#102542'};
  --color-secondary: ${sg.secondaryColor || '#f87060'};

  /* Theme: ${sg.theme || 'light'} */
  --color-bg:         ${sg.theme === 'dark' ? '#0f172a' : '#ffffff'};
  --color-surface:    ${sg.theme === 'dark' ? '#1e293b' : '#f9fafb'};
  --color-border:     ${sg.theme === 'dark' ? '#334155' : '#e5e7eb'};
  --color-text:       ${sg.theme === 'dark' ? '#f8fafc' : '#111827'};
  --color-text-muted: ${sg.theme === 'dark' ? '#94a3b8' : '#6b7280'};

  /* Typography */
  --font-family: '${sg.typography || 'Inter'}', sans-serif;

  /* Shape */
  --border-radius: ${sg.borderRadius || '8px'};

  /* Spacing scale — ${sg.spacing || 'comfortable'} */
  --space-xs:  ${sg.spacing === 'compact' ? '2px'  : sg.spacing === 'spacious' ? '6px'  : '4px'};
  --space-sm:  ${sg.spacing === 'compact' ? '4px'  : sg.spacing === 'spacious' ? '12px' : '8px'};
  --space-md:  ${sg.spacing === 'compact' ? '10px' : sg.spacing === 'spacious' ? '20px' : '16px'};
  --space-lg:  ${sg.spacing === 'compact' ? '16px' : sg.spacing === 'spacious' ? '32px' : '24px'};
  --space-xl:  ${sg.spacing === 'compact' ? '24px' : sg.spacing === 'spacious' ? '56px' : '40px'};
  --space-2xl: ${sg.spacing === 'compact' ? '40px' : sg.spacing === 'spacious' ? '96px' : '64px'};

  /* Shadow — ${sg.shadows || 'subtle'} */
  --shadow-sm: 0 1px 3px rgba(0,0,0,${sg.theme === 'dark' ? '0.40' : '0.08'});
  --shadow-md: 0 4px 12px rgba(0,0,0,${sg.theme === 'dark' ? '0.50' : '0.10'});
  --shadow-lg: 0 8px 24px rgba(0,0,0,${sg.theme === 'dark' ? '0.60' : '0.12'});

  /* Transition — ${sg.animations || 'smooth'} */
  --transition: ${sg.animations === 'playful' ? '500ms cubic-bezier(0.34,1.56,0.64,1)' : sg.animations === 'subtle' ? '150ms ease' : sg.animations === 'none' ? '0ms' : '400ms ease-in-out'};
}
\`\`\`

Then update \`src/app/globals.css\` to:
1. Import the ${sg.typography || 'Inter'} font from Google Fonts
2. Import \`tokens.css\`
3. Apply to \`body\`: \`font-family: var(--font-family); background: var(--color-bg); color: var(--color-text);\`
4. Reset default margins/padding
${sg.theme === 'dark' ? `5. The entire app uses a **dark background** — \`var(--color-bg)\` is dark, text is light. Apply this consistently everywhere.` : ''}
Do NOT create any components yet.`
      }
    ]
  })

  // ─── PHASE 3: Layout components ───────────────────────────────────────────────
  if (sg.header || sg.footer) {
    const headerLayout = sg.header?.layout === 'logo-center'
      ? 'Logo centered, navigation links split on both sides'
      : sg.header?.layout === 'off-canvas'
      ? 'Off-canvas: logo left, hamburger icon right — clicking hamburger opens a full-height sidebar panel that slides in from the right'
      : 'Logo on the left, navigation links on the right'

    const headerPrompts = []

    if (sg.header?.enabled !== false) {
      headerPrompts.push({
        title: 'Build the Header component',
        content: `Create ONE component: \`src/components/Header.tsx\` (or \`.jsx\`)

**Layout:** ${headerLayout}

**Navigation menu (name → href path):**
\`\`\`
${menuItems.length > 0 ? menuWithPaths(menuItems, pages) : '(no menu items defined — use the site map pages as nav links)'}
\`\`\`
${sg.header?.notes ? `\n**Design notes from brief:**\n${sg.header.notes}\n` : ''}
**Requirements — do exactly this, nothing more:**
- Use \`var(--color-primary)\`, \`var(--font-family)\`, \`var(--transition)\` from tokens
- Active link: bold + \`var(--color-secondary)\` underline
- Mobile: collapse to hamburger at < 768px${sg.header?.layout === 'off-canvas' ? ' (hamburger is the primary style on all sizes)' : ''}
- Smooth open/close animation for mobile menu using \`var(--transition)\`
- Export as default

Do NOT add it to any page yet. Just create the component file.`
      })
    }

    if (sg.footer?.enabled !== false) {
      headerPrompts.push({
        title: 'Build the Footer component',
        content: `Create ONE component: \`src/components/Footer.tsx\` (or \`.jsx\`)

**Layout:** ${sg.footer?.columns || 2}-column grid
${sg.footer?.copyright !== false ? `**Copyright bar:** "© ${new Date().getFullYear()} ${projectName}. All rights reserved." — pinned at the very bottom` : '**No copyright bar needed**'}

**Requirements — do exactly this, nothing more:**
- ${sg.footer?.columns || 2} equal columns using CSS Grid (\`grid-template-columns: repeat(${sg.footer?.columns || 2}, 1fr)\`)
- Stacks to 1 column on mobile (< 768px)
- Fill columns with appropriate placeholder links that fit the project (About, Navigation, Contact, Legal, etc.)
- Background: \`var(--color-primary)\`, text: white
- Export as default

Do NOT add it to any page yet. Just create the component file.`
      })
    }

    headerPrompts.push({
      title: 'Create the root layout with Header and Footer',
      content: `Update \`src/app/layout.tsx\` (or the root layout file) to wrap all pages with the Header and Footer.

Import and render:
1. \`<Header />\` at the top
2. \`<main>{children}</main>\` in the middle
3. \`<Footer />\` at the bottom

This is the only file to modify. Verify it works by running the dev server — the Header and Footer should appear on the existing blank page.`
    })

    phases.push({
      phase: nextPhase(),
      title: 'Header, Footer & Layout',
      icon: '🧩',
      prompts: headerPrompts
    })
  }

  // ─── PHASE 4: Routing — create all page shells ───────────────────────────────
  if (allPages.length > 0 || otherPages.length > 0) {
    const allRoutes = [
      ...allPages.map(p => {
        const path = getPagePath(p.id, pages) || `/${pageSlug(p.name)}`
        return { name: p.name, path }
      }),
      ...otherPages.map(p => ({
        name: p.name,
        path: `/${pageSlug(p.name)}`
      }))
    ]

    const routeList = allRoutes.map(r =>
      `- \`${routeToFile(r.path)}\`  →  ${r.name} (route: \`${r.path}\`)`
    ).join('\n')

    phases.push({
      phase: nextPhase(),
      title: 'Create All Page Routes',
      icon: '🗺️',
      prompts: [{
        title: 'Scaffold all page files (empty shells)',
        content: `Create a shell page file for every route listed below. Each file should export a minimal component — just a heading with the page name. No real content yet.

**Files to create:**
${routeList}

**Each file should look like this template:**
\`\`\`tsx
export default function PageName() {
  return (
    <section>
      <h1>Page Name</h1>
    </section>
  )
}
\`\`\`

Also create a \`src/app/not-found.tsx\` with a friendly 404 message.

Do NOT add any content or styling yet. Just the shells so every route exists and is navigable.`
      }]
    })
  }

  // ─── PHASE 5: Shared UI components ────────────────────────────────────────────
  // Build reusable components before pages — prevents duplication and ensures
  // each page prompt can say "use the shared <X> component" instead of re-defining it.
  phases.push({
    phase: nextPhase(),
    title: 'Shared UI Components',
    icon: '🧱',
    prompts: [
      {
        title: 'Build shared UI components',
        content: `Create these reusable components in \`src/components/ui/\`. Each is a separate file. These will be used across multiple pages.

**1. \`src/components/ui/Button.tsx\`**
- Props: \`children\`, \`variant\` ("primary" | "secondary" | "outline"), \`size\` ("sm" | "md" | "lg"), \`onClick\`, \`disabled\`, \`type\`, \`className\`
- Primary: \`background: var(--color-primary); color: white\`
- Secondary: \`background: var(--color-secondary); color: white\`
- Outline: transparent background, \`border: 1px solid var(--color-primary); color: var(--color-primary)\`
- All: \`border-radius: var(--border-radius)\`, hover state, disabled state (opacity 0.5), \`transition: var(--transition)\`

**2. \`src/components/ui/Card.tsx\`**
- Props: \`children\`, \`className\`
- \`background: var(--color-surface)\`, \`border: 1px solid var(--color-border)\`, \`border-radius: var(--border-radius)\`, \`box-shadow: var(--shadow-sm)\`
- Hover: \`box-shadow: var(--shadow-md)\`

**3. \`src/components/ui/Section.tsx\`**
- Props: \`children\`, \`className\`, \`id\`
- Full-width section wrapper with \`padding: var(--space-xl) var(--space-lg)\`
- Max-width container inside: \`max-width: 1200px; margin: 0 auto\`

**4. \`src/components/ui/index.ts\`**
- Re-export all components from a single entry point

Create all 4 files. Do NOT add these to any page yet.`
      }
    ]
  })

  // ─── PHASE 6+: Individual pages with real content ─────────────────────────────
  if (allPages.length > 0) {
    const pagePrompts = allPages.map(page => {
      const pc = pageContent[page.id] || {}
      const mainContent = htmlToText(pc.content)
      const hasForms = pc.forms?.length > 0
      const hasJourneys = pc.userJourneys?.length > 0
      const pagePath = getPagePath(page.id, pages) || `/${pageSlug(page.name)}`
      const filePath = routeToFile(pagePath)

      let content = `Build the full **${page.name}** page. The file is \`${filePath}\` — it already exists as a shell, replace its content.\n`

      if (mainContent) {
        content += `\n## Content & sections\n${mainContent}\n`
      }

      if (hasForms) {
        content += `\n## Forms`
        pc.forms.forEach(form => {
          content += `\n\n**Form: ${form.name}**\nFields:\n`
          form.fields.forEach(f => { content += `- ${f.label} (input type: ${f.type})\n` })
          content += `\nAdd: field validation, inline error messages, loading state on submit, success confirmation.`
        })
      }

      if (hasJourneys) {
        content += `\n## User flows this page must support`
        pc.userJourneys.forEach(j => {
          const steps = j.steps.filter(s => s.trim())
          content += `\n\n**${j.name}**\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
        })
      }

      if (!mainContent && !hasForms && !hasJourneys) {
        content += `\nNo specific content was defined in the brief. Build a professional, realistic layout that fits the page name and overall project context.`
      }

      content += `\n\n## Rules for this prompt
- Modify ONLY \`${filePath}\`
- Reuse shared components from \`src/components/ui\` (Button, Card, Section) where appropriate
- Use design tokens: \`var(--color-primary)\`, \`var(--color-secondary)\`, \`var(--font-family)\`, etc.
- Fully responsive (mobile-first)
- Do not touch the Header, Footer, or other pages`

      return { title: page.name, content }
    })

    phases.push({
      phase: nextPhase(),
      title: `Build Pages (${allPages.length})`,
      icon: '📄',
      prompts: pagePrompts
    })
  }

  // ─── Other pages ─────────────────────────────────────────────────────────────
  if (otherPages.length > 0) {
    phases.push({
      phase: nextPhase(),
      title: `Other Pages (${otherPages.length})`,
      icon: '📋',
      prompts: otherPages.map(page => {
        const slug = pageSlug(page.name)
        return {
          title: page.name,
          content: `Build the **${page.name}** page. File: \`src/app/${slug}/page.tsx\` (already exists as a shell).

Generate professional, legally appropriate content for a ${page.name} page. Tailor it to:
- Product name: ${projectName}
- Product description: ${whatBuilding ? whatBuilding.split('\n')[0] : 'web application'}

Format with clear headings and sections. Use the project design tokens. Modify ONLY this file.`
        }
      })
    })
  }

  // ─── User journeys ────────────────────────────────────────────────────────────
  if (userJourneys?.length > 0) {
    userJourneys.forEach((journey, i) => {
      const steps = journey.steps.filter(s => s.trim())
      phases.push({
        phase: nextPhase(),
        title: `User Journey: ${journey.name}`,
        icon: '🔄',
        prompts: [{
          title: `Wire up: ${journey.name}`,
          content: `Implement this user journey in "${projectName}" across the existing pages.

**Journey: ${journey.name}**
${steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

**What to do:**
1. Trace each step through the pages already built
2. Add any missing UI element (button, link, modal, form) needed to move from one step to the next
3. Add feedback at each transition: loading indicator, success message, or error state
4. Make sure the complete flow works on mobile

Only modify what is needed to support this specific journey. Do not refactor other pages.`
        }]
      })
    })
  }

  // ─── Final: Review & polish ───────────────────────────────────────────────────
  phases.push({
    phase: nextPhase(),
    title: 'Review & Polish',
    icon: '✅',
    prompts: [
      {
        title: 'Visual consistency pass',
        content: `Do a visual consistency pass across all pages of "${projectName}".

Check and fix:
- Every page uses \`var(--color-primary)\` (${sg.primaryColor || '#102542'}) and \`var(--color-secondary)\` (${sg.secondaryColor || '#f87060'}) — no hardcoded colour values
- Font is \`var(--font-family)\` (${sg.typography || 'Inter'}) everywhere
- Spacing uses the token variables — no magic pixel values
- Border radius is \`var(--border-radius)\` (${sg.borderRadius || '8px'}) on all cards/inputs/buttons
- All interactive elements have a hover state using \`var(--transition)\`

Output a list of every file you changed and what you fixed.`
      },
      {
        title: 'Responsiveness & accessibility pass',
        content: `Check every page of "${projectName}" for responsiveness and accessibility issues.

**Responsiveness:**
- Test at 375px (mobile), 768px (tablet), 1280px (desktop)
- Fix any horizontal overflow
- Ensure font sizes are readable on mobile (min 14px body text)
- Touch targets are at least 44px tall on mobile

**Accessibility:**
- All images have descriptive \`alt\` text
- All form inputs have \`<label>\` elements
- Interactive elements are keyboard-navigable (Tab / Enter / Escape)
- Headings follow a logical hierarchy (h1 → h2 → h3)

Fix all issues found. Output a summary of what was changed.`
      },
      {
        title: 'Final cleanup',
        content: `Final cleanup before the "${projectName}" project is done.

Remove or fix:
- All \`console.log\` statements
- Unused imports and variables
- Commented-out code blocks
- TODO comments that were not resolved
- Any TypeScript / ESLint errors

Then run the project and confirm every page loads without errors. Output the final file list of everything changed.`
      }
    ]
  })

  return phases
}
