import { Formik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../../components/button/Button";
import { loginSchema } from "../../../schema/authSchema";
import Toast from "../../../components/toast/Toast";
import Input from "../../../components/input/input";
import { AuthContext } from "../../../contexts/AuthContext";
import { EnvelopeIcon, LockIcon, SpinnerIcon, GoogleLogoIcon } from '@phosphor-icons/react';

export default function Login() {
  const { login, loading, popup, socialSignIn } = useContext(AuthContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const [URLSearchParams] = useSearchParams()
  const [rememberMe, setRememberMe] = useState(false)
  const callbackURL = URLSearchParams.get("callbackURL") || ""

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="2xl:w-[629px] sm:w-[440px] md:mx-0 mx-auto w-full p-8">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-8">
            <div>
              <h1 className="font-medium 2xl:text-[32px] md:text-[28px] text-[24px] text-center">Welcome to UniLinks!</h1>
              <p className="opacity-70 text-center">Please log in to access your account</p>
            </div>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginSchema}
              onSubmit={(values, { setSubmitting }) => {
                login(values.email, values.password, rememberMe, callbackURL || "/account");
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6" data-testid="login-form">
                  <Input
                    name="email"
                    value={values.email}
                    placeholder="e.g Johndoe@example.com"
                    leftIcon={<EnvelopeIcon size={20} />}
                    onChange={handleChange}
                    type="email"
                    error={!touched.email ? "" : errors.email ? errors.email : ""}
                    label="Enter your email"
                  />
                  <Input
                    name="password"
                    value={values.password}
                    placeholder="Your password"
                    leftIcon={<LockIcon size={20} />}
                    onChange={handleChange}
                    type="password"
                    error={!touched.password ? "" : errors.password ? errors.password : ""}
                    label="Password"
                  />
                  <div className="flex justify-between items-center w-full -mt-2">
                    <div className="text-center flex gap-1 items-center text-[#7C7E7E] leading-[0px]">
                      <input 
                        id="remember" 
                        checked={rememberMe} 
                        type="checkbox" 
                        onChange={() => setRememberMe(!rememberMe)} 
                        data-testid="remember-me-checkbox"
                      />
                      <label htmlFor="remember">Remember me</label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    {isSubmitting || loading ? <SpinnerIcon color="white" className="animate-spin w-[20px]" /> : "Login"}
                  </Button>

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-sm text-gray-500">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => socialSignIn('google')}
                    disabled={loading}
                  >
                    <GoogleLogoIcon size={20} />
                    Sign in with Google
                  </Button>

                  <p className="text-center">Don&apos;t have an account? <Link to="/auth/register" className="text-primary">Register here</Link></p>
                </form>

              )}
            </Formik>

            <Toast 
              message={popup?.msg} 
              type={popup?.type as "error" | "success"} 
              timestamp={popup?.timestamp}
            />

          </div>
        </div>
      </div>
  );
}

