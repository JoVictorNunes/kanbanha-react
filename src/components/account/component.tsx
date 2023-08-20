import React from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage, FieldProps } from 'formik';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useAuth, useLayout, useSocket } from '@/hooks';

const fieldStaticStyles = clsx(
  'border-[1px]',
  'border-slate-400',
  'focus:border-blue-600',
  'focus:shadow-blue-600',
  'focus:shadow-[0px_0px_0px_2px]',
  'disabled:opacity-50',
  'rounded-3xl',
  'outline-none',
  'py-2',
  'px-4'
);

const submitButtonStaticStyles = clsx(
  'bg-blue-600',
  'hover:bg-blue-700',
  'text-white',
  'rounded-3xl',
  'py-2',
  'px-4',
  'active:scale-[0.95]',
  'transition-all',
  'disabled:opacity-50'
);

const Account: React.FC = () => {
  const { currentMember } = useAuth();
  const { socket, connected } = useSocket();
  const { layout } = useLayout();

  return (
    <Formik
      initialValues={{
        email: currentMember?.email ?? '',
        name: currentMember?.name ?? '',
        role: currentMember?.role ?? '',
      }}
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
      })}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        if (!connected) return;
        const { email, name, role } = values;
        socket.emit('members:update', { email, name, role }, (response) => {
          if (response.code === 201) {
            toast.success('Changes saved!');
          } else {
            toast.error('Something went wrong');
            setFieldError('role', response.message);
          }
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <div
          style={{
            height: layout.main.height,
            width: layout.main.width,
            top: layout.main.top,
            left: layout.main.left,
          }}
          className="absolute"
        >
          <Form className="flex flex-col gap-2 md:w-1/2">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    disabled={isSubmitting}
                    type="email"
                    className={`${fieldStaticStyles}`}
                  />
                )}
              </Field>
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="email" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    disabled={isSubmitting}
                    type="text"
                    className={`${fieldStaticStyles}`}
                  />
                )}
              </Field>
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="name" />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="role">Role</label>
              <Field name="role">
                {({ field }: FieldProps) => (
                  <input
                    {...field}
                    disabled={isSubmitting}
                    type="text"
                    className={`${fieldStaticStyles}`}
                  />
                )}
              </Field>
              <div className="text-red-600 text-sm h-5">
                <ErrorMessage name="role" />
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className={`${submitButtonStaticStyles}`}>
              Save
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default Account;
