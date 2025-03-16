import React from 'react';

const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={onStartDateChange}
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={onEndDateChange}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;
