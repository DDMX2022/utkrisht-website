'use client';

import { Mail, Phone, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ['New', 'Contacted', 'Converted', 'Lost'];

const STATUS_STYLES: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  Converted: 'bg-green-100 text-green-700',
  Lost: 'bg-gray-200 text-gray-600',
};

export default function LeadsManager() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/inquiries');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
  }

  async function remove(id: string) {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered =
    filter === 'All' ? items : items.filter((i) => i.status === filter);

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
        <h2 className='text-2xl font-bold text-gray-900'>Leads & Inquiries</h2>
        <div className='flex gap-2'>
          {['All', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className='text-gray-500'>Loading...</p>
      ) : filtered.length === 0 ? (
        <p className='text-gray-500'>No leads found.</p>
      ) : (
        <div className='space-y-3'>
          {filtered.map((item) => (
            <div
              key={item.id}
              className='border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'
            >
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap mb-1'>
                  <span className='font-semibold text-gray-900'>
                    {item.name}
                  </span>
                  {item.service && (
                    <span className='text-xs font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full'>
                      {item.service}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className='flex items-center gap-4 text-sm text-gray-500 mb-2 flex-wrap'>
                  <a
                    href={`mailto:${item.email}`}
                    className='flex items-center gap-1 hover:text-gray-900'
                  >
                    <Mail className='h-3.5 w-3.5' /> {item.email}
                  </a>
                  {item.phone && (
                    <a
                      href={`tel:${item.phone}`}
                      className='flex items-center gap-1 hover:text-gray-900'
                    >
                      <Phone className='h-3.5 w-3.5' /> {item.phone}
                    </a>
                  )}
                  <span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className='text-sm text-gray-700'>{item.message}</p>
              </div>

              <div className='flex items-center gap-2 sm:flex-col sm:items-end'>
                <select
                  value={item.status}
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                  className='border border-gray-300 rounded-lg px-3 py-1.5 text-sm'
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(item.id)}
                  className='text-red-600 hover:text-red-700 p-1.5'
                  aria-label='Delete lead'
                >
                  <Trash2 className='h-4 w-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
