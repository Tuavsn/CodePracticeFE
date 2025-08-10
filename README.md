# CodePracticeFE

A modern, responsive frontend application for an online coding platform built with Next.js 15+ and cutting-edge web technologies.

## 🚀 Features

### Core Features

- **Authentication System**: Complete auth flow with login, register, and password reset
- **OAuth Integration**: Third-party authentication with callback handling
- **Problem Solving Interface**: Interactive Monaco code editor with execution controls
- **Forum & Community**: Blog posts, comments system with nested replies
- **Admin Panel**: Administrative interface for content management
- **User Profiles**: Comprehensive user profile management with dynamic routes
- **Ranking System**: Leaderboard and user ranking displays
- **Responsive Design**: Mobile-first approach with adaptive layouts

### User Experience

- **Advanced Code Editor**: Monaco editor with syntax highlighting and IntelliSense
- **Rich Text Editor**: Full-featured text editor for posts and comments
- **Dynamic Routing**: Catch-all routes for flexible URL structures
- **Component-based UI**: Modular shadcn/ui components with consistent design
- **Interactive Filtering**: Advanced filtering for problems and posts
- **Real-time Updates**: Live submission status and community interactions

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Authentication**: JWT
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tuavsn/CodePracticeFE.git
   cd CodePracticeFE
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```env
   # API Configuration
	 NEXT_PUBLIC_AUTH_SERVER_URL=your_auth_server_url
   NEXT_PUBLIC_CLIENT_ID=your_clientid
   NEXT_PUBLIC_REDIRECT_URI=your_redirect_uri
   NEXT_PUBLIC_POST_LOGOUT_REDIRECT_URI=your_logout_redirect_uri
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_API_PREFIX=api/v1
   NEXT_PUBLIC_APP_URL=your_app_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
CodePracticeFE/
├── app/                     # Next.js App Router
│   ├── admin/              # Admin panel pages
│   ├── auth/               # Authentication routes
│   │   ├── login/          # Login page
│   │   ├── register/       # Register page
│   │   └── forget-password/ # Password reset
│   ├── notifications/      # Notification center
│   ├── oauth/              # OAuth callback handling
│   │   └── callback/       # OAuth callback page
│   ├── posts/              # Blog/Forum posts
│   │   └── [...slug]/      # Dynamic post routes
│   ├── problems/           # Coding problems
│   │   ├── solve/          # Problem solving interface
│   │   │   └── [...slug]/  # Dynamic problem solving
│   │   └── [...slug]/      # Problem detail pages
│   ├── profile/            # User profiles
│   │   └── [...slug]/      # Dynamic profile routes
│   ├── ranks/              # Leaderboard and rankings
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── favicon.ico         # App icon
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx      # Button component
│   │   ├── card.tsx        # Card component
│   │   ├── dialog.tsx      # Modal dialogs
│   │   ├── dropdown-menu.tsx # Dropdown menus
│   │   ├── pagination.tsx  # Pagination component
│   │   └── ...            # Other UI components
│   ├── layout/             # Layout components
│   │   ├── container-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   └── fullscreen-layout.tsx
│   ├── posts/              # Post-related components
│   │   ├── post-card.tsx   # Post display card
│   │   ├── post-filter.tsx # Post filtering
│   │   ├── post-modal.tsx  # Post creation modal
│   │   └── ...            # Other post components
│   ├── problems/           # Problem-related components
│   │   ├── problem-card.tsx # Problem display card
│   │   ├── problem-filter.tsx # Problem filtering
│   │   ├── problem-modal.tsx # Problem management
│   │   ├── monaco-editor.tsx # Code editor
│   │   ├── code-control.tsx # Code execution controls
│   │   └── problem-grid.tsx # Problem grid layout
│   ├── comments/           # Comment system
│   │   ├── comment-card.tsx
│   │   ├── comment-input.tsx
│   │   └── comment-list.tsx
│   ├── profile/            # Profile components
│   │   └── profile-modal.tsx
│   ├── dashboard/          # Dashboard components
│   ├── text-editor.tsx     # Rich text editor
│   ├── user-auth.tsx       # Authentication components
│   ├── pagination.tsx      # Global pagination
│   ├── main-logo.tsx       # Main application logo
│   └── ...                # Other shared components
├── hooks/                  # Custom React hooks (to be added)
├── lib/                    # Utility functions and configurations (to be added)
├── store/                  # Zustand stores (to be added)
├── types/                  # TypeScript type definitions (to be added)
├── public/                 # Static assets
├── styles/                 # Additional styles
├── middleware.ts           # Next.js middleware (optional)
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## 🎨 UI Components

### Built with shadcn/ui

The project uses shadcn/ui for consistent, accessible, and customizable components:

```bash
# Add new shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Styling
npm run ui:add       # Add shadcn/ui components

# Testing (if configured)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

### State Management with Zustand

```typescript
// Example store structure
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (credentials) => {
    // Login logic
  },
  logout: () => {
    // Logout logic
  }
}))
```

## 🌐 API Integration

### Backend Services

| Service | Endpoint | Description |
|---------|----------|-------------|
| Auth Service | `/api/auth` | Authentication and authorization |
| User Service | `/api/users` | User management |
| Forum Service | `/api/forums` | Blog posts and comments |
| Problem Service | `/api/problems` | Coding problems and test cases |
| Submission Service | `/api/submissions` | Code submission and evaluation |

## 🎯 Key Features Implementation

### Authentication Flow

1. User login/register through `/auth` routes
2. JWT token stored in Zustand store
3. Protected routes using middleware
4. Automatic token refresh handling

### Problem Solving Interface

1. Problem description and constraints display
2. Integrated code editor with syntax highlighting
3. Real-time code execution and testing
4. Submission history and result tracking

### Community Features

1. Forum posts with rich text editor
2. Comment system
3. User profiles
4. Search and filtering capabilities

## 🌐 Demo

- **Live Demo**: [https://code-practice-fe.vercel.app](https://code-practice-fe.vercel.app)
- **Backend API**: [https://codejudge.trinhhoctuan.io.vn](https://codejudge.trinhhoctuan.io.vn)

## 📞 Contact

- **Email**: hoctuavsn@gmail.com
- **GitHub**: [https://github.com/Tuavsn](https://github.com/Tuavsn)
- **Demo Frontend**: [https://code-practice-fe.vercel.app](https://code-practice-fe.vercel.app)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn/ui for the beautiful component library
- Vercel for seamless deployment experience
- Open source community for the incredible tools and libraries

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**