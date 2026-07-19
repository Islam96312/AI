"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, SignalBadge } from "@/components/ui/Badge";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { FOREX_PAIRS } from "@/lib/constants";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  FileSpreadsheet,
  File,
  Eye,
  Trash2,
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "daily" | "weekly" | "custom";
  pair?: string;
  createdAt: Date;
  format: "pdf" | "excel" | "csv";
  size: string;
}

const demoReports: Report[] = [
  {
    id: "1",
    name: "Daily Analysis - EUR/USD",
    type: "daily",
    pair: "EUR/USD",
    createdAt: new Date(),
    format: "pdf",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Weekly Market Overview",
    type: "weekly",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    format: "pdf",
    size: "5.1 MB",
  },
  {
    id: "3",
    name: "Technical Indicators Export",
    type: "custom",
    pair: "GBP/USD",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    format: "excel",
    size: "1.8 MB",
  },
  {
    id: "4",
    name: "Signal History - All Pairs",
    type: "custom",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    format: "csv",
    size: "856 KB",
  },
];

export default function ReportsPage() {
  const { t } = useApp();
  const [reports, setReports] = useState<Report[]>(demoReports);
  const [selectedPair, setSelectedPair] = useState<string>("EUR/USD");
  const [reportType, setReportType] = useState<string>("daily");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analysis - ${selectedPair}`,
        type: reportType as Report["type"],
        pair: selectedPair,
        createdAt: new Date(),
        format: "pdf",
        size: "2.1 MB",
      };
      setReports((prev) => [newReport, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "pdf":
        return <File className="h-5 w-5 text-red-500" />;
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "csv":
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-6 w-6" />
            {t("nav.reports")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Generate and download analysis reports
          </p>
        </div>

        {/* Generate Report */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <option value="daily">Daily Analysis</option>
                  <option value="weekly">Weekly Overview</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency Pair
                </label>
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  {FOREX_PAIRS.map((pair) => (
                    <option key={pair.symbol} value={pair.symbol}>
                      {pair.symbol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateReport}
                  isLoading={isGenerating}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Report Contents Preview */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Report Contents:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {[
                  "Executive Summary",
                  "Technical Analysis",
                  "Fundamental Analysis",
                  "News & Sentiment",
                  "Multi-Timeframe View",
                  "Support & Resistance",
                  "Signal Explanation",
                  "Risk Assessment",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Badge variant="info">{reports.length} reports</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No reports generated yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getFormatIcon(report.format)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {report.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.createdAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {report.createdAt.toLocaleTimeString()}
                          </span>
                          <Badge variant="default">{report.format.toUpperCase()}</Badge>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                <File className="h-8 w-8 text-red-500 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">
                  Export as PDF
                </div>
                <div className="text-sm text-gray-500">
                  Full formatted report
                </div>
              </button>
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                <FileSpreadsheet className="h-8 w-8 text-green-500 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">
                  Export as Excel
                </div>
                <div className="text-sm text-gray-500">
                  Spreadsheet with charts
                </div>
              </button>
              <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
                <FileText className="h-8 w-8 text-blue-500 mb-2" />
                <div className="font-medium text-gray-900 dark:text-white">
                  Export as CSV
                </div>
                <div className="text-sm text-gray-500">
                  Raw data export
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
