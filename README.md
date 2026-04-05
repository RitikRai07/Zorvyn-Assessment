# Zorvyn Finance Dashboard 💰

A modern, professional personal finance management dashboard built with **Next.js 16**, **React**, **TypeScript**, and **Tailwind CSS 4**. This is a feature-rich financial dashboard demonstrating best practices in frontend development, state management, and UI/UX design.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38b2ac?style=flat-square)

## 🌟 Key Features

### Core Dashboard Features
- **📊 Dashboard Overview** - Real-time financial summary with high-level KPIs
  - Total Balance, Total Income, Total Expenses, Savings Rate
  - 30-day Balance Trend visualization
  - Categorical Spending Breakdown with interactive donut chart
  
- **💳 Transactions Management** - Complete transaction lifecycle
  - Full transaction history with detailed information
  - Advanced filtering (category, type, search)
  - Sorting by date and amount
  - Add, Edit, Delete transactions (Admin only)
  
- **📈 Insights & Analytics** - Actionable financial insights
  - Top spending category analysis
  - Monthly income vs. expenses comparison
  - Smart insights with trend analysis
  - Spending trend identification

- **🔐 Role-Based Access Control**
  - **Viewer Role**: Read-only access to all financial data
  - **Admin Role**: Full CRUD operations on transactions
  - Seamless role switching via header dropdown

### Advanced Features
- **🌙 Dark/Light Mode** - Full theme support with smooth transitions
- **💾 Data Persistence** - All data automatically saved to localStorage
- **📥 Export Functionality** - Export transactions as CSV or JSON
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop
- **⚡ Performance Optimized** - Server-side rendering with React Context for state
- **✨ Smooth Animations** - Professional fade-in, slide, and scale animations
- **🎨 Modern Design System** - Consistent color palette and typography

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | App Router, server components, API routes |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Recharts** | Chart visualizations (Line, Pie, Bar) |
| **shadcn/ui** | High-quality UI components |
| **Lucide React** | Beautiful icon set |
| **React Context** | Global state management |
| **Date-fns** | Date manipulation utilities |

## 📁 Project Structure

```
zorvyn/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Dashboard home page
│   ├── globals.css             # Global styles and animations
│   ├── transactions/
│   │   └── page.tsx            # Transactions page
│   └── insights/
│       └── page.tsx            # Insights page
│
├── components/
│   ├── Header.tsx              # Top navigation with role & theme toggle
│   ├── Sidebar.tsx             # Left navigation sidebar
│   ├── MainLayout.tsx          # Layout wrapper component
│   ├── FinanceProviderWrapper.tsx
│   │
│   ├── dashboard/              # Dashboard components
│   │   ├── Overview.tsx        # Main dashboard component
│   │   ├── SummaryCards.tsx    # KPI metric cards
│   │   ├── BalanceTrendChart.tsx  # Line chart - balance over time
│   │   └── SpendingBreakdownChart.tsx  # Pie chart - category breakdown
│   │
│   ├── transactions/           # Transaction components
│   │   ├── TransactionsPage.tsx   # Main transactions page
│   │   ├── TransactionTable.tsx   # Transaction list with sorting
│   │   ├── TransactionFilters.tsx # Filter controls
│   │   └── TransactionForm.tsx    # Add/Edit form dialog
│   │
│   ├── insights/               # Insights components
│   │   ├── InsightsPage.tsx       # Main insights page
│   │   ├── SmartInsights.tsx      # AI-like insights
│   │   ├── HighestSpendingCategory.tsx
│   │   └── MonthlyComparison.tsx  # Bar chart comparison
│   │
│   ├── common/
│   │   └── EmptyState.tsx      # Empty state component
│   │
│   └── ui/                     # shadcn/ui components (auto-generated)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── ... (50+ UI components)
│
├── lib/
│   ├── context/
│   │   └── FinanceContext.tsx  # Global state management
│   │
│   ├── hooks/
│   │   ├── useFinance.ts       # Context hook
│   │   └── use-mobile.ts       # Responsive hook
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   │       ├── UserRole
│   │       ├── Transaction
│   │       ├── Account
│   │       ├── Filters
│   │       └── FinanceContextType
│   │
│   └── utils/
│       ├── mockData.ts         # Mock data generation with seeded RNG
│       ├── calculations.ts     # Financial calculations
│       ├── formatting.ts       # Format functions (currency, date)
│       ├── export.ts           # CSV/JSON export utilities
│       └── utils.ts            # Helper utilities
│
├── public/                     # Static assets
├── styles/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── postcss.config.mjs
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and **npm** 9+ (or yarn/pnpm)
- Basic knowledge of React and TypeScript

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd zorvyn
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open in browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## 📊 Usage Guide

### Dashboard
- **View KPIs**: See your total balance, income, expenses, and savings rate at a glance
- **Monitor Trends**: Check the balance trend chart to visualize financial movements over 30 days
- **Category Breakdown**: Click on any category in the spending breakdown to filter transactions

### Transactions
- **View All Transactions**: See complete history with date, description, category, type, and amount
- **Add Transaction** (Admin): Click "Add Transaction" button to create new transactions
- **Edit Transaction** (Admin): Click Edit button on any transaction to modify it
- **Delete Transaction** (Admin): Click Delete button to remove transactions with confirmation
- **Filter Transactions**:
  - By category (dropdown)
  - By type (Income/Expense)
  - By search text (description matching)
- **Sort Transactions**: Click column headers to sort by date or amount

### Insights
- **Smart Insights**: AI-like observations about your spending patterns
- **Top Category**: See your highest spending category with percentage breakdown
- **Monthly Comparison**: Compare income and expenses across months
- **Spending Trends**: Identify whether your spending is increasing, decreasing, or stable

### Role Switching
1. Click the role indicator in the header (👁️ Viewer / 👑 Admin)
2. Select your desired role
3. UI automatically updates to show/hide admin-only features

### Dark Mode
- Click the Sun/Moon icon in the header to toggle between light and dark themes
- Your preference is saved to localStorage

### Export Data
1. Click "Export" button in the header
2. Choose format:
   - **CSV**: For spreadsheet applications (Excel, Google Sheets)
   - **JSON**: For data analysis or backup

## 🎨 Design System

### Color Palette
```css
Primary:    oklch(0.48 0.2 260)   /* Blue */
Secondary:  oklch(0.56 0.18 195)  /* Teal */
Accent:     oklch(0.58 0.2 165)   /* Green */
Background: oklch(0.996 0 0)      /* White (light mode) */
Dark BG:    oklch(0.1 0 0)        /* Black (dark mode) */
```

### Typography
- **Headings**: Geist (sans-serif) - Bold, Clean
- **Body**: Geist (sans-serif) - Readable, Professional
- **Mono**: Geist Mono - Code/Data

### Spacing & Border Radius
- **Border Radius**: 0.75rem (12px) base, with sm/md/lg variations
- **Spacing Scale**: 0.25rem to 2rem
- **Gap Utilities**: Consistent spacing throughout

## 🔒 Hydration & SSR Fixes

This project properly handles Next.js hydration issues:

### What We Fixed
1. **Fixed hydration mismatch** in the FinanceContext by:
   - Initializing state with same mock data on server and client
   - Moving localStorage reads to useEffect with hydration flag
   - Implementing seeded random generator for consistent mock data

2. **Proper Client-Server Rendering** by:
   - Using 'use client' directive only where needed
   - Ensuring server and client render identical initial HTML
   - Hydrating state after client-side mount

3. **Dark Mode Handling**:
   - Applied dark class only after hydration
   - Used backdrop-blur and color transitions safely

## 📊 Data Management

### Mock Data Generation
```javascript
// Seeded random generator ensures same data on server and client
const rng = new SeededRandom(getSeed())
// Seed is based on current date, so data changes daily
```

### State Management
```typescript
// Context provides:
- transactions: Transaction[]
- accounts: Account[]
- role: UserRole ('viewer' | 'admin')
- filters: Filters
- isDarkMode: boolean
- Add/Update/Delete/Filter functions
```

### Data Persistence
- Transactions, role, and dark mode preference saved to localStorage
- Automatic sync on every change (after hydration)
- Fallback to mock data if localStorage empty

## 🎯 Best Practices Implemented

### Component Architecture
- ✅ Reusable, composable components
- ✅ Proper prop passing and TypeScript typing
- ✅ Separation of concerns (UI vs. logic)
- ✅ Clear component hierarchy

### State Management
- ✅ Single source of truth with Context API
- ✅ Proper hook usage and custom hooks
- ✅ Hydration-safe initialization
- ✅ Memoized callbacks with useCallback

### Performance
- ✅ Server-side rendering with Next.js App Router
- ✅ Code splitting and lazy loading
- ✅ Optimized re-renders with proper dependencies
- ✅ Efficient calculations (memoized selectors)

### Styling
- ✅ Utility-first CSS with Tailwind
- ✅ Consistent design tokens
- ✅ Dark mode support
- ✅ Responsive breakpoints

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Sufficient color contrast
- ✅ Focus states on buttons

### Type Safety
- ✅ Full TypeScript coverage
- ✅ Strict mode enabled
- ✅ Proper interface definitions
- ✅ Type-safe props and state

## 📈 Features by Role

### Viewer Role
- ✅ View dashboard with all charts
- ✅ View all transactions
- ✅ Filter and sort transactions
- ✅ View insights and analytics
- ✅ Export data (CSV/JSON)
- ❌ Cannot add/edit/delete transactions

### Admin Role
- ✅ All Viewer capabilities
- ✅ Add new transactions
- ✅ Edit existing transactions
- ✅ Delete transactions with confirmation
- ✅ Full data modification

## 🔐 Security Notes

This is a **frontend-only demonstration**. In production:

1. **Backend API Required**:
   - Don't store sensitive data in localStorage
   - Implement proper authentication (JWT, sessions)
   - Validate all data on the server
   - Use secure cookies (httpOnly)

2. **Data Protection**:
   - Implement role-based authorization checks on the backend
   - Encrypt sensitive financial data
   - Use HTTPS only
   - Add CSRF protection

3. **API Integration**:
   ```javascript
   // Replace mock data with real API calls
   const response = await fetch('/api/transactions')
   const transactions = await response.json()
   ```

## 🧪 Testing Recommendations

### Unit Tests
- Test calculation functions
- Test filter/sort logic
- Test formatting utilities

### Component Tests
- Test role-based rendering
- Test form validation
- Test responsive behavior

### E2E Tests
- Test complete user flows
- Test data persistence
- Test mode switching

Example test:
```javascript
describe('TransactionTable', () => {
  it('should show delete button only for admin role', () => {
    render(<TransactionTable role="admin" {...props} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
    
    render(<TransactionTable role="viewer" {...props} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })
})
```

## 📚 Key Learnings

### Hydration Handling
- Always initialize state with the same value on server and client
- Use useEffect hooks to load client-specific data (localStorage, window object)
- Implement hydration flags to prevent mismatches
- Seed random generators for consistency

### State Management
- Context API is sufficient for moderate complexity apps
- Use custom hooks to abstract context usage
- Implement proper memoization for performance
- Keep context focused and organized

### React Best Practices
- Use 'use client' directive strategically
- Prefer composition over inheritance
- Keep components small and focused
- Use proper TypeScript typing

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created as a demonstration of modern frontend development practices and financial application design.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- [Recharts](https://recharts.org) - Excellent charting library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Next.js](https://nextjs.org) - React framework for production

## 📞 Support

For questions or issues:
1. Check the [documentation](#)
2. Review the code comments
3. Create an issue on GitHub

---

**Happy coding!** 🚀 Feel free to use this project as a reference, template, or starting point for your own financial applications.

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Usage

### Switching Roles
Click the role indicator in the header to switch between:
- **Viewer**: Read-only access to all data
- **Admin**: Full CRUD operations on transactions

### Filtering Transactions
Use the filter panel on the Transactions page to:
- Filter by category (Food, Transport, Entertainment, etc.)
- Filter by transaction type (Income/Expense)
- Search by description
- Select date range

### Exporting Data
Click "Export" in the header to download:
- CSV format for spreadsheet applications
- JSON format for data integration

### Dark Mode
Toggle dark mode using the moon/sun icon in the header.

## Component Highlights

### SummaryCards
Displays four key metrics with interactive hover effects:
- Gradient backgrounds with semi-transparent colors
- Animated icons on hover
- Trending indicators
- Color-coded by metric type

### Charts
- **Balance Trend**: Line chart with smooth animations
- **Spending Breakdown**: Donut chart with category breakdown
- **Monthly Comparison**: Bar chart for comparing spending periods

### Transaction Table
- Sortable columns (date, amount)
- Category badges with colors
- Transaction type indicators
- Admin actions (edit, delete)
- Responsive table with horizontal scroll

## State Management

Global state is managed via React Context with localStorage persistence:

```typescript
interface FinanceContext {
  transactions: Transaction[]
  accounts: Account[]
  role: UserRole
  filters: Filters
  isDarkMode: boolean
  // ... methods
}
```

Data automatically syncs to localStorage on every change.

## Performance Optimizations

- Memoized calculations for financial metrics
- Lazy-loaded chart components
- Efficient list rendering with keys
- CSS transitions instead of JavaScript animations
- Responsive images with proper sizing

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color combinations
- Screen reader friendly text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- User authentication
- Budget planning and goals
- Recurring transactions
- Receipt uploads
- Multi-account support
- Analytics and reporting
- Mobile app version

## License

This project is open source and available for evaluation purposes.

## Author

Frontend Developer Intern - Finance Dashboard Assignment
