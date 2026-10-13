# Pavan Kalyan Ram Vanama — Personal Portfolio

An ultra-modern, high-performance personal portfolio website built for **Pavan Kalyan Ram Vanama**, Machine Learning Engineer specializing in Generative AI, Agentic AI, and Machine Learning.

![Portfolio Preview](/me.png)

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with neon dark glassmorphism design system
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth springs, scroll triggers, 3D tilt cards)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Contact Form**: [Formspree](https://formspree.io/) with honeypot bot protection
- **Hosting & Edge Delivery**: [Vercel](https://vercel.com/) with optimized HTTP caching headers

---

## ✨ Features

- **Hero Section**:
  - Full-screen H.264 video (`hero.mp4`) with portrait-adaptive right-side positioning and soft edge blend.
  - Picture element fallback (`me.webp` / `me.png`) with smooth cursor-following parallax tracking when video is inactive.
  - Interactive 3D neon particle cloud masked to keep face and body bright and clear.
  - Dynamic character-by-character typewriter effect: `Generative AI | Agentic AI | ML`.
  - Direct resume download (`/resume.pdf`).
- **About**: Glassmorphic bio showcasing academic credentials at Annamacharya University (B.Tech CSE, 9.28 CGPA) and key metrics.
- **Skills**: Categorized neon tech badges for Languages, ML/AI Frameworks (LLaMA 3.3-70b, LangChain, PyTorch, Scikit-learn), Web Development, and Core CS Subjects.
- **Featured Projects**:
  - **Autonomous Code Review & Bug Fix Agent**: [GitHub](https://github.com/Vpkram/autonomous-code-review-bug-detector)
  - **Spam Mail Prediction**: [GitHub](https://github.com/Vpkram/Spam-Mail-Prediction)
  - **Credit Card Fraud Detection**: [GitHub](https://github.com/Vpkram/Credit-Card-Fraud-Detection)
- **Experience**: Timeline card for BrainOvision Gen AI & Agentic AI Internship (May 2026 – Jul 2026, Remote).
- **Education**: Detailed academic history with verified CGPA and percentages.
- **Certifications**: Verified certificates with local PDF viewers for SkillForge Web Development and HackerRank SQL Intermediate.
- **Volunteering**: Social contribution timeline for *We Are With You Charitable Trust*.
- **Contact**: Glassmorphic interactive contact form linked to Formspree (`https://formspree.io/f/xppqjvqn`) with instant validation and clipboard email copy.
- **Performance & SEO**: Fully responsive down to 375px mobile screens, Open Graph tags, Twitter Card metadata, and custom SVG monogram favicon.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or newer recommended)
- `npm` or `pnpm`

### Installation

```bash
# Clone the repository
git clone https://github.com/Vpkram/portfolio-website.git

# Navigate into the project directory
cd portfolio-website

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🚢 Deployment on Vercel

1. Push this repository to GitHub under `Vpkram/portfolio-website`.
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** > **"Project"**.
4. Select `portfolio-website` from your GitHub repositories.
5. Keep default build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Vercel will automatically deploy the site and provide a live `*.vercel.app` URL with continuous deployment on every git push.

---

## 📄 License

This project is licensed under the MIT License.
