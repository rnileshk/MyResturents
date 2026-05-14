const StatsGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {children}
    </div>
  );
};

export default StatsGrid;