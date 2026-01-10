import { useContext, useEffect } from "react";
import { PaymentContext } from "../../../contexts/PaymentContext";

function Dashboard() {
  const { 
    paymentMethods, 
    getUserPaymentMethods
  } = useContext(PaymentContext);

  useEffect(() => {
    getUserPaymentMethods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
        <div className="flex flex-col bg-white gap-6 min-h-[calc(100vh-80px)] w-full  ">
            <div className="flex flex-col gap-4">
                <h1 className="md:text-[18px] text-[16px] font-medium capitalize leading-[28px]">Overview</h1>

                <div className="grid md:grid-cols-4 grid-cols-2 border border-gray-500/[0.1] bg-gray-50 gap-1 rounded-lg p-1">
                  <div className="flex flex-col gap-2 px-12 py-8 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Overall Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-end">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">12</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total links created</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 px-12 py-8 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Active Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-end">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">8</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total active links</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 px-12 py-8 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Expired Links</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-end">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">4</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total expired links</p>
                    </div>
                  </div>

                   <div className="flex flex-col gap-2 px-12 py-8 rounded border border-gray-500/[0.1] bg-white">
                    <h2 className="font-semibold">Total Revenue</h2>
                    <div className="flex flex-col">
                      <div className="flex gap-2 items-end">
                        <p className="xl:text-5xl md:text-4xl sm:text-3xl text-2xl font-semibold">$0.00</p>
                        <p className="border border-green-400 bg-green-400/[0.2] text-green-600 p-2 py-2 mb-2 leading-0 rounded text-[10px]">+5%</p>
                      </div>
                      <p className="text-sm text-gray-500">Total revenue generated</p>
                    </div>
                  </div>
                </div>
        
                <div className="flex flex-col gap-2 md:w-[500px] w-full">
                    {
                    paymentMethods.length === 0 ? (
                    <p>You have not created any payment links yet.</p>
                    ) : (
                    paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 p-4 border border-gray-500/[0.2] rounded-[8px] hover:shadow-sm hover:border-gray-500/40 transition">
                        <p>{method.name}</p>
                        
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Dashboard;