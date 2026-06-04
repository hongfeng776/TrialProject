import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Activity, Zap, RefreshCw, Headphones, MessageSquare, TrendingUp as Value } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap size={18} />,
  'refresh-cw': <RefreshCw size={18} />,
  headphones: <Headphones size={18} />,
  'message-square': <MessageSquare size={18} />,
  'trending-up': <Value size={18} />,
};

export function HealthScore() {
  const { state } = useCustomer();
  const detail = state.selectedCustomerDetail;

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="text-center text-slate-400">
          <Activity size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">请选择客户查看健康评分</p>
        </div>
      </div>
    );
  }

  const { customer, healthDimensions, scoreTrend } = detail;
  const scoreChange = scoreTrend.length >= 2 
    ? scoreTrend[scoreTrend.length - 1].score - scoreTrend[scoreTrend.length - 2].score
    : 0;

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-red-500';
    if (score < 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score < 50) return 'from-red-500 to-red-400';
    if (score < 75) return 'from-yellow-500 to-orange-400';
    return 'from-green-500 to-emerald-400';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp size={12} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={12} className="text-red-500" />;
    return <Minus size={12} className="text-slate-400" />;
  };

  const radarData = healthDimensions.map(d => ({
    dimension: d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">健康评分</h3>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          scoreChange > 0 ? 'bg-green-100 text-green-600' : 
          scoreChange < 0 ? 'bg-red-100 text-red-600' : 
          'bg-slate-100 text-slate-600'
        }`}>
          {scoreChange > 0 ? <TrendingUp size={12} /> : scoreChange < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          本月 {scoreChange > 0 ? '+' : ''}{scoreChange} 分
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-start gap-6 mb-5">
          <div className="relative flex-shrink-0">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${getScoreBgColor(customer.healthScore)} flex items-center justify-center shadow-xl`}>
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                <div className="text-center">
                  <span className={`text-4xl font-mono font-bold ${getScoreColor(customer.healthScore)}`}>
                    {customer.healthScore}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">/ 100</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
              {customer.healthLevel === 'high-risk' ? '高危' : customer.healthLevel === 'medium-risk' ? '关注' : '健康'}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-700 mb-3">评分维度（权重）</h4>
            <div className="space-y-2.5">
              {healthDimensions.map((dim) => (
                <div key={dim.key} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`p-1 rounded ${getScoreColor(dim.score).replace('text-', 'bg-').replace('500', '100')} ${getScoreColor(dim.score)}`}>
                      {iconMap[dim.icon] || <Activity size={18} />}
                    </span>
                    <span className="text-xs font-medium text-slate-700 flex-1">{dim.name}</span>
                    <span className="text-xs text-slate-400">权重 {(dim.weight * 100).toFixed(0)}%</span>
                    <span className={`text-xs font-mono font-bold ${getScoreColor(dim.score)} w-8 text-right`}>
                      {dim.score}
                    </span>
                    {getTrendIcon(dim.trend)}
                  </div>
                  <div className="ml-8 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getScoreBgColor(dim.score)}`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 ml-8 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {dim.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-slate-600">多维度分析</h4>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#cbd5e1" strokeWidth={0.5} />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ fill: '#64748b', fontSize: 9 }} 
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={false} 
                    axisLine={false} 
                  />
                  <Radar
                    name="评分"
                    dataKey="score"
                    stroke={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    fill={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-medium text-slate-600">评分趋势</h4>
              <span className="text-xs text-slate-400">近5个月</span>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreTrend}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'} 
                        stopOpacity={0.3}
                      />
                      <stop 
                        offset="95%" 
                        stopColor={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'} 
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#64748b', fontSize: 9 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: '#64748b', fontSize: 9 }} 
                    axisLine={false} 
                    tickLine={false} 
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}分`, '健康评分']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    strokeWidth={2.5}
                    fill="url(#colorScore)"
                    dot={{ 
                      fill: '#fff', 
                      stroke: customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e',
                      strokeWidth: 2, 
                      r: 4 
                    }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
