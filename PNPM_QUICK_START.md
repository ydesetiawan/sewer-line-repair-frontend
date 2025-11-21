# 🚀 Quick Start Guide - PNPM Commands

## ⚡ Most Used Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start dev server (http://localhost:3001) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |

## 📦 Dependency Management

| Command | Description |
|---------|-------------|
| `pnpm add <package>` | Add a dependency |
| `pnpm add -D <package>` | Add a dev dependency |
| `pnpm remove <package>` | Remove a dependency |
| `pnpm update` | Update dependencies |
| `pnpm update --latest` | Update to latest versions |

## 🔍 Information Commands

| Command | Description |
|---------|-------------|
| `pnpm list` | List installed packages |
| `pnpm outdated` | Check for outdated packages |
| `pnpm why <package>` | Show why package is installed |

## 🧹 Cleanup Commands

| Command | Description |
|---------|-------------|
| `pnpm store prune` | Remove unused packages from store |
| `pnpm install --force` | Force reinstall all packages |

## 🚨 Important Notes

1. **Always use `pnpm`** - Never use `npm` or `yarn` in this project
2. **Commit `pnpm-lock.yaml`** - This file should be in version control
3. **Install PNPM globally**: `npm install -g pnpm`

## 🆘 Troubleshooting

### Clean Install
```bash
rm -rf node_modules .nuxt .output
pnpm install
```

### Cache Issues
```bash
pnpm store prune
pnpm install --force
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
pnpm dev
```

## 📚 More Help

- PNPM Docs: https://pnpm.io/
- Full Migration Guide: See `PNPM_MIGRATION.md`
- Project README: See `README.md`

