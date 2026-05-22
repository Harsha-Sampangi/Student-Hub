import type { Metadata } from 'next';
import AdminLoginClient from './AdminLoginClient';

export const metadata: Metadata = {
  title: 'Admin Login | Student Hub',
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
