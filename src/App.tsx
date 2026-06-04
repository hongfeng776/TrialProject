import { CustomerProvider } from './context/CustomerContext';
import { CustomerList } from './components/CustomerList';
import { CustomerHeader } from './components/CustomerHeader';
import { HealthScore } from './components/HealthScore';
import { Tasks } from './components/Tasks';
import { ReachRecords } from './components/ReachRecords';
import { RiskAlerts } from './components/RiskAlerts';

function App() {
  return (
    <CustomerProvider>
      <div className="h-screen w-screen bg-slate-100 flex overflow-hidden">
        <div className="w-72 flex-shrink-0">
          <CustomerList />
        </div>

        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="mb-4 flex-shrink-0">
            <CustomerHeader />
          </div>

          <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-4 min-h-0">
            <div className="col-span-2 row-span-1 min-h-0">
              <HealthScore />
            </div>

            <div className="col-span-1 row-span-2 min-h-0">
              <Tasks />
            </div>

            <div className="col-span-1 row-span-1 min-h-0">
              <ReachRecords />
            </div>

            <div className="col-span-1 row-span-1 min-h-0">
              <RiskAlerts />
            </div>
          </div>
        </div>
      </div>
    </CustomerProvider>
  );
}

export default App;
