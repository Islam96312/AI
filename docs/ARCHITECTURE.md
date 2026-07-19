# System Architecture

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Dashboard  │  │ Pair Detail │  │   Alerts    │  │   Reports   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                           Next.js App Router                                 │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  REST API   │  │  WebSocket  │  │    Auth     │  │   Export    │        │
│  │  /api/*     │  │  Real-time  │  │   JWT/SSO   │  │  PDF/CSV    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    SIGNAL FUSION ENGINE                             │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │    │
│  │  │Technical│ │  MTF    │ │Fundament│ │Sentiment│ │Currency │      │    │
│  │  │Analysis │ │Analysis │ │Analysis │ │Analysis │ │Strength │      │    │
│  │  │  25%    │ │  15%    │ │  20%    │ │  15%    │ │  10%    │      │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐                              │    │
│  │  │ Market  │ │Volatil- │ │Correlat-│                              │    │
│  │  │Structure│ │  ity    │ │  ions   │                              │    │
│  │  │  10%    │ │  2.5%   │ │  2.5%   │                              │    │
│  │  └─────────┘ └─────────┘ └─────────┘                              │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │Market Data  │  │ Economic   │  │    News     │  │  Historical │        │
│  │ Provider    │  │  Calendar  │  │  Provider   │  │    Data     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         PostgreSQL + Cache                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Module Structure

### 2.1 Data Providers (Pluggable)
```typescript
interface IMarketDataProvider {
  getName(): string;
  getSupportedPairs(): string[];
  getCandles(pair: string, timeframe: string, limit: number): Promise<Candle[]>;
  getCurrentPrice(pair: string): Promise<PriceQuote>;
  subscribe(pair: string, callback: (price: PriceQuote) => void): void;
}
```

### 2.2 Analysis Engines
Each engine implements:
```typescript
interface IAnalysisEngine<T> {
  analyze(data: MarketData): Promise<AnalysisResult<T>>;
  getScore(): number; // -100 to +100
  getConfidence(): number; // 0 to 100
  getExplanation(): string[];
}
```

## 3. Data Flow

```
Market Data → Validation → Storage → Analysis Engines → Fusion → Signal
                                          ↓
                               Confidence Adjustment
                                          ↓
                               Risk Assessment
                                          ↓
                               Signal Output with Explanation
```

## 4. Scoring Formula

### Final Signal Score
```
FinalScore = Σ(EngineScore × EngineWeight × DataQuality)
            ────────────────────────────────────────────
                    Σ(EngineWeight × DataQuality)
```

### Confidence Calculation
```
BaseConfidence = min(individual_confidences)

Adjustments:
- Data freshness: -5% per hour of stale data
- Conflicting signals: -20% if technical vs fundamental disagree
- Low data quality: -15% if missing data points
- Pre-news risk: -25% within 1 hour of high-impact news
- High agreement: +10% if all engines align
```

## 5. Technology Decisions

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Next.js 16 | SSR, API routes, TypeScript support |
| Styling | Tailwind CSS | Rapid UI development, RTL support |
| Charts | Lightweight Charts | TradingView quality, open source |
| Database | PostgreSQL | Reliable, time-series capable |
| ORM | Drizzle | Type-safe, performant |
| State | React Context + SWR | Simple, effective for real-time |
| i18n | next-intl | Best Next.js i18n solution |
| Auth | NextAuth.js | Flexible, secure |

## 6. Security Architecture

```
┌─────────────────────────────────────────────┐
│               Security Layers               │
├─────────────────────────────────────────────┤
│ 1. WAF / Rate Limiting                      │
│ 2. JWT Token Validation                     │
│ 3. RBAC Permission Check                    │
│ 4. Input Validation (Zod)                   │
│ 5. SQL Injection Prevention (Drizzle)       │
│ 6. XSS Prevention (React)                   │
│ 7. CSRF Protection                          │
│ 8. API Key Encryption                       │
│ 9. Audit Logging                            │
└─────────────────────────────────────────────┘
```
