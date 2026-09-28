# Project Tree

```
├── .claude
│   └── settings.local.json
├── .env
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── backend
│   ├── .env
│   ├── .env.example
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── src
│   │   ├── config
│   │   │   ├── db.ts
│   │   │   └── index.ts
│   │   ├── constants
│   │   │   └── categories.ts
│   │   ├── controllers
│   │   │   ├── auth.controller.ts
│   │   │   └── destination.controller.ts
│   │   ├── index.ts
│   │   ├── middleware
│   │   │   └── auth.ts
│   │   ├── models
│   │   │   ├── Destination.ts
│   │   │   └── User.ts
│   │   ├── routes
│   │   │   ├── auth.ts
│   │   │   ├── destinations.ts
│   │   │   ├── health.ts
│   │   │   └── protected.ts
│   │   ├── types
│   │   │   ├── cors.d.ts
│   │   │   ├── express.d.ts
│   │   │   └── jsonwebtoken.d.ts
│   │   └── utils
│   │       └── zod.schema.ts
│   └── tsconfig.json
├── frontend
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml
│   ├── public
│   │   ├── favicon.png
│   │   ├── favicon.svg
│   │   └── logo.png
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── app
│   │   │   ├── (auth)
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup
│   │   │   │       └── page.tsx
│   │   │   └── destination
│   │   │       └── Destination.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── AppNavbar.tsx
│   │   │   ├── SeoHelmet.tsx
│   │   │   ├── app
│   │   │   │   └── (destinations)
│   │   │   ├── auth
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── destinations
│   │   │   │   └── DestinationCard.tsx
│   │   │   ├── map
│   │   │   │   ├── AddDestinationPopup.tsx
│   │   │   │   ├── DestinationMarker.tsx
│   │   │   │   ├── Map.tsx
│   │   │   │   └── markerIcons.ts
│   │   │   ├── search
│   │   │   │   └── SearchResultsPanel.tsx
│   │   │   ├── searchbar
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── sidebar
│   │   │   │   ├── AppSidebar.tsx
│   │   │   │   ├── AppSidebarContent.tsx
│   │   │   │   └── AppSidebarFooter.tsx
│   │   │   ├── stats
│   │   │   │   └── StatsPage.tsx
│   │   │   └── ui
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── textarea.tsx
│   │   │       └── tooltip.tsx
│   │   ├── context
│   │   │   └── AuthContext.tsx
│   │   ├── declarations.d.ts
│   │   ├── hooks
│   │   │   ├── use-mobile.ts
│   │   │   ├── useDestinations.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── index.css
│   │   ├── lib
│   │   │   ├── shadcn.css
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── types
│   │   │   ├── categories.ts
│   │   │   └── destination.ts
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── package.json
├── pnpm-lock.yaml
└── screenshots
    ├── AllDestinations.png
    ├── Map.png
    └── Stats.png
```