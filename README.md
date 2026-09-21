# VITidy 🧹

> **Cleaner VIT • Greener Tomorrow**  
> Official Room Verification & Cleaning Request Architecture for VIT (Vellore Institute of Technology).

---

## 📁 Project Architecture

```
VITidy/
├── public/
│   └── logo.jpg                  # Official VITidy mascot logo
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthScreen.tsx    # Mobile-first sign-in screen
│   │   │   ├── BrandLogo.tsx     # High-fidelity mascot emblem
│   │   │   └── ComplianceCard.tsx# Institutional security badge
│   │   └── auth-1.tsx            # React Bits Pro / shadcn compatibility layer
│   ├── lib/
│   │   └── utils.ts              # Tailwind clsx + twMerge utility
│   ├── App.tsx                   # Main app container
│   ├── index.css                 # Tailwind CSS directives
│   └── main.tsx                  # React 19 entrypoint
├── .env.local                    # REACTBITS_LICENSE_KEY configuration
├── components.json               # shadcn & React Bits Pro registries
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript project configuration
└── vite.config.ts                # Vite bundler & path alias configuration
```

---

## 🚀 Quick Start (Localhost)

### Option A: 1-Click Launcher (Windows)
Simply double-click **`START_LOCALHOST.bat`** in this folder. It will auto-install dependencies if needed, launch Vite, and immediately open your browser!

### Option B: Terminal / Command Line
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Server**:
   ```bash
   npm run dev
   ```
   Your default browser will automatically open at **http://localhost:5180/**.

### Option C: Instant Browser Edition (No Node.js or Setup Required)
If you or your guides do not have Node.js installed, simply double-click **`VITidy_Preview.html`** to run the complete portal instantly in any browser.

4. **Production Build**:
   ```bash
   npm run build
   ```

5. **Linting**:
   ```bash
   npm run lint
   ```

---

## 🎨 Design System
- **Theme**: Super-Premium White & Black
- **Typography**: Geometric Sans, high legibility, uppercase registration formatting
- **Styling**: Tailwind CSS v4 with custom specular shadows
- **Device View**: Strictly optimized for mobile (`max-w-[420px]`)
