import { useEffect, useState } from "react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StatsGrid from "../../components/dashboard/StatsGrid";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { getAllBills } from "../../api/billingApi";

const BillingDashboard = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getAllBills();
        setBills(normalizeList(data));
      } catch (err) {
        console.error(err);
        setError("Unable to load billing dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) return <Loader />;

  const totalBills = bills.length;
  const totalRevenue = bills.reduce(
    (sum, bill) => sum + Number(bill.totalAmount || 0),
    0
  );

  const pendingBills = bills.filter(
    (bill) => bill.paymentStatus === "PENDING"
  ).length;

  const paidBills = bills.filter(
    (bill) => bill.paymentStatus === "SUCCESS"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track restaurant billing and payment status.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}

      <StatsGrid>
        <DashboardCard title="Total Bills" value={totalBills} />
        <DashboardCard title="Total Revenue" value={`₹ ${totalRevenue}`} />
        <DashboardCard title="Pending Bills" value={pendingBills} />
        <DashboardCard title="Paid Bills" value={paidBills} />
      </StatsGrid>
    </div>
  );
};

export default BillingDashboard;