import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import { getAllBills } from "../../api/billingApi";

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllBills();
      setBills(normalizeList(data));
    } catch (err) {
      console.error(err);
      setError("Unable to load bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Billing List</h1>
          <p className="text-gray-600 mt-1">
            View all generated order and booking bills.
          </p>
        </div>

        <button
          onClick={fetchBills}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Bill ID</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Booking</th>
              <th className="p-3 text-left">Subtotal</th>
              <th className="p-3 text-left">Tax</th>
              <th className="p-3 text-left">Delivery</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Generated</th>
            </tr>
          </thead>

          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No bills found.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="border-t">
                  <td className="p-3">{bill.id}</td>
                  <td className="p-3">
                    {bill.order?.orderCode || bill.order?.id || "N/A"}
                  </td>
                  <td className="p-3">
                    {bill.booking?.bookingCode || bill.booking?.id || "N/A"}
                  </td>
                  <td className="p-3">₹ {bill.subtotal ?? 0}</td>
                  <td className="p-3">₹ {bill.tax ?? 0}</td>
                  <td className="p-3">₹ {bill.deliveryCharge ?? 0}</td>
                  <td className="p-3 font-bold">₹ {bill.totalAmount ?? 0}</td>
                  <td className="p-3">
                    <StatusBadge status={bill.paymentStatus || "PENDING"} />
                  </td>
                  <td className="p-3">
                    {bill.generatedAt
                      ? new Date(bill.generatedAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillingList;