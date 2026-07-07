import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { CATEGORIES } from '../../types';
import type { Expense } from '../../types';
import { formatCurrency } from '../../utils';

interface ChartsProps {
  expenses: Expense[];
}

export const ExpenseCharts: React.FC<ChartsProps> = ({ expenses }) => {
  // 1. Process Monthly Spending Trend (Last 6 Months)
  const getMonthlyTrendData = () => {
    const monthlyTotals: { [key: string]: number } = {};
    const monthsToShow = 6;
    const now = new Date();

    // Initialize last 6 months
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[key] = 0;
    }

    // Accumulate amounts
    expenses.forEach((exp) => {
      const monthKey = exp.date.substring(0, 7); // YYYY-MM
      if (monthKey in monthlyTotals) {
        monthlyTotals[monthKey] += exp.amount;
      }
    });

    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, amount]) => {
        const [year, month] = key.split('-');
        const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);
        const name = dateObj.toLocaleDateString('en-US', { month: 'short' });
        return { name, amount };
      });
  };

  // 2. Process Category Breakdown (All Time or Current Month)
  const getCategoryBreakdownData = () => {
    const categoryTotals: { [key: string]: number } = {};
    
    // Initialize category map
    CATEGORIES.forEach(cat => {
      categoryTotals[cat.id] = 0;
    });

    // Accumulate categories
    expenses.forEach(exp => {
      if (exp.category in categoryTotals) {
        categoryTotals[exp.category] += exp.amount;
      } else {
        categoryTotals['other'] = (categoryTotals['other'] || 0) + exp.amount;
      }
    });

    // Map to recharts data format, filter out empty categories
    return CATEGORIES.map(cat => ({
      name: cat.name,
      value: Number(categoryTotals[cat.id].toFixed(2)),
      color: cat.color
    })).filter(item => item.value > 0);
  };

  const trendData = getMonthlyTrendData();
  const pieData = getCategoryBreakdownData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
      {/* Area Chart: Monthly Trend */}
      <div className="bg-white/80 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Spending Trend</h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Monthly breakdown for the last 6 months</p>
        </div>
        <div className="h-72 w-full mt-2">
          {expenses.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium">
              No transactions recorded
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Donut Chart: Category Breakdown */}
      <div className="bg-white/80 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Category Distribution</h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Expenses grouped by billing category</p>
        </div>
        <div className="h-72 w-full mt-2 flex items-center justify-center">
          {pieData.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-500 text-sm font-medium">
              No transactions recorded
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={50}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value, entry: any) => {
                    const amount = entry.payload.value;
                    return (
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        {value} ({formatCurrency(amount)})
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
