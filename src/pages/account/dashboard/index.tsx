import { useContext, useEffect } from "react";
import { PaymentContext } from "../../../contexts/PaymentContext";
import { PaymentLinkContext } from "../../../contexts/PaymentLinkContext";
import { getStatusColor } from "../../../utils/helpers/getStatusColor";

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
                <h1 className="md:text-[18px] text-[16px] font-semibolds capitalize leading-[28px]">Overview</h1>

                <div className="grid md:grid-cols-4 grid-cols-2 border border-gray-500/[0.1] bg-gray-50 gap-1 rounded-lg p-1">
                  <div className="flex flex-col gap-2 md:md:py-6 p-4 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Overall Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 justify-end flex-wrap flex-col">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">12</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 w-fit p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total links created</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 md:md:py-6 p-4 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Active Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 justify-end flex-wrap flex-col">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">8</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 w-fit p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total active links</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 md:md:py-6 p-4 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Expired Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 justify-end flex-wrap flex-col">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">4</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 w-fit p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total expired links</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 md:md:py-6 p-4 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Total Revenue</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 justify-end flex-wrap flex-col">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">$6,450.00</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 w-fit p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total revenue generated</p>
                    </div>
                  </div>
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
                          <table className="w-full rounded-lg border border-gray-200 overflow-hidden">
                            <thead className="bg-gray-50 border border-gray-200">
                              <tr className="">
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {
                                paymentLinks.slice(0, 5).map((link) => (
                                  <tr key={link.id} className="border border-gray-500/[0.1] rounded-lg">
                                    <td className="py-4 whitespace-nowrap">{link.reference}</td>
                                    <td className="py-4 whitespace-nowrap">{link.currency}{link.amount}</td>
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
                      <div className="flex flex-col gap-2 w-full">
                          {
                          paymentMethods.length === 0 ? (
                          <p>You have not created any payment links yet.</p>
                          ) : (
                          paymentMethods.map((method, index) => (
                              <div key={index} className="bg-white flex items-center justify-between gap-2 p-4 border border-gray-500/[0.2] rounded-[8px] hover:shadow-sm hover:border-gray-500/40 transition">
                              <p>{method.name}</p>
                              
                              </div>
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