import { useState } from 'react';
import { CheckSquare, Plus, Calendar, Flag, X, ClipboardList } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';
import type { Task, TaskPriority, TaskStatus } from '../../types';

const priorityConfig: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  high: { label: '高', color: 'text-red-600', bgColor: 'bg-red-50' },
  medium: { label: '中', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  low: { label: '低', color: 'text-green-600', bgColor: 'bg-green-50' },
};

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'text-slate-500' },
  'in-progress': { label: '进行中', color: 'text-blue-600' },
  completed: { label: '已完成', color: 'text-green-600' },
};

export function Tasks() {
  const { state, dispatch } = useCustomer();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    dueDate: '',
  });

  const detail = state.selectedCustomerDetail;

  if (!detail) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="text-center text-slate-400">
          <ClipboardList size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">请选择客户查看跟进任务</p>
        </div>
      </div>
    );
  }

  const { tasks, customer } = detail;

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: `t${Date.now()}`,
      customerId: customer.id,
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      priority: newTask.priority,
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch({ type: 'ADD_TASK', payload: task });
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAddForm(false);
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    dispatch({ type: 'UPDATE_TASK', payload: { ...task, status: newStatus } });
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-blue-500" size={20} />
          <h3 className="font-semibold text-slate-800">跟进任务</h3>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
            {pendingTasks.length} 待处理
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          新增
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showAddForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">新增任务</span>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="任务标题"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="任务描述"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none h-20"
              />
              <div className="flex gap-3">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="high">高优先级</option>
                  <option value="medium">中优先级</option>
                  <option value="low">低优先级</option>
                </select>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleAddTask}
                className="w-full py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                创建任务
              </button>
            </div>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <ClipboardList size={40} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">暂无跟进任务</p>
            <p className="text-xs mt-1">点击右上角按钮创建第一个任务</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => handleStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-800">{task.title}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${priorityConfig[task.priority].bgColor} ${priorityConfig[task.priority].color}`}>
                        <Flag size={10} className="inline mr-0.5" />
                        {priorityConfig[task.priority].label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${statusConfig[task.status].color}`}>
                        {statusConfig[task.status].label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {completedTasks.length > 0 && (
              <>
                <div className="pt-3 mt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">已完成 ({completedTasks.length})</span>
                </div>
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-green-50 rounded-lg border border-green-100 opacity-70"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked
                        onChange={() => handleStatusChange(task, 'pending')}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-slate-500 line-through">{task.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
