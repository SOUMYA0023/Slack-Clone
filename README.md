# 💬 Slack Clone

A real-time messaging application built with modern web technologies, replicating core Slack functionality with channels, direct messaging, and user profiles.

## 🚀 Features

- **Real-time Messaging**: Instant message delivery using Convex real-time subscriptions
- **Channel Management**: Create, join, and manage conversation channels
- **User Profiles**: Customizable user profiles with avatars and status
- **Anonymous Authentication**: Quick sign-in with Convex Auth
- **Responsive Design**: Built with Tailwind CSS for mobile and desktop
- **Type-safe Backend**: Fully typed API with TypeScript and Convex

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Sonner** - Toast notifications
- **TypeScript** - Type safety

### Backend
- **Convex** - Serverless backend platform
- **Convex Auth** - Authentication system
- **Real-time Database** - Built-in real-time subscriptions

### Tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **npm-run-all** - Parallel script execution

## 📁 Project Structure

```
slack-clone/
├── convex/                    # Backend logic (Convex functions)
│   ├── _generated/           # Auto-generated types
│   ├── auth.config.ts        # Authentication configuration
│   ├── auth.ts               # Auth functions
│   ├── channels.ts           # Channel management functions
│   ├── http.ts               # HTTP routes handler
│   ├── messages.ts           # Message handling functions
│   ├── profiles.ts           # User profile functions
│   ├── router.ts             # Custom HTTP routes
│   ├── schema.ts             # Database schema definition
│   └── tsconfig.json         # TypeScript config for Convex
├── src/                       # Frontend code
│   ├── components/           # Reusable UI components
│   │   └── Button.tsx
│   ├── lib/                  # Utility functions
│   │   └── utils.ts
│   ├── App.tsx               # Main application component
│   ├── SignInForm.tsx        # Authentication form
│   ├── SignOutButton.tsx     # Sign out component
│   ├── index.css             # Global styles
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite type definitions
├── .gitignore                # Git ignore rules
├── components.json           # shadcn/ui configuration
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── setup.mjs                 # Development setup script
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── tsconfig.app.json         # App-specific TS config
├── tsconfig.node.json        # Node-specific TS config
└── vite.config.ts            # Vite configuration
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SOUMYA0023/Slack-Clone.git
cd Slack-Clone
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

This command will:
- Initialize the Convex backend
- Run the setup script
- Start both frontend (Vite) and backend (Convex) servers in parallel

4. **Open your browser**

The application will automatically open at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the Vite dev server
- `npm run dev:backend` - Start only the Convex dev server
- `npm run lint` - Run TypeScript and ESLint checks

## 🔐 Authentication

This application uses **Convex Auth** with anonymous authentication by default. Users can sign in without creating an account, making it easy to get started.

> **Note**: For production use, consider implementing email/password or OAuth authentication.

## 🗄️ Database Schema

The Convex schema includes:

- **Users**: User profiles and authentication data
- **Channels**: Conversation channels
- **Messages**: Chat messages with timestamps
- **Profiles**: Extended user information

## 🌐 Deployment

### Deploy to Convex

1. **Sign up for Convex** at [convex.dev](https://convex.dev)

2. **Deploy your backend**

```bash
npx convex deploy
```

3. **Deploy your frontend** to services like:
   - Vercel
   - Netlify
   - Cloudflare Pages

### Environment Variables

Convex manages environment variables through its dashboard. The `.env.local` file is auto-generated during development and should never be committed to version control.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Convex Documentation](https://docs.convex.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 👤 Author

**Soumya Sumankar**

- GitHub: [@SOUMYA0023](https://github.com/SOUMYA0023)

## 🙏 Acknowledgments

- Built with [Convex](https://convex.dev) - The full-stack serverless platform
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
- Design patterns from Slack

---

⭐ Star this repository if you find it helpful!