import { Search, Users } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import type { HealthLevel } from '../../types';

const healthLevelConfig: Record<HealthLevel, { label: string; color: string; bgColor: string }> = {
  'high-risk': { label: '高危', color: 'text-red-500', bgColor: 'bg-red-100' },
  'medium-risk': { label: '中危', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  'healthy': { label: '健康', color: 'text-green-500', bgColor: 'bg-green-100' },
};

const filterTabs: { key: 'all' | HealthLevel; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'high-risk', label: '高危' },
  { key: 'medium-risk', label: '中危' },
  { key: 'healthy', label: '健康' },
];

export function CustomerList() {
  const { state, dispatch, filteredCustomers } = useCustomer();

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold">客户健康度</h1>
            <p className="text-xs text-slate-400">共 {state.customers.length} 位客户</p>
          </div>
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索客户名称或公司..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => dispatch({ type: 'SET_FILTER_LEVEL', payload: tab.key })}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                state.filterLevel === tab.key
                  ? 'bg-blue-500 text-white font-medium'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredCustomers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
            <Users size={48} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">暂无匹配的客户</p>
            <p className="text-xs mt-1">请尝试调整筛选条件</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredCustomers.map((customer) => {
              const levelConfig = healthLevelConfig[customer.healthLevel];
              const isSelected = state.selectedCustomerId === customer.id;

              return (
                <div
                  key={customer.id}
                  onClick={() => dispatch({ type: 'SELECT_CUSTOMER', payload: customer.id })}
                  className={`p-3 rounded-lg cursor-pointer transition-all mb-2 ${
                    isSelected
                      ? 'bg-blue-500/20 border border-blue-500/50'
                      : 'hover:bg-slate-700/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{customer.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelConfig.bgColor} ${levelConfig.color}`}>
                          {levelConfig.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{customer.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-mono font-bold ${levelConfig.color}`}>
                        {customer.healthScore}
                      </span>
                      <div className="w-20 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            customer.healthLevel === 'high-risk'
                              ? 'bg-red-500'
                              : customer.healthLevel === 'medium-risk'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${customer.healthScore}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      ¥{(customer.contractValue / 10000).toFixed(0)}万
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
