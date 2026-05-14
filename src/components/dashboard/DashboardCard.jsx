import { ArrowUpRight } from "lucide-react";

const DashboardCard = ({
  title = "Title",
  value = "0",
  icon: Icon,
  description = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </h2>

          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
          {Icon ? <Icon size={24} /> : <ArrowUpRight size={24} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;