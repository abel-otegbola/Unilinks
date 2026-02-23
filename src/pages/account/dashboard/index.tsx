import { useContext, useEffect } from "react";
function StatCard({ title, value, subValue, description, borderColor, bgColor, textColor }: { title: string, value: string | number, subValue: string | number, subLabel?: string, description: string, borderColor: string, bgColor: string, textColor: string }) {
  return (
    <div className="flex flex-col gap-2 md:md:py-6 p-4 rounded border border-gray-500/[0.1] bg-white">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex flex-col">
        <div className="flex gap-2 justify-end flex-wrap flex-col">
          <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">{value}</p>
          <p className={`border ${borderColor} ${bgColor} ${textColor} w-fit p-2 py-2 mb-2 leading-0 rounded text-[10px]`}>
            {subValue}
          </p>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
import { PaymentContext } from "../../../contexts/PaymentContext";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/helpers/formatCurrency";

function Dashboard() {
  const { 
    paymentMethods, 
    getUserPaymentMethods
  } = useContext(PaymentContext);
  const { 
    paymentLinks, 
  } = useContext(PaymentLinkContext);

  useEffect(() => {
    getUserPaymentMethods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
        <div className="flex flex-col bg-white gap-6 min-h-[calc(100vh-80px)] w-full  ">
            <div className="flex flex-col gap-4">
                <h1 className="md:text-[18px] text-[16px] font-semibold capitalize leading-[28px]">Overview</h1>

                <div className="grid md:grid-cols-4 grid-cols-2 border border-gray-500/[0.1] bg-gray-50 gap-1 rounded-lg p-1">
                  <StatCard
                    title="Overall Links"
                    value={paymentLinks?.length || 0}
                    subValue={paymentLinks?.length > 0 ? `${Math.round((paymentLinks.filter(l => l.status === 'completed').length / paymentLinks.length) * 100)}% completed` : '0% completed'}
                    description="Total links created"
                    borderColor="border-green-400"
                    bgColor="bg-green-400/[0.2]"
                    textColor="text-green-600"
                  />
                  <StatCard
                    title="Active Links"
                    value={paymentLinks?.filter(l => l.status === 'active').length || 0}
                    subValue={paymentLinks?.length > 0 ? `${Math.round((paymentLinks.filter(l => l.status === 'active').length / paymentLinks.length) * 100)}% of total` : '0% of total'}
                    description="Total active links"
                    borderColor="border-blue-400"
                    bgColor="bg-blue-400/[0.2]"
                    textColor="text-blue-600"
                  />
                  <StatCard
                    title="Expired Links"
                    value={paymentLinks?.filter(l => l.status === 'expired').length || 0}
                    subValue={paymentLinks?.length > 0 ? `${Math.round((paymentLinks.filter(l => l.status === 'expired').length / paymentLinks.length) * 100)}% of total` : '0% of total'}
                    description="Total expired links"
                    borderColor="border-red-400"
                    bgColor="bg-red-400/[0.2]"
                    textColor="text-red-600"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={formatCurrency(paymentLinks?.filter(l => l.status === 'completed').reduce((total, link) => total + link.amount, 0) || 0, "USD")}
                    subValue={`${paymentLinks?.filter(l => l.status === 'completed').length || 0} completed`}
                    description="Total revenue generated"
                    borderColor="border-green-400"
                    bgColor="bg-green-400/[0.2]"
                    textColor="text-green-600"
                  />
                </div>
        
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 flex flex-col gap-4 md:my-0 my-8">
                    <h2 className="font-semibold">Recent Links</h2>
                    <div className="flex flex-col gap-2">
                      {
                      paymentLinks.length === 0 ? (
                      <p>You have not created any payment links yet.</p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full overflow-hidden">
                            <thead className="bg-gray-50 ">
                              <tr className="">
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {
                                paymentLinks.slice(0, 5).map((link) => (
                                  
                                  <tr key={link.id} className="border-b border-gray-500/[0.1] rounded-lg">
                                    <td className="py-4 whitespace-nowrap">
                                      <Link to={`/account/payment-links/${link.id}`}>{link.reference}</Link>
                                    </td>
                                    <td className="py-4 whitespace-nowrap">
                                      <Link to={`/account/payment-links/${link.id}`}>{link.currency}{link.amount}</Link>
                                    </td>
                                    <td className="py-4 whitespace-nowrap"><p className={`w-fit rounded-full px-2 py-1 ${getStatusColor(link.status)}`}>{link.status}</p></td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                          </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h2 className="font-semibold">Payment Methods</h2>
                    <div className="flex flex-col gap-2 border border-gray-500/[0.1] bg-gray-50 gap-1 rounded-lg p-1">
                      <div className="flex flex-col gap-1 w-full">
                          {
                          paymentMethods.length === 0 ? (
                          <p>You have not created any payment methods yet.</p>
                          ) : (
                          paymentMethods.map((method) => (
                              <Link 
                                key={method.id} 
                                to={`/account/payment-methods/${method.id}`}
                                className="bg-white flex items-center justify-between gap-2 p-4 border border-gray-500/[0.2] rounded-[8px] hover:shadow-sm hover:border-gray-500/40 transition cursor-pointer"
                              >
                                <p>{method.name}</p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(method.status)}`}>
                                  {method.status}
                                </span>
                              </Link>
                          ))
                          )}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;