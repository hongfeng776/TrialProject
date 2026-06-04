import { useState } from 'react';
import { MessageSquare, Phone, Mail, Users, MessageCircle, Plus, X, Clock, User } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import type { ReachRecord, ReachType } from '../../types';

const reachTypeConfig: Record<ReachType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  call: { label: '电话', icon: <Phone size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  email: { label: '邮件', icon: <Mail size={14} />, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  meeting: { label: '会议', icon: <Users size={14} />, color: 'text-green-600', bgColor: 'bg-green-100' },
  wechat: { label: '企业微信', icon: <MessageCircle size={14} />, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
};

export function ReachRecords() {
  const { state, dispatch } = useCustomer();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'call' as ReachType,
    content: '',
    operator: '',
    nextStep: '',
  });

  const detail = state.selectedCustomerDetail;

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="text-center text-slate-400">
          <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">请选择客户查看触达记录</p>
        </div>
      </div>
    );
  }

  const { reachRecords, customer } = detail;

  const handleAddRecord = () => {
    if (!newRecord.content.trim()) return;

    const now = new Date();
    const record: ReachRecord = {
      id: `r${Date.now()}`,
      customerId: customer.id,
      type: newRecord.type,
      content: newRecord.content,
      operator: newRecord.operator || '当前用户',
      createdAt: `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      nextStep: newRecord.nextStep || undefined,
    };

    dispatch({ type: 'ADD_RECORD', payload: record });
    setNewRecord({ type: 'call', content: '', operator: '', nextStep: '' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-cyan-500" size={20} />
          <h3 className="font-semibold text-slate-800">触达记录</h3>
          <span className="text-xs bg-cyan-100 text-cyan-600 px-2 py-0.5 rounded-full">
            {reachRecords.length} 条
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600 transition-colors"
        >
          <Plus size={16} />
          记录
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showAddForm && (
          <div className="mb-4 p-4 bg-cyan-50 rounded-lg border border-cyan-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">新增触达记录</span>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                {(Object.keys(reachTypeConfig) as ReachType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewRecord({ ...newRecord, type })}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition-colors ${
                      newRecord.type === type
                        ? `${reachTypeConfig[type].bgColor} ${reachTypeConfig[type].color} font-medium`
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {reachTypeConfig[type].icon}
                    {reachTypeConfig[type].label}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="触达内容详情..."
                value={newRecord.content}
                onChange={(e) => setNewRecord({ ...newRecord, content: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500 resize-none h-24"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="操作人"
                  value={newRecord.operator}
                  onChange={(e) => setNewRecord({ ...newRecord, operator: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="下一步计划（可选）"
                  value={newRecord.nextStep}
                  onChange={(e) => setNewRecord({ ...newRecord, nextStep: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={handleAddRecord}
                className="w-full py-2 bg-cyan-500 text-white text-sm rounded-lg hover:bg-cyan-600 transition-colors"
              >
                保存记录
              </button>
            </div>
          </div>
        )}

        {reachRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <MessageSquare size={40} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">暂无触达记录</p>
            <p className="text-xs mt-1">点击右上角按钮记录第一次触达</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {reachRecords.map((record) => {
                const config = reachTypeConfig[record.type];
                return (
                  <div key={record.id} className="relative pl-10">
                    <div className={`absolute left-0 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${config.color} ${config.bgColor} px-2 py-0.5 rounded`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />
                            {record.createdAt}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <User size={12} />
                          {record.operator}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{record.content}</p>
                      {record.nextStep && (
                        <div className="mt-2 pt-2 border-t border-slate-200">
                          <span className="text-xs text-slate-500">下一步：</span>
                          <span className="text-xs text-slate-600 ml-1">{record.nextStep}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
