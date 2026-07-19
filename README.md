# Forex Intelligence & Analytics Platform

A comprehensive web-based forex analysis platform that combines technical analysis, fundamental analysis, news sentiment, and quantitative methods to provide probabilistic trading signals.

## ⚠️ Disclaimer

**This platform is for educational and informational purposes only.**

- Results are probabilistic estimates, NOT trading recommendations
- Past performance does NOT guarantee future results
- Trading forex involves significant risk of loss
- Always conduct your own research and consult licensed financial advisors
- Never risk more than you can afford to lose

## Features

### Dashboard
- Real-time market overview
- Currency pair cards with signals
- Currency strength meter
- Economic calendar widget
- Market sentiment indicators
- Trading session status

### Analysis
- **Technical Analysis**: 20+ indicators including RSI, MACD, Bollinger Bands, Ichimoku
- **Multi-Timeframe Analysis**: Confluence detection across M5 to MN1
- **Fundamental Analysis**: Economic indicator tracking
- **Sentiment Analysis**: News sentiment scoring
- **Smart Money Concepts**: Order blocks, FVG, liquidity zones

### Signal Generation
- Probabilistic signal scoring (0-100)
- Confidence level calculation
- Explainable AI - every signal includes reasoning
- Entry zones, stop loss, and target levels
- Risk/reward ratio calculation

### Additional Features
- Multi-language support (English & Arabic)
- RTL support for Arabic
- Dark/Light theme
- Responsive design
- Risk calculator
- Economic calendar
- Price alerts

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Charts**: Lightweight Charts (planned)
- **State Management**: React Context + SWR
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forex-intelligence-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/forex_db
```

4. Push database schema:
```bash
npx drizzle-kit push
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── pairs/             # Currency pair pages
│   ├── calendar/          # Economic calendar
│   ├── risk-calculator/   # Risk management
│   └── settings/          # User settings
├── components/            # React components
│   ├── dashboard/         # Dashboard widgets
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── context/               # React contexts
├── db/                    # Database schema & client
├── i18n/                  # Internationalization
├── lib/                   # Utilities & constants
└── types/                 # TypeScript types
```

## Signal Classification

| Signal | Score Range | Min Confidence |
|--------|-------------|----------------|
| Strong Buy | 80-100 | 70% |
| Buy | 60-79 | 60% |
| Neutral | 40-59 | Any |
| Sell | 21-39 | 60% |
| Strong Sell | 0-20 | 70% |

## Analysis Weights (Default)

| Component | Weight |
|-----------|--------|
| Technical Analysis | 25% |
| Multi-Timeframe | 15% |
| Fundamental Analysis | 20% |
| Sentiment Analysis | 15% |
| Currency Strength | 10% |
| Market Structure | 10% |
| Volatility | 2.5% |
| Correlation | 2.5% |

## API Integration

The platform uses a pluggable data provider architecture. To connect live data:

1. Implement the `IMarketDataProvider` interface
2. Configure API keys in environment variables
3. Register the provider in the data layer

Currently supported (planned):
- Alpha Vantage
- Polygon.io
- OANDA
- Custom WebSocket feeds

## Development

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript checks
```

### Database Migrations

```bash
npx drizzle-kit generate  # Generate migration
npx drizzle-kit push      # Push schema changes
npx drizzle-kit studio    # Open Drizzle Studio
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please open an issue on GitHub.

---

**Remember**: This is a demonstration platform. For production use, ensure proper:
- API key management
- Data validation
- Security hardening
- Compliance with financial regulations
- Risk warnings and disclaimers
