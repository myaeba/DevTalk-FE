# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run serve` (runs on port 3000)
- **Build for production**: `npm run build`
- **Lint and fix files**: `npm run lint`
- **Install dependencies**: `npm install`

## Project Architecture

This is a Vue.js 3 frontend application for DevTalk, a developer communication platform.

### Tech Stack
- **Framework**: Vue.js 3 with Options API (not Composition API)
- **UI Library**: Vuetify 3.9.6 (Material Design components)
- **Routing**: Vue Router 4.5.1 with hash-based history
- **HTTP Client**: Axios 1.11.0
- **Real-time Communication**: WebSockets via webstomp-client and sockjs-client
- **Authentication**: JWT tokens (jwt-decode library)

### Application Structure

**Entry Point**: `src/main.js` - Sets up Vue app with Vuetify, router, and mounts to DOM

**Routing**: `src/router/index.js` - Configured routes:
- `/` → Home.vue (homepage feed, requires auth)
- `/login` → LoginPage.vue (public)
- `/signup` → SignUp.vue (public) 
- `/my/chat` → ChatList.vue (chat list, requires auth)
- Uses `createWebHashHistory()` for hash-based routing

**Authentication System**: 
- Router guards automatically redirect unauthenticated users to `/login`
- All routes require authentication except `/login` and `/signup` (marked with `meta: { requiresAuth: false }`)
- JWT tokens stored in localStorage with keys: `token`, `role`, `email`

**Component Structure**:
- **Views**: Page-level components in `src/views/`
- **Reusable Components**: 
  - `src/components/chat/ChatListItem.vue` - Individual chat item
  - `src/components/common/BottomNavigation.vue` - App bottom navigation

**UI Framework**: `src/plugins/vuetify.js` - Vuetify configuration with all components imported

### Key Implementation Details

**API Integration**: 
- Base URL configured via environment variable `VUE_APP_API_BASE_URL` (defaults to http://localhost:8080)
- Login endpoint: `/member/login` 
- Registration endpoint: `/member/register`

**Component Architecture**: Uses Vue 3 Options API pattern consistently across all components. Components follow this structure:
```javascript
export default {
  name: 'ComponentName', // Multi-word names required by ESLint
  components: { ... },
  data() { return { ... } },
  methods: { ... }
}
```

**Authentication Flow**: 
- LoginPage.vue handles login with JWT token storage
- SignUp.vue handles registration with form validation
- Router guards check token presence and redirect accordingly

**Development Notes**:
- Port 3000 is configured in package.json scripts
- ESLint configured with Vue 3 essential rules requiring multi-word component names
- Babel transpilation configured for modern browser support
- No TypeScript - uses standard JavaScript
- Environment variables must be prefixed with `VUE_APP_` to be accessible in browser