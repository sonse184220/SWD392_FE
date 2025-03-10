import React from "react";

const CardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold">Total Tourists</h2>
        <p className="text-2xl font-bold">18M</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold">Total Revenue</h2>
        <p className="text-2xl font-bold">$30B</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h2 className="text-lg font-semibold">Popular Destinations</h2>
        <p className="text-2xl font-bold">50+</p>
      </div>
    </div>
  );
};

export default CardStats;
