import { useContext, useEffect, useState } from "react";
import { PaymentContext } from "../../../contexts/PaymentContext";
import type { PaymentMethod } from "../../../interface/payments";
import { AuthContext } from "../../../contexts/AuthContext";
import AddPaymentMethodModal from "../../../components/modal/AddPaymentMethodModal";
import EditPaymentMethodModal from "../../../components/modal/EditPaymentMethodModal";
import { PencilIcon, PlusCircleIcon, TrashIcon } from "@phosphor-icons/react";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";

function PaymentMethodsPage() {
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const { user } = useContext(AuthContext);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { 
    paymentMethods,
    loading, 
    createPaymentMethod, 
    updatePaymentMethod,
    deletePaymentMethod,
    getUserPaymentMethods
  } = useContext(PaymentContext);

  useEffect(() => {
    getUserPaymentMethods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPaymentMethod = (paymentMethod: PaymentMethod) => {
    const newMethod: PaymentMethod = {
        id: paymentMethods.length.toString(),
        type: paymentMethod.type,
        name: paymentMethod.name,
        details: paymentMethod.details,
        userId: user?.email || "unknown",
        status: 'active',
        createdAt: new Date(),
    };
    console.log(newMethod);
    createPaymentMethod({name: newMethod.name, type: newMethod.type, details: newMethod.details, userId: user?.email || "unknown", status: newMethod.status});
  };

  const handleEditPaymentMethod = (id: string, paymentMethod: PaymentMethod) => {
    updatePaymentMethod(id, paymentMethod);
  };

  const handleDeletePaymentMethod = (id: number) => {
    deletePaymentMethod(id.toString());
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Payment methods</h1>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"  onClick={() => setIsAddModalOpen(true)}>
          <PlusCircleIcon size={16} />
          Create payment method
        </button>
      </div>

        <table className="table-auto rounded-lg w-full border-collapse overflow-hidden bg-gray-50">
          <thead>
            <tr className="bg-gray-50 rounded-lg border border-gray-500/[0.1]">
              <th className="p-4 text-left font-semibold uppercase text-[12px]">Method</th>
              <th className="p-4 text-left font-semibold uppercase text-[12px]">Type</th>
              <th className="p-4 text-left font-semibold uppercase text-[12px]">Status</th>
              <th className="p-4 text-left font-semibold uppercase text-[12px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              paymentMethods.map((method) => (
                <tr key={method.id} className="border border-gray-500/[0.1] rounded-lg">
                  <td><div className="p-4 bg-white sm:text-[14px] text-[12px]">{method.name}</div></td>
                  <td><div className="p-4 bg-white sm:text-[14px] text-[12px]">{method.type}</div></td>
                  <td><div className="p-4 bg-white sm:text-[14px] text-[12px]"><p className={`w-fit rounded-full px-2 py-1 ${getStatusColor(method.status)}`}>{method.status}</p></div></td>
                  <td>
                    <div className="p-4 bg-white sm:text-[14px] text-[12px]">
                      <div className="flex gap-2 items-center">
                          <button
                            onClick={() => openEditModal(method)}
                            className="rounded-full border border-gray-500/[0.1] p-1 hover:bg-gray-100 transition"
                            title="Edit payment method"
                          >
                            <PencilIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePaymentMethod(method.id as unknown as number)}
                            className="rounded-full border border-gray-500/[0.1] p-1 hover:bg-gray-100 transition"
                            title="Delete payment method"
                          >
                            { loading ? "Deleting..." : <TrashIcon size={16} /> }
                          </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>

        
        <AddPaymentMethodModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddPaymentMethod}
        />

        <EditPaymentMethodModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditPaymentMethod}
          paymentMethod={editingMethod}
        />
        
    </div>
  )
}

export default PaymentMethodsPage