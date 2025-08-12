'use client';

import {
  Edit,
  Eye,
  FileText,
  Image,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Trash2,
  Users,
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'Modern Living Room',
      category: 'Living Room',
      status: 'Published',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Luxury Bedroom',
      category: 'Bedroom',
      status: 'Draft',
      date: '2024-03-14',
    },
    {
      id: 3,
      title: 'Minimalist Kitchen',
      category: 'Kitchen',
      status: 'Published',
      date: '2024-03-13',
    },
  ]);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Image },
    { id: 'portfolio', label: 'Portfolio', icon: Image },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-sm font-medium text-gray-500'>Total Projects</h3>
          <p className='text-3xl font-bold text-gray-900 mt-2'>
            {projects.length}
          </p>
          <p className='text-sm text-green-600 mt-1'>+2 this month</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-sm font-medium text-gray-500'>Blog Posts</h3>
          <p className='text-3xl font-bold text-gray-900 mt-2'>
            {projects.length}
          </p>
          <p className='text-sm text-green-600 mt-1'>+1 this week</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-sm font-medium text-gray-500'>Total Views</h3>
          <p className='text-3xl font-bold text-gray-900 mt-2'>12,543</p>
          <p className='text-sm text-green-600 mt-1'>+15% this month</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-sm font-medium text-gray-500'>Inquiries</h3>
          <p className='text-3xl font-bold text-gray-900 mt-2'>28</p>
          <p className='text-sm text-blue-600 mt-1'>5 pending</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Recent Projects
          </h3>
          <div className='space-y-3'>
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className='flex items-center justify-between p-3 border rounded-lg'
              >
                <div>
                  <h4 className='font-medium text-gray-900'>{project.title}</h4>
                  <p className='text-sm text-gray-500'>{project.category}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Recent Blog Posts
          </h3>
          <div className='space-y-3'>
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className='flex items-center justify-between p-3 border rounded-lg'
              >
                <div>
                  <h4 className='font-medium text-gray-900'>{project.title}</h4>
                  <p className='text-sm text-gray-500'>{project.category}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'Published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => <ProjectsManager />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return renderProjects();
      case 'portfolio':
        return <PortfolioManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'blog':
        return <BlogManager />;
      case 'media':
        return <MediaManager />;
      case 'users':
        return (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>
              Users Management
            </h2>
            <p className='text-gray-600'>
              User management functionality coming soon...
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Settings</h2>
            <p className='text-gray-600'>Settings panel coming soon...</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='flex items-center justify-between px-6 py-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-600'>Welcome, Admin</span>
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
        {/* Sidebar */}
        <nav className='w-64 bg-white shadow-sm h-screen'>
          <div className='p-4'>
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
        <main className='flex-1 p-6'>{renderContent()}</main>
      </div>
    </div>
  );
}
