import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  decimal,
  jsonb,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== ENUMS ====================

export const userRoleEnum = pgEnum("user_role", ["admin", "analyst", "trader", "viewer"]);
export const signalTypeEnum = pgEnum("signal_type", ["strong_buy", "buy", "neutral", "sell", "strong_sell"]);
export const timeframeEnum = pgEnum("timeframe", ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1", "MN1"]);
export const trendEnum = pgEnum("trend", ["bullish", "bearish", "sideways"]);
export const impactLevelEnum = pgEnum("impact_level", ["low", "medium", "high"]);
export const sentimentEnum = pgEnum("sentiment", ["bullish", "slightly_bullish", "neutral", "slightly_bearish", "bearish"]);
export const alertStatusEnum = pgEnum("alert_status", ["active", "triggered", "expired", "cancelled"]);
export const alertChannelEnum = pgEnum("alert_channel", ["app", "email", "telegram", "browser"]);
export const dataSourceStatusEnum = pgEnum("data_source_status", ["active", "degraded", "offline"]);

// ==================== USERS & AUTH ====================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("viewer").notNull(),
  avatar: text("avatar"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  preferredTheme: varchar("preferred_theme", { length: 10 }).default("dark"),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("users_email_idx").on(table.email),
]);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("sessions_user_id_idx").on(table.userId),
  index("sessions_token_idx").on(table.token),
]);

// ==================== FOREX PAIRS ====================

export const forexPairs = pgTable("forex_pairs", {
  id: serial("id").primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull().unique(),
  baseCurrency: varchar("base_currency", { length: 10 }).notNull(),
  quoteCurrency: varchar("quote_currency", { length: 10 }).notNull(),
  displayName: varchar("display_name", { length: 50 }).notNull(),
  pipSize: decimal("pip_size", { precision: 10, scale: 6 }).notNull(),
  pipValue: decimal("pip_value", { precision: 10, scale: 4 }),
  minLotSize: decimal("min_lot_size", { precision: 10, scale: 4 }).default("0.01"),
  maxLotSize: decimal("max_lot_size", { precision: 10, scale: 2 }).default("100"),
  tradingHours: jsonb("trading_hours"),
  isActive: boolean("is_active").default(true),
  category: varchar("category", { length: 50 }).default("major"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("forex_pairs_symbol_idx").on(table.symbol),
  index("forex_pairs_category_idx").on(table.category),
]);

// ==================== MARKET DATA ====================

export const candles = pgTable("candles", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  timeframe: timeframeEnum("timeframe").notNull(),
  openTime: timestamp("open_time").notNull(),
  closeTime: timestamp("close_time").notNull(),
  open: decimal("open", { precision: 20, scale: 10 }).notNull(),
  high: decimal("high", { precision: 20, scale: 10 }).notNull(),
  low: decimal("low", { precision: 20, scale: 10 }).notNull(),
  close: decimal("close", { precision: 20, scale: 10 }).notNull(),
  volume: decimal("volume", { precision: 20, scale: 4 }),
  tickVolume: integer("tick_volume"),
  spread: decimal("spread", { precision: 10, scale: 2 }),
  sourceId: integer("source_id").references(() => dataSources.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("candles_pair_tf_time_idx").on(table.pairId, table.timeframe, table.openTime),
  index("candles_pair_id_idx").on(table.pairId),
  index("candles_open_time_idx").on(table.openTime),
]);

export const currentPrices = pgTable("current_prices", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  bid: decimal("bid", { precision: 20, scale: 10 }).notNull(),
  ask: decimal("ask", { precision: 20, scale: 10 }).notNull(),
  mid: decimal("mid", { precision: 20, scale: 10 }).notNull(),
  spread: decimal("spread", { precision: 10, scale: 2 }),
  dailyOpen: decimal("daily_open", { precision: 20, scale: 10 }),
  dailyHigh: decimal("daily_high", { precision: 20, scale: 10 }),
  dailyLow: decimal("daily_low", { precision: 20, scale: 10 }),
  dailyChange: decimal("daily_change", { precision: 10, scale: 4 }),
  dailyChangePercent: decimal("daily_change_percent", { precision: 10, scale: 4 }),
  sourceId: integer("source_id").references(() => dataSources.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("current_prices_pair_idx").on(table.pairId),
]);

// ==================== TECHNICAL INDICATORS ====================

export const technicalIndicators = pgTable("technical_indicators", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  timeframe: timeframeEnum("timeframe").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  indicatorName: varchar("indicator_name", { length: 50 }).notNull(),
  indicatorParams: jsonb("indicator_params"),
  value: decimal("value", { precision: 20, scale: 10 }),
  values: jsonb("values"), // For multi-value indicators like Bollinger Bands
  signal: varchar("signal", { length: 20 }), // buy, sell, neutral
  strength: integer("strength"), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("tech_indicators_pair_tf_idx").on(table.pairId, table.timeframe),
  index("tech_indicators_timestamp_idx").on(table.timestamp),
  index("tech_indicators_name_idx").on(table.indicatorName),
]);

// ==================== ECONOMIC DATA ====================

export const economicEvents = pgTable("economic_events", {
  id: serial("id").primaryKey(),
  eventId: varchar("event_id", { length: 100 }).unique(),
  title: varchar("title", { length: 500 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  eventTime: timestamp("event_time").notNull(),
  impact: impactLevelEnum("impact").notNull(),
  previousValue: varchar("previous_value", { length: 100 }),
  forecastValue: varchar("forecast_value", { length: 100 }),
  actualValue: varchar("actual_value", { length: 100 }),
  unit: varchar("unit", { length: 50 }),
  description: text("description"),
  sourceUrl: text("source_url"),
  sourceId: integer("source_id").references(() => dataSources.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("economic_events_time_idx").on(table.eventTime),
  index("economic_events_currency_idx").on(table.currency),
  index("economic_events_impact_idx").on(table.impact),
]);

export const fundamentalIndicators = pgTable("fundamental_indicators", {
  id: serial("id").primaryKey(),
  currency: varchar("currency", { length: 10 }).notNull(),
  indicatorName: varchar("indicator_name", { length: 100 }).notNull(),
  value: decimal("value", { precision: 20, scale: 6 }),
  previousValue: decimal("previous_value", { precision: 20, scale: 6 }),
  changePercent: decimal("change_percent", { precision: 10, scale: 4 }),
  effectiveDate: timestamp("effective_date").notNull(),
  nextUpdateDate: timestamp("next_update_date"),
  sourceUrl: text("source_url"),
  sourceId: integer("source_id").references(() => dataSources.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("fundamental_currency_idx").on(table.currency),
  index("fundamental_name_idx").on(table.indicatorName),
  uniqueIndex("fundamental_unique_idx").on(table.currency, table.indicatorName, table.effectiveDate),
]);

// ==================== NEWS & SENTIMENT ====================

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"),
  sourceUrl: text("source_url").notNull(),
  sourceName: varchar("source_name", { length: 255 }),
  publishedAt: timestamp("published_at").notNull(),
  affectedCurrencies: jsonb("affected_currencies").$type<string[]>(),
  affectedPairs: jsonb("affected_pairs").$type<string[]>(),
  sentiment: sentimentEnum("sentiment"),
  sentimentScore: integer("sentiment_score"), // -100 to +100
  sentimentConfidence: integer("sentiment_confidence"), // 0-100
  impact: impactLevelEnum("impact"),
  isProcessed: boolean("is_processed").default(false),
  sourceId: integer("source_id").references(() => dataSources.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("news_published_at_idx").on(table.publishedAt),
  index("news_sentiment_idx").on(table.sentiment),
]);

export const sentimentResults = pgTable("sentiment_results", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }),
  currency: varchar("currency", { length: 10 }),
  timestamp: timestamp("timestamp").notNull(),
  overallSentiment: sentimentEnum("overall_sentiment").notNull(),
  sentimentScore: integer("sentiment_score").notNull(), // -100 to +100
  confidence: integer("confidence").notNull(), // 0-100
  newsCount: integer("news_count").default(0),
  positiveCount: integer("positive_count").default(0),
  negativeCount: integer("negative_count").default(0),
  neutralCount: integer("neutral_count").default(0),
  topFactors: jsonb("top_factors"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("sentiment_pair_idx").on(table.pairId),
  index("sentiment_currency_idx").on(table.currency),
  index("sentiment_timestamp_idx").on(table.timestamp),
]);

// ==================== CURRENCY STRENGTH ====================

export const currencyScores = pgTable("currency_scores", {
  id: serial("id").primaryKey(),
  currency: varchar("currency", { length: 10 }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  technicalScore: integer("technical_score"), // -100 to +100
  fundamentalScore: integer("fundamental_score"), // -100 to +100
  sentimentScore: integer("sentiment_score"), // -100 to +100
  overallScore: integer("overall_score").notNull(), // -100 to +100
  rank: integer("rank"), // 1-8 among major currencies
  changeFromPrevious: integer("change_from_previous"),
  factors: jsonb("factors"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("currency_scores_currency_idx").on(table.currency),
  index("currency_scores_timestamp_idx").on(table.timestamp),
  uniqueIndex("currency_scores_unique_idx").on(table.currency, table.timestamp),
]);

// ==================== ANALYSIS & SIGNALS ====================

export const pairAnalyses = pgTable("pair_analyses", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  timestamp: timestamp("timestamp").notNull(),
  
  // Overall Results
  signal: signalTypeEnum("signal").notNull(),
  signalScore: integer("signal_score").notNull(), // 0-100
  confidence: integer("confidence").notNull(), // 0-100
  trend: trendEnum("trend").notNull(),
  
  // Component Scores
  technicalScore: integer("technical_score"),
  mtfScore: integer("mtf_score"),
  fundamentalScore: integer("fundamental_score"),
  sentimentScore: integer("sentiment_score"),
  currencyStrengthScore: integer("currency_strength_score"),
  structureScore: integer("structure_score"),
  volatilityScore: integer("volatility_score"),
  correlationScore: integer("correlation_score"),
  
  // Price Levels
  currentPrice: decimal("current_price", { precision: 20, scale: 10 }).notNull(),
  entryZoneLow: decimal("entry_zone_low", { precision: 20, scale: 10 }),
  entryZoneHigh: decimal("entry_zone_high", { precision: 20, scale: 10 }),
  stopLoss: decimal("stop_loss", { precision: 20, scale: 10 }),
  target1: decimal("target_1", { precision: 20, scale: 10 }),
  target2: decimal("target_2", { precision: 20, scale: 10 }),
  target3: decimal("target_3", { precision: 20, scale: 10 }),
  invalidationLevel: decimal("invalidation_level", { precision: 20, scale: 10 }),
  riskRewardRatio: decimal("risk_reward_ratio", { precision: 5, scale: 2 }),
  
  // Timeframe Analysis
  timeframeAnalysis: jsonb("timeframe_analysis"),
  
  // Explanation
  bullishFactors: jsonb("bullish_factors").$type<string[]>(),
  bearishFactors: jsonb("bearish_factors").$type<string[]>(),
  risks: jsonb("risks").$type<string[]>(),
  summary: text("summary"),
  
  // Meta
  horizon: varchar("horizon", { length: 50 }), // intraday, swing, position
  expiresAt: timestamp("expires_at"),
  dataQuality: integer("data_quality"), // 0-100
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("pair_analyses_pair_idx").on(table.pairId),
  index("pair_analyses_timestamp_idx").on(table.timestamp),
  index("pair_analyses_signal_idx").on(table.signal),
]);

export const tradingSignals = pgTable("trading_signals", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").references(() => pairAnalyses.id, { onDelete: "cascade" }).notNull(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  signal: signalTypeEnum("signal").notNull(),
  entryPrice: decimal("entry_price", { precision: 20, scale: 10 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 20, scale: 10 }).notNull(),
  takeProfit: decimal("take_profit", { precision: 20, scale: 10 }).notNull(),
  riskRewardRatio: decimal("risk_reward_ratio", { precision: 5, scale: 2 }).notNull(),
  confidence: integer("confidence").notNull(),
  isActive: boolean("is_active").default(true),
  outcome: varchar("outcome", { length: 20 }), // win, loss, breakeven, expired
  actualExitPrice: decimal("actual_exit_price", { precision: 20, scale: 10 }),
  pnlPips: decimal("pnl_pips", { precision: 10, scale: 2 }),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("signals_pair_idx").on(table.pairId),
  index("signals_active_idx").on(table.isActive),
  index("signals_created_idx").on(table.createdAt),
]);

// ==================== ALERTS ====================

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  alertType: varchar("alert_type", { length: 50 }).notNull(),
  condition: jsonb("condition").notNull(),
  channels: jsonb("channels").$type<string[]>().notNull(),
  status: alertStatusEnum("status").default("active").notNull(),
  triggeredAt: timestamp("triggered_at"),
  triggerCount: integer("trigger_count").default(0),
  maxTriggers: integer("max_triggers"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("alerts_user_idx").on(table.userId),
  index("alerts_pair_idx").on(table.pairId),
  index("alerts_status_idx").on(table.status),
]);

export const alertHistory = pgTable("alert_history", {
  id: serial("id").primaryKey(),
  alertId: integer("alert_id").references(() => alerts.id, { onDelete: "cascade" }).notNull(),
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
  triggerValue: jsonb("trigger_value"),
  notificationsSent: jsonb("notifications_sent"),
});

// ==================== WATCHLIST ====================

export const watchlists = pgTable("watchlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("watchlists_user_idx").on(table.userId),
]);

export const watchlistItems = pgTable("watchlist_items", {
  id: serial("id").primaryKey(),
  watchlistId: integer("watchlist_id").references(() => watchlists.id, { onDelete: "cascade" }).notNull(),
  pairId: integer("pair_id").references(() => forexPairs.id, { onDelete: "cascade" }).notNull(),
  sortOrder: integer("sort_order").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("watchlist_items_unique_idx").on(table.watchlistId, table.pairId),
]);

// ==================== BACKTESTING ====================

export const backtestRuns = pgTable("backtest_runs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  pairId: integer("pair_id").references(() => forexPairs.id),
  timeframe: timeframeEnum("timeframe"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  strategyConfig: jsonb("strategy_config").notNull(),
  
  // Results
  totalTrades: integer("total_trades"),
  winningTrades: integer("winning_trades"),
  losingTrades: integer("losing_trades"),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  profitFactor: decimal("profit_factor", { precision: 10, scale: 4 }),
  expectancy: decimal("expectancy", { precision: 10, scale: 4 }),
  maxDrawdown: decimal("max_drawdown", { precision: 10, scale: 4 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 10, scale: 4 }),
  sortinoRatio: decimal("sortino_ratio", { precision: 10, scale: 4 }),
  totalPnl: decimal("total_pnl", { precision: 20, scale: 4 }),
  
  status: varchar("status", { length: 20 }).default("pending"),
  error: text("error"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("backtest_runs_user_idx").on(table.userId),
  index("backtest_runs_status_idx").on(table.status),
]);

export const backtestTrades = pgTable("backtest_trades", {
  id: serial("id").primaryKey(),
  runId: integer("run_id").references(() => backtestRuns.id, { onDelete: "cascade" }).notNull(),
  tradeNumber: integer("trade_number").notNull(),
  direction: varchar("direction", { length: 10 }).notNull(), // long, short
  entryTime: timestamp("entry_time").notNull(),
  entryPrice: decimal("entry_price", { precision: 20, scale: 10 }).notNull(),
  exitTime: timestamp("exit_time").notNull(),
  exitPrice: decimal("exit_price", { precision: 20, scale: 10 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 20, scale: 10 }),
  takeProfit: decimal("take_profit", { precision: 20, scale: 10 }),
  pnlPips: decimal("pnl_pips", { precision: 10, scale: 2 }).notNull(),
  pnlPercent: decimal("pnl_percent", { precision: 10, scale: 4 }),
  outcome: varchar("outcome", { length: 20 }).notNull(),
  signalStrength: integer("signal_strength"),
  signalConfidence: integer("signal_confidence"),
}, (table) => [
  index("backtest_trades_run_idx").on(table.runId),
]);

// ==================== DATA SOURCES ====================

export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(), // market_data, news, economic_calendar
  baseUrl: text("base_url"),
  status: dataSourceStatusEnum("status").default("active"),
  rateLimitPerMinute: integer("rate_limit_per_minute"),
  lastCheckedAt: timestamp("last_checked_at"),
  lastSuccessAt: timestamp("last_success_at"),
  errorCount: integer("error_count").default(0),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== AUDIT & SYSTEM ====================

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }),
  entityId: integer("entity_id"),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("audit_logs_user_idx").on(table.userId),
  index("audit_logs_action_idx").on(table.action),
  index("audit_logs_created_idx").on(table.createdAt),
]);

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: jsonb("value").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  isPublic: boolean("is_public").default(false),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  alerts: many(alerts),
  watchlists: many(watchlists),
  backtestRuns: many(backtestRuns),
}));

export const forexPairsRelations = relations(forexPairs, ({ many }) => ({
  candles: many(candles),
  currentPrices: many(currentPrices),
  technicalIndicators: many(technicalIndicators),
  analyses: many(pairAnalyses),
  signals: many(tradingSignals),
  alerts: many(alerts),
}));

export const pairAnalysesRelations = relations(pairAnalyses, ({ one, many }) => ({
  pair: one(forexPairs, {
    fields: [pairAnalyses.pairId],
    references: [forexPairs.id],
  }),
  signals: many(tradingSignals),
}));
