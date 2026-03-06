# DemoTrade: NEPSE Investing Simulator

DemoTrade is an Investopedia-style paper trading simulator designed specifically for the Nepal Stock Exchange (NEPSE). It provides a risk-free environment for users to practice trading stocks using virtual currency, loaded with realistic mock market data, portfolio tracking, and AI-driven market insights.

## Features
- **Virtual Portfolio:** Start with NPR 100,000 in virtual cash.
- **Realistic Market Simulation:** Real-time stock price fluctuations across 30 major NEPSE listings, mimicking actual market volatility.
- **AI Insights:** Automated, mock AI-driven analysis of stock movements and bullish/bearish indicators to guide trades.
- **Dynamic Charting:** Interactive Recharts area charts showing historical, fluidly generated 30-day stock trends.
- **Trading Engine:** Full Buy/Sell order execution system with transaction history logs.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Zustand, Recharts, Axios
- **Backend:** Node.js, Express, Socket.io (for real-time price pushes), Prisma ORM
- **Database:** SQLite (for easy local setup without heavy database engines)

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation & Setup

1. **Clone the Repository**
   \`\`\`bash
   git clone <your-repository-url>
   cd synthetic-magnetosphere
   \`\`\`

2. **Backend Setup**
   \`\`\`bash
   cd backend
   npm install
   
   # Push the Prisma schema to create the local SQLite database
   npx prisma db push
   
   # Start the backend development server (runs on port 5000)
   npm run dev
   \`\`\`

3. **Frontend Setup**
   Open a new terminal window:
   \`\`\`bash
   cd frontend
   npm install
   
   # Start the React development frontend (runs on port 5173/5174)
   npm run dev
   \`\`\`

## Architecture Highlights
- **Market Service:** A robust polling engine broadcasts stock fluctuations to connected clients every 5 seconds via WebSockets (`Socket.io`).
- **Data Path Alignment:** Real-time UI and historical Area charts sync dynamically, generated backwards from the True Mock LTP (last traded price) so the charts never disconnect from live reality.
- **Security:** Standard JWT token-based authentication system.

## Pushing to GitHub (For the User)

If you haven't published this code to GitHub yet, follow these steps:

1. Go to [GitHub](https://github.com/) and create a **New Repository**. Do NOT initialize it with a README or .gitignore (leave it completely empty).
2. Copy the URL of your new repository (e.g., `https://github.com/yourusername/demotrade.git`)
3. Run the following commands in the root of this project:
   \`\`\`bash
   git remote add origin <YOUR_GITHUB_URL>
   git branch -M main
   git push -u origin main
   \`\`\`
