# 🚀 Innovision 3.0

> A cutting-edge, interactive event website showcasing the future of tech events with immersive animations and modern design.

![Innovision 3.0](https://img.shields.io/badge/Innovision-3.0-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.6-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Overview

Innovision 3.0 is a premium event website built for K.V. Pendharkar College's IT Department. It features a futuristic design with smooth animations, interactive elements, and a responsive layout that works seamlessly across all devices.

## 🎯 Key Features

### 🎨 **Modern UI/UX**
- **Futuristic Design**: Cyber-themed interface with neon accents
- **Custom Cursor**: Interactive cursor that responds to elements
- **Smooth Preloader**: Elegant loading animation with progress tracking
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices

### 🎬 **Advanced Animations**
- **GSAP Powered**: Professional-grade animations with ScrollTrigger
- **Smooth Scrolling**: Buttery smooth scroll experience with Lenis
- **Card Animations**: Event cards slide in from alternating sides
- **Hover Effects**: Interactive hover states with smooth transitions

### 🎮 **Interactive Components**
- **Hero Section**: Dynamic 3D background with animated text
- **Event Cards**: Gaming-inspired cards with detailed event information
- **Navigation**: Smooth mobile menu with portal-based overlay
- **Registration Modal**: Integrated event registration system

### 🛠️ **Technical Excellence**
- **React 19**: Latest React features for optimal performance
- **Vite**: Lightning-fast build tool and development server
- **TypeScript Ready**: Structured for easy TypeScript migration
- **SEO Optimized**: Proper meta tags and semantic HTML

## 🏗️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.2.0 | UI Library |
| **Build Tool** | Vite | 7.2.6 | Development & Build |
| **Styling** | TailwindCSS | 3.4.18 | Utility-first CSS |
| **Animations** | GSAP | Latest | Professional animations |
| **Animations** | Framer Motion | Latest | React-specific animations |
| **3D Graphics** | Three.js | 0.181.2 | 3D elements |
| **3D React** | React Three Fiber | Latest | React Three.js integration |
| **Smooth Scroll** | Lenis | Latest | Smooth scrolling |
| **Icons** | Lucide React | 0.555.0 | Modern icon library |
| **Routing** | React Router | 7.12.0 | Client-side routing |

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Innovision-3.0.git
   cd Innovision-3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 📁 Project Structure

```
Innovision-3.0/
├── public/                 # Static assets
│   ├── images/            # Event images and media
│   └── vite.svg          # Vite logo
├── src/
│   ├── components/        # React components
│   │   ├── About.jsx     # About section
│   │   ├── Contact.jsx   # Contact information
│   │   ├── Events.jsx    # Event showcase
│   │   ├── Footer.jsx    # Site footer
│   │   ├── Hero.jsx      # Hero section
│   │   ├── Navbar.jsx    # Navigation
│   │   ├── Preloader.jsx # Loading animation
│   │   └── mobile.css    # Mobile-specific styles
│   ├── hooks/            # Custom React hooks
│   ├── App.jsx           # Main application
│   ├── main.jsx          # React DOM entry point
│   └── index.css         # Global styles
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎨 Design System

### Color Palette
- **Primary**: `#06b6d4` (Cyber Blue)
- **Secondary**: `#a855f7` (Neon Purple)
- **Background**: `#0a0a0a` (Void Black)
- **Text**: `#ffffff` (White)
- **Accent**: `#1a1a1a` (Dark Gray)

### Typography
- **Primary Font**: Orbitron (Futuristic, tech-themed)
- **Secondary Font**: Inter (Clean, readable)
- **Monospace**: System monospace (Code/technical text)

### Animations
- **Duration**: 300ms - 1000ms
- **Easing**: Custom cubic-bezier curves
- **Triggers**: Scroll-based with 30% viewport threshold

## 🎯 Events Featured

1. **Free Fire Max: Battle Royale** - E-Sports Tournament
2. **Rocket League: Star Drift** - Gaming Competition
3. **Orbital Hackathon** - 24-hour Coding Marathon
4. **Blind Type** - Touch Typing Challenge
5. **Nebula UI/UX** - Design Competition
6. **Cyber-Security CTF** - Capture The Flag
7. **Tech-Quiz Event Horizon** - Technical Quiz
8. **Robo-Sumo: Anti-G** - Robotics Competition

## 📱 Mobile Optimization

- **Responsive Design**: Adapts to all screen sizes
- **Touch Gestures**: Optimized for mobile interaction
- **Performance**: Reduced animations for better mobile performance
- **Navigation**: Mobile-first navigation with smooth transitions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_TITLE=Innovision 3.0
VITE_CONTACT_EMAIL=contact@innovision30.com
VITE_SUPPORT_EMAIL=support@kvp-it.edu.in
```

### Customization
- **Colors**: Modify `tailwind.config.js` for custom color scheme
- **Animations**: Adjust GSAP timelines in component files
- **Content**: Update event data in `Events.jsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**K.V. Pendharkar College - IT Department**
- **Institution**: K.V. Pendharkar College of Arts, Science and Commerce
- **Department**: Information Technology
- **Location**: Dombivli, Maharashtra, India

## 📞 Contact

- **Email**: contact@innovision30.com
- **Support**: support@kvp-it.edu.in
- **Website**: [Innovision 3.0](http://localhost:5173)

## 🙏 Acknowledgments

- **GSAP** for powerful animation capabilities
- **Three.js** for 3D graphics support
- **TailwindCSS** for utility-first styling
- **React Team** for the amazing framework
- **Vite Team** for the blazing-fast build tool

---

<div align="center">
  <p>Made with ❤️ by the IT Department</p>
  <p>© 2026 Innovision 3.0. All rights reserved.</p>
</div>
