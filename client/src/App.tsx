import { useState } from 'react';
import AdminAssignment from './components/AdminAssignment';
import Messaging from './components/Messaging';
import Supervisor from './components/Supervisor';
import AdvancedSearch from './components/AdvancedSearch';
import StudentView from './components/Studentview';

// ====================================================================
// MODULE 1: STUDENT & MESSAGING SYSTEM (Bundled Together)
// ====================================================================
// This wrapper handles the logic between Directory and Chat independently.
const StudentMessagingModule = () => {
  const [view, setView] = useState<'directory' | 'chat'>('directory');
  const [chatPartner, setChatPartner] = useState<any>(null);

  const handleChatStart = (facultyUser: any) => {
    setChatPartner(facultyUser);
    setView('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Module Header */}
        <div className="mb-6 flex justify-between items-center border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-blue-900">🎓 Student Portal</h1>
          {view === 'chat' && (
            <button 
              onClick={() => setView('directory')}
              className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1"
            >
              <span>←</span> Back to Directory
            </button>
          )}
        </div>

        {/* View Switcher */}
        {view === 'directory' ? (
           <StudentView onChatStart={handleChatStart} />
        ) : (
           <div className="max-w-4xl mx-auto">
             <Messaging initialPartner={chatPartner} />
           </div>
        )}
      </div>
    </div>
  );
};

// ====================================================================
// MODULE 2: ADMIN MODULE (Assignments)
// ====================================================================
const AdminModule = () => (
  <div className="min-h-screen bg-slate-50 p-6">
    <div className="max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold text-blue-900 mb-6 border-b border-slate-200 pb-4">
         🎓 Admin Dashboard
       </h1>
       <AdminAssignment />
    </div>
  </div>
);

// ====================================================================
// MODULE 3: SUPERVISOR MODULE (Availability & Slots)
// ====================================================================
const SupervisorModule = () => (
  <div className="min-h-screen bg-slate-50 p-6">
    <div className="max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold text-blue-900 mb-6 border-b border-slate-200 pb-4">
         🎓 Supervisor Profile
       </h1>
       <Supervisor />
    </div>
  </div>
);

// ====================================================================
// MODULE 4: SEARCH MODULE (Project Database)
// ====================================================================
const SearchModule = () => (
  <div className="min-h-screen bg-slate-50 p-6">
    <div className="max-w-7xl mx-auto">
       <h1 className="text-2xl font-bold text-blue-900 mb-6 border-b border-slate-200 pb-4">
         🎓 Project Search
       </h1>
       <AdvancedSearch />
    </div>
  </div>
);

// ====================================================================
// MAIN APP COMPONENT (Switcher)
// ====================================================================
function App() {
  
  // 👇👇👇 TEAMMATES: UNCOMMENT THE MODULE YOU ARE WORKING ON 👇👇👇

  //OPTION A: For the Admin Teammate
  return <AdminModule />;

  // OPTION B: For the Student/Messaging Teammate
  //return <StudentMessagingModule />;

  // OPTION C: For the Supervisor Teammate
  //return <SupervisorModule />;

  // OPTION D: For the Search Teammate
  //return <SearchModule />;
}

export default App;