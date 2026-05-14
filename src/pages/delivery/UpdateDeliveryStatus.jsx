import { useState } from "react";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import { updateDeliveryStatus } from "../../api/deliveryApi";

const DELIVERY_STATUSES = [
  "ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const UpdateDeliveryStatus = () => {
  const [deliveryId, setDeliveryId] = useState("");
  const [status, setStatus] = useState("ASSIGNED");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliveryId) {
      setError("Please enter delivery ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await updateDeliveryStatus(deliveryId, status);

      setSuccess("Delivery status updated successfully.");
      setDeliveryId("");
      setStatus("ASSIGNED");
    } catch (err) {
      console.error(err);
      setError("Unable to update delivery status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Update Delivery Status</h1>
        <p className="text-gray-600 mt-1">
          Update delivery status using delivery ID.
        </p>
      </div>

      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <input
          type="number"
          value={deliveryId}
          onChange={(e) => setDeliveryId(e.target.value)}
          placeholder="Enter delivery ID"
          className="w-full border p-3 rounded"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-3 rounded"
        >
          {DELIVERY_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-5 py-3 rounded w-full disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Status"}
        </button>
      </form>
    </div>
  );
};

export default UpdateDeliveryStatus;