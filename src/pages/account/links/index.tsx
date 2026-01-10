import { useContext, useState } from "react";
import { PencilIcon, TrashIcon, CopyIcon, EyeIcon, PlusCircleIcon } from "@phosphor-icons/react";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import type { PaymentLink } from "../../../interface/payments";
import AddPaymentLinkModal from "../../../components/modal/AddPaymentLinkModal";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";
import { formatDate } from "../../../utils/helpers/formatDate";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { copyToClipboard } from "../../../utils/helpers/copyToClipboard";
import ShowLinkDetailsModal from "../../../components/modal/showLinkDetailsModal";

function PaymentLinks() {
  const { 
    paymentLinks, 
    loading, 
    deletePaymentLink
  } = useContext(PaymentLinkContext);

  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment link?")) {
      try {
        await deletePaymentLink(id);
      } catch (error) {
        console.error("Error deleting payment link:", error);
      }
    }
  };

  const viewDetails = (link: PaymentLink) => {
    setSelectedLink(link);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap gap-6 justify-between items-center ">
        <div>
            <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Payment links</h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <PlusCircleIcon size={16} />
          Create Link
        </button>
      </div>

      {/* Add Payment Link Modal */}
      <AddPaymentLinkModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />

      {/* Stats Cards */}
        <div className="grid md:grid-cols-4 grid-cols-2 border border-gray-500/[0.1] bg-gray-50 gap-1 rounded-lg p-1">
            <div className="bg-white p-6 rounded-lg border border-gray-500/[0.1] flex flex-col gap-2">
                <p className="text-gray-600 text-sm">Total Links</p>
                <p className="text-3xl font-semibold mt-2">{paymentLinks?.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-500/[0.1] flex flex-col gap-2">
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-3xl font-semibold mt-2">
                    {paymentLinks?.filter(l => l.status === 'active').length || 0}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-500/[0.1] flex flex-col gap-2">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-semibold mt-2">
                    {paymentLinks?.filter(l => l.status === 'completed').length || 0}
                </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-500/[0.1] flex flex-col gap-2">
                <p className="text-gray-600 text-sm">Expired</p>
                <p className="text-3xl font-semibold mt-2">
                    {paymentLinks?.filter(l => l.status === 'expired').length || 0}
                </p>
            </div>
        </div>

      {/* Payment Links Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {paymentLinks?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No payment links yet. Create your first link to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentLinks?.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{link.reference}</span>
                        <button
                          onClick={() => copyToClipboard(link.link)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <CopyIcon size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(link.amount, link.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(link.status)}`}>
                        {link.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(link.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(link.expiresAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewDetails(link)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon size={18} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <PencilIcon size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id!)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {showDetailsModal && selectedLink && (
        <ShowLinkDetailsModal 
          selectedLink={selectedLink} 
          setShowDetailsModal={setShowDetailsModal} 
        />
      )}

    </div>
  );
}

export default PaymentLinks;
