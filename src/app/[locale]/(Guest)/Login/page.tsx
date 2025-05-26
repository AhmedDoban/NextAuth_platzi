"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { UserLogin } from "@/Toolkit/Slices/UserSlice";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import SignGitHub from "@/components/Btns/SignGitHub";

const LoginForm = () => {
  const localActive = useLocale();
  const Dispatch = useDispatch() as any;
  const Router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Login
        </h2>

        <Formik
          initialValues={{ email: "john@mail.com", password: "changeme" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email")
              .required("Email is required"),
            password: Yup.string()
              .min(6, "Must be at least 6 characters")
              .required("Password is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            Dispatch(UserLogin(values)).then((res: any) => {
              if (res.payload.access_token) {
                Router.replace(`/${localActive}`);
              }
            });
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-indigo-300"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4">
          <SignGitHub />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
