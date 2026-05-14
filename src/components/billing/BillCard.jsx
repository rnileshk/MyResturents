import { Trash2, Eye } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const BillCard = ({ bill, onView, onDelete }) => {
  if (!bill) return null;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Bill #{bill.id}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Order: {bill.orderCode || bill.order?.orderCode || "N/A"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Customer: {bill.customerName || bill.customer?.name || "Walk-in"}
          </p>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          {bill.status || "GENERATED"}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(bill.subTotal || bill.subtotal || 0)}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(bill.taxAmount || bill.tax || 0)}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>{formatCurrency(bill.discount || 0)}</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(bill.totalAmount || bill.grandTotal || 0)}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        {onView && (
          <button
            type="button"
            onClick={() => onView(bill)}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            <Eye size={16} />
            View
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(bill.id)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BillCard;