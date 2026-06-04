import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { customers, getCustomerDetail } from '../data/mockData';
import type { Customer, CustomerDetail, Task, ReachRecord } from '../types';

interface State {
  customers: Customer[];
  selectedCustomerId: string | null;
  selectedCustomerDetail: CustomerDetail | null;
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

const initialState: State = {
  customers,
  selectedCustomerId: customers[0]?.id || null,
  selectedCustomerDetail: customers[0] ? getCustomerDetail(customers[0].id) : null,
  filterLevel: 'all',
  searchQuery: '',
};

function customerReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_CUSTOMER':
      return {
        ...state,
        selectedCustomerId: action.payload,
        selectedCustomerDetail: action.payload ? getCustomerDetail(action.payload) : null,
      };
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
    case 'ADD_TASK':
      if (!state.selectedCustomerDetail) return state;
      return {
        ...state,
        selectedCustomerDetail: {
          ...state.selectedCustomerDetail,
          tasks: [action.payload, ...state.selectedCustomerDetail.tasks],
        },
      };
    case 'UPDATE_TASK':
      if (!state.selectedCustomerDetail) return state;
      return {
        ...state,
        selectedCustomerDetail: {
          ...state.selectedCustomerDetail,
          tasks: state.selectedCustomerDetail.tasks.map(t =>
            t.id === action.payload.id ? action.payload : t
          ),
        },
      };
    case 'ADD_RECORD':
      if (!state.selectedCustomerDetail) return state;
      return {
        ...state,
        selectedCustomerDetail: {
          ...state.selectedCustomerDetail,
          reachRecords: [action.payload, ...state.selectedCustomerDetail.reachRecords],
        },
      };
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
