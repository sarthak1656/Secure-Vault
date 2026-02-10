import React from 'react';
import Card from '../common/Card';

const StatCard = ({ title, value, icon, color }) => {
  // Map color names to Tailwind classes
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <Card className="flex items-center justify-between transition-transform hover:-translate-y-1">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
        {icon}
      </div>
    </Card>
  );
};

export default StatCard;