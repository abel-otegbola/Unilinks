# UniLinks

![UniLinks Banner](public/hero-bg.png)

## 📖 Description

UniLinks is a modern payment link generator designed for freelancers, businesses, and creators. It provides a streamlined solution for accepting payments via multiple methods including cryptocurrency, bank transfers, PayPal, and Stripe. With custom branded links, real-time tracking, and instant notifications, UniLinks helps you get paid faster and manage your payment flows efficiently.

Built with enterprise-grade security and designed to scale from solo entrepreneurs to growing enterprises, UniLinks handles everything from a single transaction to thousands per day with 99.9% uptime guaranteed.

## ✨ Features

- **🔗 Payment Link Generation**: Create custom, shareable payment links in seconds with unique references
- **💳 Multiple Payment Methods**: Support for crypto, bank transfers, PayPal, and Stripe
- **📊 Real-Time Tracking**: Monitor payment status with live updates and comprehensive analytics
- **👤 User Authentication**: Secure Firebase-based authentication system
- **📱 Responsive Design**: Fully responsive interface built with Tailwind CSS
- **📈 Dashboard Analytics**: View all your payment links and their statuses in one place
- **🔐 Secure & Scalable**: Bank-level security with enterprise-grade infrastructure
- **⚙️ Account Management**: Manage profile, payment methods, and account settings
- **📋 Timeline Events**: Track payment link activity and history
- **💾 Local Storage Integration**: Persist user preferences and data
- **🎯 QR Code Generation**: Generate QR codes for easy payment link sharing
- **📄 PDF Export**: Export payment link details and receipts as PDF documents

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.12.0
- **Backend**: Firebase (Authentication & Firestore Database)
- **Form Management**: Formik 2.4.9
- **Validation**: Yup 1.7.1
- **Icons**: Phosphor Icons React 2.1.10
- **QR Code**: qrcode 1.5.4
- **PDF Generation**: jsPDF 4.0.0
- **Code Quality**: ESLint 9.39.1

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.x or higher recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Firebase** account with a project set up

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abel-otegbola/unilinks.git
   cd unilinks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore Database
   - Copy your Firebase configuration

4. **Configure environment variables**
   - Create a Firebase configuration file at `src/firebase/firebase.ts`
   - Add your Firebase credentials:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📖 How to Use

### Getting Started

1. **Create an Account**
   - Visit the homepage and click "Get Started for free"
   - Register with your email and password
   - Verify your account through Firebase

2. **Create Your First Payment Link**
   - Navigate to the "Links" section in your dashboard
   - Click "Add New Payment Link"
   - Fill in the payment details:
     - Title/Description
     - Amount
     - Currency
     - Payment method (Crypto, Bank Transfer, PayPal, Stripe)
   - Click "Create Link"

3. **Share Your Payment Link**
   - Copy the generated link from your dashboard
   - Share it via email, social media, or messaging apps
   - Optionally, use the generated QR code for easy scanning

4. **Track Payments**
   - Monitor payment status in real-time from your dashboard
   - View payment history and timeline events
   - Export payment details as PDF documents

### Managing Payment Methods

1. Navigate to "Payment Methods" in your account
2. Add your preferred payment method details (crypto wallet, bank account, PayPal email, Stripe account)
3. Set default payment methods for quick link creation

### Customizing Your Profile

1. Go to "Profile" section
2. Update your personal information
3. Upload a profile picture
4. Save changes

### Security Settings

1. Access "Settings" from your account menu
2. Change password regularly
3. Review connected payment methods
4. Manage account deletion options if needed

## 📁 Project Structure

```
unilinks/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and other assets
│   ├── components/     # Reusable UI components
│   │   ├── authOverlay/
│   │   ├── button/
│   │   ├── dropdown/
│   │   ├── footer/
│   │   ├── input/
│   │   ├── modal/
│   │   ├── sidebar/
│   │   ├── toast/
│   │   └── toggle/
│   ├── contexts/       # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── PaymentContext.tsx
│   │   └── PaymentLinkContext.tsx
│   ├── customHooks/    # Custom React hooks
│   ├── firebase/       # Firebase configuration
│   ├── interface/      # TypeScript interfaces
│   ├── pages/          # Page components
│   │   ├── account/    # User dashboard pages
│   │   ├── auth/       # Authentication pages
│   │   └── static/     # Static pages (home, pay)
│   ├── schema/         # Validation schemas
│   └── utils/          # Utility functions
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── vercel.json         # Vercel deployment configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to complete deployment

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Backend powered by [Firebase](https://firebase.google.com/)

## 📞 Support

For support, email support@unilinks.com or open an issue in the GitHub repository.

---

Made with ❤️ by Abel
