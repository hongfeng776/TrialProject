import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { customers, getCustomerDetail } from '../data/mockData';
import type { Customer, CustomerDetail, Task, ReachRecord } from '../types';

function buildComputedCustomers(): Customer[] {
  return customers.map(c => {
    const detail = getCustomerDetail(c.id);
    if (!detail) return c;
    return detail.customer;
  });
}

const computedCustomers = buildComputedCustomers();

interface State {
  customers: Customer[];
  selectedCustomerId: string | null;
  selectedCustomerDetail: CustomerDetail | null;
  tasksStore: Record<string, Task[]>;
  recordsStore: Record<string, ReachRecord[]>;
  filterLevel: 'all' | 'high-risk' | 'medium-risk' | 'healthy';
  searchQuery: string;
}

type Action =
  | { type: 'SELECT_CUSTOMER'; payload: string | null }
  | { type: 'SET_FILTER_LEVEL'; payload: 'all' | 'high-risk' | 'medium-risk' | 'healthy' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'ADD_RECORD'; payload: ReachRecord };

function buildInitialStores(): { tasksStore: Record<string, Task[]>; recordsStore: Record<string, ReachRecord[]> } {
  const tasksStore: Record<string, Task[]> = {};
  const recordsStore: Record<string, ReachRecord[]> = {};
  for (const c of computedCustomers) {
    const detail = getCustomerDetail(c.id);
    if (detail) {
      tasksStore[c.id] = [...detail.tasks];
      recordsStore[c.id] = [...detail.reachRecords];
    }
  }
  return { tasksStore, recordsStore };
}

const { tasksStore: initTasksStore, recordsStore: initRecordsStore } = buildInitialStores();

function buildDetail(
  customerId: string,
  tasksStore: Record<string, Task[]>,
  recordsStore: Record<string, ReachRecord[]>,
): CustomerDetail | null {
  const base = getCustomerDetail(customerId);
  if (!base) return null;
  return {
    ...base,
    tasks: tasksStore[customerId] ?? base.tasks,
    reachRecords: recordsStore[customerId] ?? base.reachRecords,
  };
}

const initialState: State = {
  customers: computedCustomers,
  selectedCustomerId: computedCustomers[0]?.id || null,
  selectedCustomerDetail: computedCustomers[0] ? buildDetail(computedCustomers[0].id, initTasksStore, initRecordsStore) : null,
  tasksStore: initTasksStore,
  recordsStore: initRecordsStore,
  filterLevel: 'all',
  searchQuery: '',
};

function customerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_CUSTOMER': {
      const detail = action.payload
        ? buildDetail(action.payload, state.tasksStore, state.recordsStore)
        : null;
      return {
        ...state,
        selectedCustomerId: action.payload,
        selectedCustomerDetail: detail,
      };
    }
    case 'SET_FILTER_LEVEL':
      return {
        ...state,
        filterLevel: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'ADD_TASK': {
      if (!state.selectedCustomerId) return state;
      const cid = state.selectedCustomerId;
      const updatedStore = {
        ...state.tasksStore,
        [cid]: [action.payload, ...(state.tasksStore[cid] ?? [])],
      };
      return {
        ...state,
        tasksStore: updatedStore,
        selectedCustomerDetail: state.selectedCustomerDetail
          ? { ...state.selectedCustomerDetail, tasks: updatedStore[cid] }
          : null,
      };
    }
    case 'UPDATE_TASK': {
      if (!state.selectedCustomerId) return state;
      const cid = state.selectedCustomerId;
      const updatedStore = {
        ...state.tasksStore,
        [cid]: (state.tasksStore[cid] ?? []).map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
      return {
        ...state,
        tasksStore: updatedStore,
        selectedCustomerDetail: state.selectedCustomerDetail
          ? { ...state.selectedCustomerDetail, tasks: updatedStore[cid] }
          : null,
      };
    }
    case 'ADD_RECORD': {
      if (!state.selectedCustomerId) return state;
      const cid = state.selectedCustomerId;
      const updatedStore = {
        ...state.recordsStore,
        [cid]: [action.payload, ...(state.recordsStore[cid] ?? [])],
      };
      return {
        ...state,
        recordsStore: updatedStore,
        selectedCustomerDetail: state.selectedCustomerDetail
          ? { ...state.selectedCustomerDetail, reachRecords: updatedStore[cid] }
          : null,
      };
    }
    default:
      return state;
  }
}

interface CustomerContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
  filteredCustomers: Customer[];
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  const filteredCustomers = state.customers.filter(customer => {
    const matchesLevel = state.filterLevel === 'all' || customer.healthLevel === state.filterLevel;
    const matchesSearch = customer.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <CustomerContext.Provider value={{ state, dispatch, filteredCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
