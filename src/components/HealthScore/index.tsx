import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Activity } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

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

  const radarData = healthDimensions.map(d => ({
    dimension: d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">健康评分</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreBgColor(customer.healthScore)} flex items-center justify-center shadow-lg`}>
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <span className={`text-3xl font-mono font-bold ${getScoreColor(customer.healthScore)}`}>
                  {customer.healthScore}
                </span>
              </div>
            </div>
            <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
              scoreChange > 0 ? 'bg-green-100 text-green-600' : 
              scoreChange < 0 ? 'bg-red-100 text-red-600' : 
              'bg-slate-100 text-slate-600'
            }`}>
              {scoreChange > 0 ? <TrendingUp size={12} /> : scoreChange < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {scoreChange > 0 ? '+' : ''}{scoreChange}
            </div>
          </div>

          <div className="flex-1">
            <h4 className="text-sm text-slate-500 mb-3">评分构成</h4>
            <div className="space-y-2">
              {healthDimensions.map((dim) => (
                <div key={dim.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-16 truncate">{dim.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${getScoreBgColor(dim.score)}`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono w-8 text-right ${getScoreColor(dim.score)}`}>
                    {dim.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs text-slate-500 mb-2">多维度分析</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="评分"
                    dataKey="score"
                    stroke={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    fill={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="text-xs text-slate-500 mb-2">评分趋势</h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrend}>
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={customer.healthScore < 50 ? '#ef4444' : customer.healthScore < 75 ? '#f59e0b' : '#22c55e'}
                    strokeWidth={2}
                    dot={{ fill: '#fff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
