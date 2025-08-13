'use client';

import {
  Edit,
  Eye,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import BlogManager from '@/components/admin/BlogManager';
import { Button } from '@/components/ui/button';
import GalleryManager from '@/components/admin/GalleryManager';
import MediaManager from '@/components/admin/MediaManager';
import PortfolioManager from '@/components/admin/PortfolioManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects'); // default to projects now
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirm: '',
  });
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const sidebarItems = [
    // Removed dashboard
    { id: 'projects', label: 'Projects', icon: Image },
    { id: 'portfolio', label: 'Portfolio', icon: Image },
    { id: 'gallery', label: 'Gallery', icon: Image },
    // { id: 'blog', label: 'Blog Posts', icon: FileText }, // commented out
    { id: 'media', label: 'Media', icon: Image },
    // { id: 'users', label: 'Users', icon: Users }, // commented out
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (!passwordForm.email || !passwordForm.currentPassword || !passwordForm.newPassword) {
      return setPwdMsg('All fields are required.');
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      return setPwdMsg('Passwords do not match.');
    }
    try {
      setSavingPwd(true);
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setPwdMsg('Password updated successfully.');
      setPasswordForm({ email: '', currentPassword: '', newPassword: '', confirm: '' });
    } catch (e: any) {
      setPwdMsg(e.message || 'Failed to update password');
    } finally {
      setSavingPwd(false);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return <ProjectsManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'gallery':
        return <GalleryManager />;
      // case 'blog':
      //   return <BlogManager />;
      case 'media':
        return <MediaManager />;
      // case 'users':
      //   return <div className='bg-white p-6 rounded-lg shadow-md'>Users Management coming later.</div>;
      case 'settings':
        return (
          <div className='bg-white p-6 rounded-lg shadow-md max-w-xl'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Settings</h2>
            <h3 className='text-lg font-semibold mb-3'>Change Login Credentials</h3>
            <form onSubmit={changePassword} className='space-y-4'>
              <div>
                <label className='block text-sm text-gray-700 mb-1'>Admin Email</label>
                <input
                  type='email'
                  className='w-full border rounded px-3 py-2'
                  value={passwordForm.email}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder='admin@example.com'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-700 mb-1'>Current Password</label>
                <input
                  type='password'
                  className='w-full border rounded px-3 py-2'
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                />
              </div>
              <div>
                <label className='block text-sm text-gray-700 mb-1'>New Password</label>
                <input
                  type='password'
                  className='w-full border rounded px-3 py-2'
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                />
              </div>
              <div>
                <label className='block text-sm text-gray-700 mb-1'>Confirm New Password</label>
                <input
                  type='password'
                  className='w-full border rounded px-3 py-2'
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                />
              </div>
              {pwdMsg && <div className='text-sm text-gray-700'>{pwdMsg}</div>}
              <div className='flex justify-end'>
                <Button disabled={savingPwd} className='bg-gray-900 hover:bg-gray-800'>
                  {savingPwd ? 'Saving...' : 'Update Password'}
                </Button>
              </div>
            </form>

            <div className='mt-8 border-t pt-6'>
              <h3 className='text-lg font-semibold mb-3'>Super Admin</h3>
              <p className='text-sm text-gray-600'>Super Admin has full access. Seed via env variables (ADMIN_EMAIL/ADMIN_PASSWORD) or manage in DB.</p>
            </div>
          </div>
        );
      default:
        return <ProjectsManager />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30'>
        <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4'>
          <div className='flex items-center gap-3'>
            <button
              className='md:hidden p-2 rounded hover:bg-gray-100'
              onClick={() => setSidebarOpen(true)}
              aria-label='Open sidebar'
            >
              <Menu className='h-6 w-6 text-gray-700' />
            </button>
            <h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-2 sm:space-x-4'>
            <span className='hidden sm:inline text-sm text-gray-600'>
              Welcome, Admin
            </span>
            <Button
              variant='ghost'
              size='sm'
              className='text-red-600 hover:text-red-700'
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className='h-4 w-4 mr-2' />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className='flex'>
        {/* Desktop Sidebar */}
        <nav className='hidden md:block md:w-64 bg-white shadow-sm'>
          <div className='p-4 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:overflow-y-auto'>
            <div className='space-y-2'>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                    <span className='font-medium'>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className='flex-1 p-4 sm:p-6'>{renderContent()}</main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className='md:hidden'>
          <div
            className='fixed inset-0 z-40 bg-black/50'
            onClick={() => setSidebarOpen(false)}
          />
          <div className='fixed z-50 left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform'>
            <div className='p-4 border-b flex items-center justify-between'>
              <span className='font-semibold'>Menu</span>
              <button
                className='p-2 rounded hover:bg-gray-100'
                onClick={() => setSidebarOpen(false)}
                aria-label='Close sidebar'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
            <div className='p-4 space-y-2 overflow-y-auto h-[calc(100%-56px)]'>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                    <span className='font-medium'>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
