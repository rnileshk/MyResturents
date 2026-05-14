import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { deleteBill, getAllBills } from "../../api/billingApi";

const ManageBills = () => {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const getOrderCode = (bill) => {
    return bill.order?.orderCode || bill.foodOrder?.orderCode || bill.orderId || "N/A";
  };

  const getTotalAmount = (bill) => {
    return bill.totalAmount ?? bill.grandTotal ?? bill.amount ?? 0;
  };

  const getCreatedDate = (bill) => {
    return bill.createdAt || bill.billDate || "N/A";
  };

  const getCustomer = (bill) => {
    return (
      bill.customerName ||
      bill.order?.user?.name ||
      bill.order?.user?.email ||
      bill.foodOrder?.user?.name ||
      bill.foodOrder?.user?.email ||
      "N/A"
    );
  };

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getAllBills();
      setBills(normalizeList(data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load bills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteBill(id);

      setBills((prev) => prev.filter((bill) => bill.id !== id));
      setSuccess("Bill deleted successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete bill."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowViewModal(true);
  };

  const totalBillingAmount = bills.reduce(
    (total, bill) => total + Number(getTotalAmount(bill) || 0),
    0
  );

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Billing Command
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Bills
              </h1>

              <p className="text-slate-300 mt-3">
                View, inspect, and delete generated restaurant bills.
              </p>
            </div>

            <button
              onClick={fetchBills}
              className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Bills</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {bills.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Billing Amount</p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              ₹ {totalBillingAmount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Latest Bill</p>
            <h2 className="text-4xl font-black text-orange-600 mt-2">
              {bills[0]?.id ? `#${bills[0].id}` : "N/A"}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black text-slate-900">
              Bill Records
            </h2>
            <p className="text-slate-500">Total bills: {bills.length}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Bill ID</th>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Created</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {bills.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500">
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  bills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-t hover:bg-orange-50 transition"
                    >
                      <td className="p-4 font-semibold">#{bill.id}</td>

                      <td className="p-4">{getOrderCode(bill)}</td>

                      <td className="p-4">{getCustomer(bill)}</td>

                      <td className="p-4 font-bold">
                        ₹ {getTotalAmount(bill)}
                      </td>

                      <td className="p-4">{getCreatedDate(bill)}</td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewBill(bill)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(bill.id)}
                            disabled={deletingId === bill.id}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-60"
                          >
                            {deletingId === bill.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showViewModal && selectedBill && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedBill(null);
                }}
                className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-3xl font-black text-slate-900">
                Bill Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Bill ID</p>
                  <p className="font-bold">#{selectedBill.id}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Order</p>
                  <p className="font-bold">{getOrderCode(selectedBill)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Customer</p>
                  <p className="font-bold">{getCustomer(selectedBill)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Total Amount</p>
                  <p className="font-bold">₹ {getTotalAmount(selectedBill)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Created</p>
                  <p className="font-bold">{getCreatedDate(selectedBill)}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Payment</p>
                  <p className="font-bold">
                    {selectedBill.paymentStatus ||
                      selectedBill.payment?.status ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedBill(null);
                  }}
                  className="bg-slate-200 text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-slate-300"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDelete(selectedBill.id)}
                  className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-red-700"
                >
                  Delete Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBills;