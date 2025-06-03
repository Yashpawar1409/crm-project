"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import useFetchCampaignData from "@/hooks/fetchCampaignData";
import { Badge } from "../ui/badge";
import { BarChart } from "@tremor/react";
import { useState } from "react";

const LatestCampaigns = () => {
  const { data, loading, error } = useFetchCampaignData();
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shop data.</div>;
  }

  const sentCount = data!.filter((item) => item.status === "SENT").length;
  const failedCount = data!.filter((item) => item.status === "FAILED").length;

  const chartdata = [
    {
      name: "Sent",
      "Audience size": sentCount,
    },
    {
      name: "Failed",
      "Audience size": failedCount,
    },
  ];

  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const generateSummary = async () => {
    setIsGenerating(true);
    setSummaryError("");
    try {
      const stats = {
        total: data!.length,
        sent: sentCount,
        failed: failedCount,
        deliveryRate: (sentCount / data!.length * 100).toFixed(1),
        topPerformers: data!
          .filter(item => item.status === "SENT")
          .slice(0, 3)
          .map(item => item.custName)
      };
      
      const response = await fetch("http://localhost:8000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignStats: stats }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      setSummary(result.summary);
    } catch (err) {
      console.error("Summary generation error:", err);
      setSummaryError("Failed to generate insights. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-8">
      <Table>
        <TableCaption>A list of your recent campaign messages.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data!.length > 0 ? (
            data!.toReversed().map((item, id) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{item.custName}</TableCell>
                <TableCell>{item.custEmail}</TableCell>
                <TableCell>
                  <Badge
                    className={`${item.status == "FAILED" ? "bg-red-400 bg-opacity-40" : "bg-green-400 bg-opacity-40"}`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No campaign data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="mb-4 mt-8 md:text-3xl text-xl">Delivery Stats</div>
      <div className="w-full">
        <BarChart
          className="mt-6"
          data={chartdata}
          index="name"
          categories={["Audience size"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={48}
        />

        <div className="mt-6 space-y-4">
          <button
            onClick={generateSummary}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md text-white ${isGenerating ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isGenerating ? 'Generating Insights...' : 'Generate AI Insights'}
          </button>

          {summaryError && (
            <div className="text-red-500 p-2 bg-red-50 rounded-md">
              {summaryError}
            </div>
          )}

          {summary && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-lg mb-2 text-blue-800">AI Campaign Analysis</h3>
              <p className="text-gray-700 whitespace-pre-line">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestCampaigns;