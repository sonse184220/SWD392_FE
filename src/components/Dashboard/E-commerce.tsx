"use client";
import dynamic from "next/dynamic";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";

const MapOne = dynamic(() => import("../Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("../Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <div className="dark:bg-gray-800 bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="dark:text-gray-200 text-lg font-semibold">Total Bookings</h2>
          <p className="dark:text-white text-2xl font-bold">12,345</p>
          <span className="text-sm text-green-500">5.67% ↑</span>
        </div>
        <div className="dark:bg-gray-800 bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="dark:text-gray-200 text-lg font-semibold">Revenue</h2>
          <p className="dark:text-white text-2xl font-bold">$98.2K</p>
          <span className="text-sm text-green-500">7.89% ↑</span>
        </div>
        <div className="dark:bg-gray-800 bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="dark:text-gray-200 text-lg font-semibold">Total Destinations</h2>
          <p className="dark:text-white text-2xl font-bold">325</p>
          <span className="text-sm text-green-500">3.45% ↑</span>
        </div>
        <div className="dark:bg-gray-800 bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="dark:text-gray-200 text-lg font-semibold">Active Travelers</h2>
          <p className="dark:text-white text-2xl font-bold">8,765</p>
          <span className="text-sm text-red-500">1.23% ↓</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
};

export default ECommerce;
