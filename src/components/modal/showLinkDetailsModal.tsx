import type { PaymentLink } from "../../interface/payments"
import { copyToClipboard } from "../../utils/helpers/copyToClipboard"
import { formatCurrency } from "../../utils/helpers/formatCurrency"
import { formatDate } from "../../utils/helpers/formatDate"
import { getStatusColor } from "../../utils/helpers/getStatusColor"

interface ShowLinkDetailsModalProps {
  selectedLink: PaymentLink;
  setShowDetailsModal: (show: boolean) => void
}

function ShowLinkDetailsModal({ selectedLink, setShowDetailsModal }: ShowLinkDetailsModalProps) {
  return (
        <div className="fixed inset-0 bg-black/[0.5] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 py-3 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="md:text-[18px] text-[16px] font-medium">Payment Link Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedLink.reference}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold mt-1">
                    {formatCurrency(selectedLink.amount, selectedLink.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedLink.status)}`}>
                    {selectedLink.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-medium mt-1">{formatDate(selectedLink.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className="text-sm font-medium mt-1">{formatDate(selectedLink.expiresAt)}</p>
                </div>
              </div>

              {/* Link */}
              <div>
                <p className="text-sm text-gray-600">Payment Link</p>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={selectedLink.link}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedLink.link)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Notes */}
              {selectedLink.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm mt-1 text-gray-900">{selectedLink.notes}</p>
                </div>
              )}

              {/* Timeline */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Activity Timeline</p>
                <div className="space-y-3">
                  {selectedLink.timeline.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        {index < selectedLink.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
  )
}

export default ShowLinkDetailsModal