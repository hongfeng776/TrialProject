import { Building2, Calendar, DollarSign, User, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export function CustomerHeader() {
  const { state } = useCustomer();
  const detail = state.selectedCustomerDetail;

  if (!detail) {
    return (
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-center h-20 text-slate-400">
          <p className="text-sm">请从左侧列表选择客户</p>
        </div>
      </div>
    );
  }

  const { customer, riskRules, scoreTrend } = detail;

  const scoreChange = scoreTrend.length >= 2 
    ? scoreTrend[scoreTrend.length - 1].score - scoreTrend[scoreTrend.length - 2].score
    : 0;

  const criticalCount = riskRules.filter(r => r.severity === 'critical').length;
  const warningCount = riskRules.filter(r => r.severity === 'warning').length;

  const getHealthLevelText = () => {
    switch (customer.healthLevel) {
      case 'high-risk': return '高危客户';
      case 'medium-risk': return '关注客户';
      case 'healthy': return '健康客户';
      default: return '';
    }
  };

  const getHealthLevelColor = () => {
    switch (customer.healthLevel) {
      case 'high-risk': return 'from-red-500 to-red-600';
      case 'medium-risk': return 'from-yellow-500 to-orange-500';
      case 'healthy': return 'from-green-500 to-emerald-500';
      default: return '';
    }
  };

  const getHealthLevelIcon = () => {
    switch (customer.healthLevel) {
      case 'high-risk': return <AlertTriangle size={14} />;
      case 'medium-risk': return <AlertCircle size={14} />;
      case 'healthy': return <CheckCircle2 size={14} />;
      default: return null;
    }
  };

  const getDaysToRenewal = () => {
    const renewal = new Date(customer.renewalDate);
    const today = new Date();
    const diff = Math.ceil((renewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysToRenewal = getDaysToRenewal();

  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex items-center gap-5">
        <div className="relative">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-white/20"
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${getHealthLevelColor()} border-2 border-slate-800 flex items-center justify-center`}>
            <span className="text-white text-xs">{getHealthLevelIcon()}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getHealthLevelColor()} font-medium flex items-center gap-1`}>
              {getHealthLevelIcon()}
              {getHealthLevelText()}
            </span>
            
            {criticalCount > 0 && (
              <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-300 px-2.5 py-1 rounded-full border border-red-500/30">
                <AlertTriangle size={12} />
                {criticalCount} 紧急
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-500/30">
                <AlertCircle size={12} />
                {warningCount} 警告
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Building2 size={14} />
            <span>{customer.company}</span>
            <span className="text-slate-500">|</span>
            <span>{customer.industry}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-400" />
              <span className="text-sm">
                合同金额: <span className="font-semibold text-emerald-400">¥{(customer.contractValue / 10000).toFixed(0)}万</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className={daysToRenewal <= 30 ? 'text-red-400' : 'text-cyan-400'} />
              <span className="text-sm">
                续约: <span className={`font-semibold ${daysToRenewal <= 30 ? 'text-red-400' : 'text-cyan-400'}`}>
                  {customer.renewalDate} ({daysToRenewal > 0 ? `还有${daysToRenewal}天` : '已到期'})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-purple-400" />
              <span className="text-sm">
                最近联系: <span className="font-semibold text-purple-400">{customer.lastContact}</span>
              </span>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              scoreChange > 0 ? 'bg-green-500/20 text-green-300' : 
              scoreChange < 0 ? 'bg-red-500/20 text-red-300' : 
              'bg-slate-600/50 text-slate-300'
            }`}>
              {scoreChange > 0 ? <TrendingUp size={14} /> : scoreChange < 0 ? <TrendingDown size={14} /> : null}
              <span className="text-xs font-medium">
                {scoreChange > 0 ? '+' : ''}{scoreChange}分 / 月
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="relative">
            <div className={`text-5xl font-mono font-bold bg-gradient-to-r ${getHealthLevelColor()} bg-clip-text text-transparent`}>
              {customer.healthScore}
            </div>
            <div className="w-full h-1.5 bg-slate-600 rounded-full mt-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getHealthLevelColor()} rounded-full transition-all duration-500`}
                style={{ width: `${customer.healthScore}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">健康评分</p>
        </div>
      </div>
    </div>
  );
}
