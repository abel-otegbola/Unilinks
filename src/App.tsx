import { BrowserRouter, Route, Routes } from "react-router-dom"
import Homepage from "./pages/static/home"
import PaymentPage from "./pages/static/pay"
import PayLookupPage from "./pages/static/pay/lookup"
import DocsPage from "./pages/static/docs"
import AuthProvider from "./contexts/AuthContext"
import AuthLayout from "./pages/auth/layout"
import AccountLayout from "./pages/account/layout"
import PaymentProvider from "./contexts/PaymentContext"
import PaymentLinkProvider from "./contexts/PaymentLinkContext"

function App() {

  return (
    <div className="text-[14px] sm:text-[15px] lg:text-[15px] 2xl:text-[16px] tracking-[5%]">
      <BrowserRouter>
      <AuthProvider>
        <PaymentLinkProvider>
        <PaymentProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/pay" element={<PayLookupPage />} />
            <Route path="/pay/:reference" element={<PaymentPage />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="/account/*" element={<AccountLayout />} />
          </Routes>
        </PaymentProvider>
        </PaymentLinkProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
