import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, Shield, Lightbulb } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import type { RiskSeverity } from '../../types';

const severityConfig: Record<RiskSeverity, { 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  bgColor: string;
  borderColor: string;
}> = {
  critical: { 
    label: '紧急', 
    icon: <AlertTriangle size={16} />, 
    color: 'text-red-600', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  },
  warning: { 
    label: '警告', 
    icon: <AlertCircle size={16} />, 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  info: { 
    label: '提示', 
    icon: <Info size={16} />, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
};

export function RiskAlerts() {
  const { state } = useCustomer();
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const detail = state.selectedCustomerDetail;

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="text-center text-slate-400">
          <Shield size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">请选择客户查看风险提示</p>
        </div>
      </div>
    );
  }

  const { riskRules } = detail;

  const criticalCount = riskRules.filter(r => r.severity === 'critical').length;
  const warningCount = riskRules.filter(r => r.severity === 'warning').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-orange-500" size={20} />
            <h3 className="font-semibold text-slate-800">风险规则</h3>
          </div>
          {riskRules.length > 0 && (
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={12} />
                  {criticalCount} 紧急
                </span>
              )}
              {warningCount > 0 && (
                <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                  <AlertCircle size={12} />
                  {warningCount} 警告
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {riskRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <Shield size={32} className="text-green-500" />
            </div>
            <p className="text-sm font-medium text-green-600">该客户暂无风险</p>
            <p className="text-xs mt-1">各项指标表现良好</p>
          </div>
        ) : (
          <div className="space-y-3">
            {riskRules.map((rule) => {
              const config = severityConfig[rule.severity];
              const isExpanded = expandedRule === rule.id;

              return (
                <div
                  key={rule.id}
                  className={`rounded-lg border ${config.borderColor} ${config.bgColor} overflow-hidden`}
                >
                  <div
                    className="p-3 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded ${config.color} bg-white/60`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${config.color}`}>
                            {rule.name}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={16} className="text-slate-400" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-white/70 rounded p-3 ml-8">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-xs font-medium text-slate-700">处理建议</span>
                            <p className="text-xs text-slate-600 mt-1">{rule.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
