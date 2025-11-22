import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const EmailConfirmation: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-neutral-900 dark:text-white">
            Email Verified!
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Your email has been successfully verified. You can now sign in to your account.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/login"
            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-white transition-colors"
          >
            Go to Login
            <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
