# HQMS - Hospital Queue Management System

A modern, responsive Hospital Queue Management System built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, and Lucide icons.

## Features

### 🏥 **Multi-Role Dashboard System**
- **Patient Portal**: Join queues, book appointments, view wait times, manage profile
- **Doctor Interface**: Manage patient queues, view schedules, call next patient
- **Admin Dashboard**: Oversee all queues, manage users, generate reports

### 🎨 **Modern UI/UX**
- Clean, professional healthcare-focused design
- Dark/Light mode support with system preference detection
- Fully responsive design (mobile, tablet, desktop)
- ShadCN UI components with Tailwind CSS styling
- Lucide React icons throughout

### 🔐 **Role-Based Authentication**
- Secure login/signup system
- Dynamic navigation based on user role
- Protected routes and role-specific access

### 📊 **Real-Time Queue Management**
- Live queue position updates
- Estimated wait time calculations
- Queue prioritization and management
- Real-time status updates

### 📅 **Appointment System**
- Online appointment booking
- Calendar integration
- Appointment history and management
- Rescheduling and cancellation

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React
- **State Management**: React Context API + React Hooks
- **Authentication**: Custom auth context (easily replaceable)
- **Theme**: Dark/Light mode with system preference

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hqms
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (patient)/         # Patient dashboard routes
│   │   └── dashboard/
│   ├── (doctor)/          # Doctor dashboard routes
│   │   └── dashboard/
│   ├── (admin)/           # Admin dashboard routes
│   │   └── dashboard/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to login)
├── components/
│   ├── ui/               # ShadCN UI components
│   ├── common/           # Shared components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── patient/          # Patient-specific components
│   ├── doctor/           # Doctor-specific components
│   ├── admin/            # Admin-specific components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── mockData.ts       # Mock data for development
│   ├── auth.tsx          # Authentication context
│   └── utils.ts          # ShadCN utilities
└── styles/
    └── globals.css       # Global styles
```

## User Roles & Features

### 👤 **Patient**
- **Dashboard**: Queue status, upcoming appointments, health overview
- **Queue Management**: Join walk-in queues, view position and wait times
- **Appointments**: Book, reschedule, cancel appointments
- **Profile**: Manage personal information, insurance details
- **History**: View past appointments and medical records

### 👩‍⚕️ **Doctor**
- **Dashboard**: Today's queue, patient list, schedule overview
- **Queue Control**: Call next patient, skip patients, mark as done
- **Schedule**: Calendar view of appointments
- **Patient Info**: Quick access to patient cards and history
- **Availability**: Update working hours and availability

### 🔧 **Admin/Receptionist**
- **Dashboard**: Overview of all queues and hospital statistics
- **Queue Management**: Manage all department queues, reorder patients
- **User Management**: Add patients, manage staff accounts
- **Appointments**: Create, modify, cancel appointments for patients
- **Reports**: Generate analytics and wait time reports
- **Settings**: System configuration and department management

## Mock Authentication

For demo purposes, the system uses mock authentication:

- **Patient**: Any email without "admin" or "doctor"
- **Doctor**: Email containing "doctor" (e.g., doctor@hospital.com)
- **Admin**: Email containing "admin" (e.g., admin@hospital.com)
- **Password**: Any password (not validated in demo)

## Deployment

### Vercel (Recommended)

1. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy with zero configuration

### Other Platforms

The project is compatible with:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## Customization

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

### Modifying Themes
Edit `src/app/globals.css` for custom color schemes and styling.

### Mock Data
Update `src/lib/mockData.ts` to modify sample patients, doctors, and appointments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for healthcare professionals**
