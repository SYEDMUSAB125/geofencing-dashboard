export default function Header({ toggleDrawer }) {
    return (
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md text-white">
        <button onClick={toggleDrawer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Firebase Coordinate Manager</h1>
      </header>
    );
  }
  