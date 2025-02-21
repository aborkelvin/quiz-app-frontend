const Navbar = ({ onLogout }:{onLogout:any}) => {
  return (
    <div className="bg-white p-3 fixed top-0 w-full shadow-md flex justify-end z-50">
      <button
        onClick={onLogout}
        className="bg-highlight text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;


