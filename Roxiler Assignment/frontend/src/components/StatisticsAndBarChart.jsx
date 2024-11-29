import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsAndBarChart = ({ statistics, barChartData }) => {
  return (
    <div>
      {/* Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Total Sale Amount</h3>
          <p>${statistics.totalSaleAmount || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-bold">Total Sold Items</h3>
          <p>{statistics.soldItems || 0}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-bold">Total Unsold Items</h3>
          <p>{statistics.notSoldItems || 0}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-4">
        <h3 className="font-bold mb-2 text-2xl">Transactions Bar Chart</h3>
        {barChartData.labels ? (
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                },
                title: {
                  display: true,
                  text: "Transaction Price Ranges",
                },
              },
            }}
          />
        ) : (
          <p className="text-gray-500">
            No data available for the selected month and year.
          </p>
        )}
      </div>
    </div>
  );
};

export default StatisticsAndBarChart;
