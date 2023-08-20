import React, { useState } from 'react';
import { ErrorMessage, Field, Form, Formik, FieldProps } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Popover from '@radix-ui/react-popover';
import { signUp } from '@/api';

const SignUp: React.FC = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const renderConfirmDialog = () => {
    return (
      <AlertDialog.Root open={showConfirmDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black bg-opacity-50 data-[state=open]:animate-overlayShow fixed inset-0" />
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialog.Title className="m-0 text-lg font-normal flex items-center">
              <span className="font-light">Success!</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-4 mb-5 font-light leading-normal">
              Welcome to Kanbanha! Go to the sign in page and start using your new account. ;)
            </AlertDialog.Description>
            <div className="flex justify-end gap-[25px]">
              <AlertDialog.Action asChild>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="bg-blue-700 text-white hover:bg-blue-800 focus:shadow-blue-800 inline-flex items-center justify-center rounded-[4px] px-4 py-2 font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                >
                  OK
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  };

  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl">
        <span className="rounded text-white bg-blue-600 px-2 py-1">ƙ</span>
        &nbsp;<span>ANBANHA</span>
      </h1>
      <h2 className="text-left text-2xl">Sign Up</h2>

      <Formik
        initialValues={{ email: '', name: '', role: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email address').required('You must provide an email'),
          name: Yup.string()
            .min(3, 'Must be betwen 3 and 40 characters')
            .max(40, 'Must be betwen 3 and 40 characters')
            .matches(/[A-Za-z]*/, 'Invalid characters')
            .required('Required'),
          role: Yup.string()
            .min(3, 'Must be betwen 3 and 40 characters')
            .max(40, 'Must be betwen 3 and 40 characters')
            .matches(/[A-Za-z]*/, 'Invalid characters')
            .required('Required'),
          password: Yup.string()
            .min(8, 'Password must be 8 characters long at least')
            .max(16, 'Password must be 18 characters long at most')
            .required('Type your password'),
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          const { email, name, password, role } = values;
          const response = await signUp(email, name, role, password);
          const body = await response.json();
          if (response.status === 201) {
            setShowConfirmDialog(true);
          } else {
            const { message } = body;
            setFieldError('password', message);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Field
                name="email"
                render={({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="email"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              />
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="email" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <Field
                name="name"
                render={({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="text"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              />
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="name" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center">
                <label htmlFor="role">Role</label>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="text-gray-600 data-[state='open']:bg-gray-200 rounded p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      side="top"
                      align="start"
                      sideOffset={5}
                      className="w-[200px] text-xs text-slate-600 px-4 py-1 bg-white border-[1px] border-slate-600 rounded "
                    >
                      {'What is your profession or what position you will be performing.'}
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              </div>
              <Field
                name="role"
                render={({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="text"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              />
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="role" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <Field
                name="password"
                render={({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="password"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              />
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="password" />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="rounded-3xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 active:scale-[0.95] transition-all disabled:opacity-50"
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
      <div>
        <span>Already on Kanbanha?</span>&nbsp;
        <Link to="/signin">
          <a className="text-blue-600 hover:underline">Sign in</a>
        </Link>
      </div>
      {renderConfirmDialog()}
    </div>
  );
};

export default SignUp;
