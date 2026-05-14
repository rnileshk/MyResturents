import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import StatusBadge from "../../components/common/StatusBadge";
import {
  getAllPayments,
  updatePaymentStatus,
} from "../../api/paymentApi";

const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const getStatus = (payment) => {
    return payment.paymentStatus || payment.status || "PENDING";
  };

  const getAmount = (payment) => {
    return payment.amount ?? payment.totalAmount ?? payment.order?.totalAmount ?? 0;
  };

  const getTransactionId = (payment) => {
    return payment.transactionId || payment.paymentId || "N/A";
  };

  const getOrderCode = (payment) => {
    return payment.order?.orderCode || payment.orderId || "N/A";
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getAllPayments();
      setPayments(normalizeList(data));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await updatePaymentStatus(id, status);

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? { ...payment, paymentStatus: status, status }
            : payment
        )
      );

      setSuccess("Payment status updated successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to update payment status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const totalRevenue = payments.reduce((total, payment) => {
    const status = getStatus(payment);
    if (status !== "SUCCESS") return total;
    return total + Number(getAmount(payment) || 0);
  }, 0);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white/10 border border-white/10 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <p className="text-orange-300 font-semibold uppercase text-sm tracking-wide">
                Payment Command
              </p>

              <h1 className="text-4xl md:text-5xl font-black text-white mt-2">
                Manage Payments
              </h1>

              <p className="text-slate-300 mt-3">
                Monitor transactions, update payment status and track successful revenue.
              </p>
            </div>

            <button
              onClick={fetchPayments}
              className="bg-white text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-orange-100 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Total Payments</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              {payments.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Success</p>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">
              {payments.filter((payment) => getStatus(payment) === "SUCCESS").length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Pending</p>
            <h2 className="text-4xl font-black text-orange-600 mt-2">
              {payments.filter((payment) => getStatus(payment) === "PENDING").length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-2xl">
            <p className="text-slate-500 font-semibold">Revenue</p>
            <h2 className="text-4xl font-black text-slate-900 mt-2">
              ₹ {totalRevenue}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-black text-slate-900">
              Payment Records
            </h2>
            <p className="text-slate-500">
              Total payments: {payments.length}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Transaction</th>
                  <th className="p-4 text-left">Order</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Update</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-6 text-center text-slate-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => {
                    const currentStatus = getStatus(payment);

                    return (
                      <tr
                        key={payment.id}
                        className="border-t hover:bg-orange-50 transition"
                      >
                        <td className="p-4 font-semibold">{payment.id}</td>

                        <td className="p-4">{getTransactionId(payment)}</td>

                        <td className="p-4">{getOrderCode(payment)}</td>

                        <td className="p-4 font-bold">
                          ₹ {getAmount(payment)}
                        </td>

                        <td className="p-4">
                          <StatusBadge status={currentStatus} />
                        </td>

                        <td className="p-4">
                          <select
                            value={currentStatus}
                            disabled={updatingId === payment.id}
                            onChange={(e) =>
                              handleStatusChange(payment.id, e.target.value)
                            }
                            className="border border-slate-300 p-2 rounded-xl disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleViewPayment(payment)}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showViewModal && selectedPayment && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedPayment(null);
                }}
                className="absolute top-4 right-5 text-2xl text-slate-500 hover:text-red-600"
              >
                ×
              </button>

              <h2 className="text-3xl font-black text-slate-900">
                Payment Details
              </h2>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Payment ID</p>
                  <p className="font-bold">{selectedPayment.id}</p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Transaction</p>
                  <p className="font-bold">
                    {getTransactionId(selectedPayment)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Order</p>
                  <p className="font-bold">
                    {getOrderCode(selectedPayment)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Amount</p>
                  <p className="font-bold">
                    ₹ {getAmount(selectedPayment)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Status</p>
                  <p className="font-bold">
                    {getStatus(selectedPayment)}
                  </p>
                </div>

                <div className="bg-slate-100 p-4 rounded-2xl">
                  <p className="text-slate-500 text-sm">Method</p>
                  <p className="font-bold">
                    {selectedPayment.paymentMethod ||
                      selectedPayment.method ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPayment(null);
                  }}
                  className="bg-slate-200 text-slate-900 px-5 py-3 rounded-2xl font-bold hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePayments;