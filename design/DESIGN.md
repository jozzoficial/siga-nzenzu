---
name: Academic Core System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f493f'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7a6e'
  outline-variant: '#becabc'
  surface-tint: '#006d30'
  primary: '#00652c'
  on-primary: '#ffffff'
  primary-container: '#15803d'
  on-primary-container: '#d3ffd5'
  inverse-primary: '#79db8d'
  secondary: '#486554'
  on-secondary: '#ffffff'
  secondary-container: '#caead6'
  on-secondary-container: '#4e6b5a'
  tertiary: '#505768'
  on-tertiary: '#ffffff'
  tertiary-container: '#686f81'
  on-tertiary-container: '#f1f3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#95f8a7'
  primary-fixed-dim: '#79db8d'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#005323'
  secondary-fixed: '#caead6'
  secondary-fixed-dim: '#afceba'
  on-secondary-fixed: '#042014'
  on-secondary-fixed-variant: '#314d3e'
  tertiary-fixed: '#dce2f7'
  tertiary-fixed-dim: '#c0c6db'
  on-tertiary-fixed: '#141b2b'
  on-tertiary-fixed-variant: '#404758'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2.5rem
---

## Brand & Style
The design system is engineered for an Academic Management System (SIGA) that balances institutional authority with modern accessibility. The brand personality is **Professional, Academic, and Structured**. It aims to evoke a sense of reliability and clarity, essential for students and faculty managing complex administrative tasks.

The visual style is **Corporate / Modern**, characterized by a clean interface that utilizes a structured grid, high-contrast typography for readability, and a purposeful use of the institution's heritage colors. Inspired by the provided logo, the system incorporates the star and book motifs as subtle background patterns or iconography accents to reinforce institutional identity without cluttering the workspace.

## Colors
The palette is rooted in a "Deep Academic Green" to establish trust and officiality.

*   **Primary (#15803d):** Used for high-level navigation (sidebar), primary actions, and brand-critical highlights.
*   **Secondary (#dcfce7):** A soft lime green used for "Active" states in navigation, table row highlighting, and success notifications.
*   **Tertiary/Text (#111827):** A deep charcoal black used for headlines and primary body text to ensure maximum legibility and echo the line-work of the institutional logo.
*   **Background (#f9fafb):** A very light gray used for the application stage to reduce eye strain, contrasting with pure white (#ffffff) used exclusively for content cards.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-dense environments. 

The hierarchy is strictly maintained to help users scan large volumes of academic information. **Headline-xl** and **Headline-lg** are reserved for page titles and major dashboard sections. **Body-md** is the standard for all content and form labels, while **Label-md** (all-caps) is used for table headers and sidebar categories to provide clear visual separation.

## Layout & Spacing
The system employs a **12-column fluid grid** for the main content area, allowing for flexible dashboard layouts.

*   **Desktop:** Features a fixed 280px left-hand sidebar in Primary Green. The main content stage uses a 40px (xl) margin with 24px (gutter) between cards.
*   **Tablet:** The sidebar collapses into an icon-only rail or a hamburger menu. Margins reduce to 24px (md).
*   **Mobile:** A single-column flow with 16px (sm) horizontal margins. 

Spacing follows a strict 4px baseline grid to ensure vertical rhythm across forms and data tables.

## Elevation & Depth
To maintain a clean and professional aesthetic, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

*   **Level 0 (Background):** Surface color #f9fafb. No shadow.
*   **Level 1 (Cards/Content):** Pure white surface with a "shadow-sm" (0px 1px 2px 0px rgba(0, 0, 0, 0.05)). This is the primary container for all academic data.
*   **Level 2 (Dropdowns/Modals):** Pure white surface with a "shadow-md" (0px 4px 6px -1px rgba(0, 0, 0, 0.1)) to provide clear separation from the content layer.
*   **Outlines:** Inputs and inactive buttons use a 1px solid border (#e5e7eb) instead of shadows to keep the UI crisp.

## Shapes
The shape language is defined by **Rounded-LG (0.5rem)** corners. This radius is applied to cards, input fields, and buttons to soften the professional tone without appearing overly casual. 

Interactive elements like "Status Chips" or "Avatar" frames may utilize a full-pill shape (3) to distinguish them from structural layout elements.

## Components
*   **Buttons:** 
    *   *Primary:* Solid #15803d with white text. 
    *   *Secondary:* Solid #dcfce7 with #15803d text.
    *   *Iconography:* Use the "Star" from the logo for "Featured" or "Important" actions.
*   **Sidebar:** Deep #15803d background. Active items use #dcfce7 with a left-accent border of 4px in white or a darker green shade.
*   **Input Fields:** White background, 1px #e5e7eb border, 0.5rem rounding. On focus, the border transitions to #15803d with a subtle green outer glow.
*   **Cards:** The fundamental unit. White background, rounded-lg, shadow-sm. Headlines within cards should use Headline-md.
*   **Data Tables:** Clean, no vertical borders. Header row uses Label-md with #f9fafb background. Use secondary green for row hover states.
*   **Academic Icons:** Use a custom set of "Open Book" icons for curriculum-related navigation and "Star" icons for grades or top-priority notifications.