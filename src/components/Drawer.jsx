export default function Drawer({ isOpen, closeDrawer }) {
    return (
      <div
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 w-64 z-10`}
      >
        <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-4 text-gray-700">
          <button className="block w-full text-left hover:bg-indigo-100 p-2 rounded-md">Dashboard</button>
          <button className="block w-full text-left hover:bg-indigo-100 p-2 rounded-md">Manage Users</button>
          <button className="block w-full text-left hover:bg-indigo-100 p-2 rounded-md">Manage Fields</button>
        </nav>
      </div>
    );
  }
  