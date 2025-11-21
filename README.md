# Sewer Line Repair Directory - Frontend

A modern directory website built with Nuxt 4, Vue 3, and Tailwind CSS for finding sewer line repair and plumbing companies across the United States.

## 🚀 Tech Stack

- **Framework**: Nuxt 4.2.0 (Vue 3.5+)
- **Styling**: Tailwind CSS v3
- **State Management**: Pinia
- **Type Safety**: TypeScript
- **Package Manager**: PNPM
- **UI Components**: Custom components with Lucide icons

## 📋 Prerequisites

- Node.js 18+ 
- PNPM 8+ (Install: `npm install -g pnpm`)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd sewer-line-repair-frontend

# Install dependencies
pnpm install
```

## 🏃 Development

```bash
# Start development server
pnpm dev
```

Visit: http://localhost:3001

## 📦 Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Generate static site
pnpm generate
```

## 🧪 Quality Checks

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 📁 Project Structure

```
sewer-line-repair-frontend/
├── app/
│   ├── assets/          # CSS, fonts, images
│   ├── components/      # Vue components
│   │   ├── Base/        # Reusable UI components
│   │   ├── Page/        # Page-specific components
│   ├── composables/     # Composable functions
│   ├── layouts/         # Layout components
│   ├── pages/           # File-based routing
│   │   ├── [country]/   # Dynamic country routes
│   │   │   └── [state]/ # Dynamic state routes
│   ├── plugins/         # Vue/Nuxt plugins
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── docs/                # Documentation
├── public/              # Static assets
├── server/              # Server API routes
└── shared/              # Shared type definitions
```

## 🌐 Routes

- `/` - Homepage with search
- `/browse-all-states` - Browse all US states
- `/directory` - Main directory
- `/[country]/[state]` - State-specific companies
- `/[country]/[state]/[city]` - City-specific companies
- `/[country]/[state]/[city]/[provider]` - Provider detail page

## 🔌 API Integration

The application integrates with a REST API for:
- States listing and search
- Location autocomplete
- Companies by state/city
- Provider details

See `docs/` folder for detailed API documentation.

## 🎨 Features

- ✅ Server-side rendering (SSR)
- ✅ File-based routing
- ✅ Location autocomplete search
- ✅ State-by-state browsing
- ✅ City filtering
- ✅ Pagination
- ✅ Responsive design
- ✅ Type-safe development
- ✅ SEO optimized

## 📚 Documentation

- [API Integration Guide](./docs/API_INTEGRATION.md)
- [Browse All States Implementation](./docs/BROWSE_ALL_STATES_API.md)
- [City Companies Listing](./docs/CITY_COMPANIES_LISTING.md)
- [Location Autocomplete](./docs/LOCATION_AUTOCOMPLETE_API.md)
- [Search State Component](./docs/SEARCH_STATE_COMPONENT.md)
- [PNPM Migration Guide](./PNPM_MIGRATION.md)

## 🔧 Configuration

### Port Configuration
The dev server runs on port 3001 (configured in `package.json`):
```json
"scripts": {
  "dev": "nuxt dev --port 3001"
}
```

### API Base URL
Configure in `app/plugins/api.ts` or use environment variables.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run type checking and linting
4. Submit a pull request

## 📝 Notes

- This project uses PNPM as the package manager. See [PNPM_MIGRATION.md](./PNPM_MIGRATION.md) for details.
- Always use `pnpm` commands instead of `npm` or `yarn`
- The project follows Nuxt 4 conventions with the `app/` directory structure

## 📄 License

[Your License]

## 👥 Team

[Your Team Information]

---

Built with ❤️ using Nuxt 4

