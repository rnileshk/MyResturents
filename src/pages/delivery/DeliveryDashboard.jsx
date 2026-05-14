import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import { getAllDeliveries } from "../../api/deliveryApi";

const DeliveryDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await getAllDeliveries();
        setDeliveries(normalizeList(data));
      } catch (err) {
        console.error(err);
        setError("Unable to load delivery dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  if (loading) return <Loader />;

  const total = deliveries.length;
  const assigned = deliveries.filter((d) => d.status === "ASSIGNED").length;
  const outForDelivery = deliveries.filter(
    (d) => d.status === "OUT_FOR_DELIVERY"
  ).length;
  const delivered = deliveries.filter((d) => d.status === "DELIVERED").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track assigned, active, and completed deliveries.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <StatsGrid>
        <DashboardCard title="Total Deliveries" value={total} />
        <DashboardCard title="Assigned" value={assigned} />
        <DashboardCard title="Out For Delivery" value={outForDelivery} />
        <DashboardCard title="Delivered" value={delivered} />
      </StatsGrid>
    </div>
  );
};

export default DeliveryDashboard;