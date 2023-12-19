import React from 'react';
import { ErrorMessage, Field, Form, Formik, FieldProps } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { signIn } from '@/api';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <h1 className="text-3xl">
        <span className="rounded text-white bg-blue-600 px-2 py-1">ƙ</span>
        &nbsp;<span>ANBANHA</span>
      </h1>
      <h2 className="text-left text-2xl">Sign In</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid email address').required('You must provide an email'),
          password: Yup.string()
            .min(8, 'Password must be 8 characters long at least')
            .max(16, 'Password must be 18 characters long at most')
            .required('Type your password'),
        })}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          const { email, password } = values;
          const response = await signIn(email, password);
          const body = await response.json();
          if (response.status === 201) {
            const { token } = body;
            localStorage.setItem('token', token);
            navigate('/');
          } else {
            const { message } = body;
            setFieldError('password', message);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 w-1/2 md:w-1/3">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Field name="email">
                {({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="email"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              </Field>
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="email" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <Field name="password">
                {({ field, form }: FieldProps) => (
                  <input
                    {...field}
                    disabled={form.isSubmitting}
                    type="password"
                    className="disabled:opacity-50 border-[1px] border-black rounded-3xl outline-none focus:shadow-[0px_0px_0px_2px] py-2 px-4 focus:shadow-blue-600 focus:border-blue-600"
                  />
                )}
              </Field>
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="password" />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="rounded-3xl bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 active:scale-[0.95] transition-all disabled:opacity-50"
            >
              Sign In
            </button>
          </Form>
        )}
      </Formik>
      <div>
        <span>Don't have an account?</span>&nbsp;
        <Link to="/signup">
          <a className="text-blue-600 hover:underline">Sign up</a>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
