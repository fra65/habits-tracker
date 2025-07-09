/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Text } from '@react-email/components';

type MyEmailProps = {
  resetLink: string;
  email?: string;
};

const MyEmail = ({resetLink, email}: MyEmailProps) => {
  return (
    <div
      style={{
        maxWidth: '28rem', // max-w-md = 448px
        margin: '0 auto',
        backgroundColor: '#ffffff',
        padding: '2rem', // p-8
        borderRadius: '0.5rem', // rounded-lg = 8px
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', // shadow-lg
        border: '1px solid #f3f4f6', // border-gray-100
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Text
          style={{
            fontSize: '1.5rem', // text-2xl = 24px
            fontWeight: '700',
            color: '#111827', // text-gray-900
            marginBottom: '0.5rem',
            lineHeight: '1.25',
          }}
        >
          Reset your password
        </Text>
        <Text
          style={{
            fontSize: '0.875rem', // text-sm = 14px
            color: '#6b7280', // text-gray-500
            textTransform: 'uppercase',
            letterSpacing: '0.05em', // tracking-wide
            fontWeight: '500',
          }}
        >
          HabitsTracker Security
        </Text>
      </div>

      <div
        style={{
          backgroundColor: '#f9fafb', // bg-gray-50
          borderRadius: '0.5rem',
          padding: '1.5rem', // p-6
          marginBottom: '1.5rem',
        }}
      >

        <Text
          style={{
            color: '#374151', // text-gray-700
            lineHeight: '1.625',
            textAlign: 'center',
            fontSize: '1rem',
          }}
        >
          Hello, <strong>{email}</strong>
        </Text>

        <Text
          style={{
            color: '#374151', // text-gray-700
            lineHeight: '1.625',
            textAlign: 'center',
            fontSize: '1rem',
          }}
        >
          We received a request to reset your password. Click the button below to create a new password for your{' '}
          <span style={{ fontWeight: '600', color: '#4f46e5' /* indigo-600 */ }}>HabitsTracker</span> account.
        </Text>
      </div>

      <hr
        style={{
          margin: '1.5rem 0',
          border: 'none',
          borderTop: '1px solid #e5e7eb', // bg-gray-200
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <a
          href={resetLink}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(to right, #6366f1, #8b5cf6)', // from-indigo-500 to-purple-600
            color: '#ffffff',
            fontWeight: '600',
            padding: '0.75rem 2rem', // py-3 px-8
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(99, 102, 241, 0.4)', // shadow-md with indigo-ish shadow
            textDecoration: 'none',
            fontSize: '1rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          // Nota: hover non funziona nelle email, quindi non incluso
        >
          RESET PASSWORD
        </a>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Text
          style={{
            fontSize: '0.75rem', // text-xs = 12px
            color: '#6b7280', // text-gray-500
            lineHeight: '1.625',
          }}
        >
          If you didn&apos;t request this password reset, you can safely ignore this email. Your password will remain unchanged.
        </Text>
      </div>

      <div
        style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #f3f4f6', // border-gray-100
        }}
      >
        <Text
          style={{
            fontSize: '0.75rem',
            color: '#9ca3af', // text-gray-400
            textAlign: 'center',
          }}
        >
          © 2024 HabitsTracker. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default MyEmail;
