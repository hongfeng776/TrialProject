import { Building2, Calendar, DollarSign, User } from 'lucide-react';
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

  const { customer } = detail;

  const getHealthLevelText = () => {
    switch (customer.healthLevel) {
      case 'high-risk': return '高危客户';
      case 'medium-risk': return '中危客户';
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

  return (
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative flex items-center gap-5">
        <div className="relative">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${getHealthLevelColor()} border-2 border-slate-800`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold">{customer.name}</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${getHealthLevelColor()} font-medium`}>
              {getHealthLevelText()}
            </span>
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
              <Calendar size={14} className="text-cyan-400" />
              <span className="text-sm">
                续约日期: <span className="font-semibold text-cyan-400">{customer.renewalDate}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-purple-400" />
              <span className="text-sm">
                最近联系: <span className="font-semibold text-purple-400">{customer.lastContact}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className={`text-4xl font-mono font-bold bg-gradient-to-r ${getHealthLevelColor()} bg-clip-text text-transparent`}>
            {customer.healthScore}
          </div>
          <p className="text-xs text-slate-400 mt-1">健康评分</p>
        </div>
      </div>
    </div>
  );
}
