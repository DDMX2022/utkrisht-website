'use client';

import { Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

interface Item {
  id: string;
  title: string;
  category: string;
  status: 'Draft' | 'Published';
  description?: string | null;
  imageUrl?: string | null;
  createdAt: string;
}
interface MediaItem {
  id: string;
  url: string;
  category?: string | null;
  folder?: string | null;
}

const allowedCategories = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Office',
  'Dining Room',
  'Bathroom',
];

export default function PortfolioManager() {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState({
    title: '',
    category: allowedCategories[0],
    status: 'Draft' as 'Draft' | 'Published',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState({
    title: '',
    category: allowedCategories[0],
    status: 'Draft' as 'Draft' | 'Published',
    description: '',
    imageUrl: '',
  });
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/portfolio');
    if (res.ok) setItems(await res.json());
    const m = await fetch('/api/admin/media');
    if (m.ok) setMedia(await m.json());
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  const portfolioMedia = useMemo(
    () =>
      media.filter(
        (m) =>
          m.folder?.startsWith('utkrisht/portfolio') ||
          m.category === 'Portfolio'
      ),
    [media]
  );

  async function create() {
    try {
      const payload = {
        ...form,
        imageUrl: form.imageUrl?.trim() || undefined,
        description: form.description?.trim() || undefined,
      };
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        alert(`Failed to add item (${res.status}): ${msg}`);
        return;
      }
      setForm({
        title: '',
        category: allowedCategories[0],
        status: 'Draft',
        description: '',
        imageUrl: '',
      });
      load();
    } catch (e: any) {
      alert(`Error adding item: ${e?.message || e}`);
    }
  }
  async function update() {
    if (!editingId) return;
    const res = await fetch('/api/admin/portfolio', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, ...edit }),
    });
    if (res.ok) {
      setEditingId(null);
      load();
    } else {
      const msg = await res.text();
      alert(`Failed to update (${res.status}): ${msg}`);
    }
  }
  async function remove(id: string) {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/admin/portfolio?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) load();
    else {
      const msg = await res.text();
      alert(`Failed to delete (${res.status}): ${msg}`);
    }
  }
  async function uploadFor(id: string, files: FileList) {
    setUploadingFor(id);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        form.append('category', 'Portfolio');
        form.append('portfolioId', id);
        await fetch('/api/admin/upload', { method: 'POST', body: form });
      }
      await load();
    } finally {
      setUploadingFor(null);
    }
  }
  async function setImageFromMedia(itemId: string, url: string) {
    const res = await fetch('/api/admin/portfolio', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId, imageUrl: url }),
    });
    if (res.ok) load();
  }
  async function clearImage(itemId: string) {
    if (!confirm('Remove current image from this item?')) return;
    const res = await fetch('/api/admin/portfolio', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId, imageUrl: null }),
    });
    if (res.ok) load();
  }

  return (
    <div className='space-y-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Title</label>
          <input
            className='border rounded px-3 py-2 w-full'
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Category</label>
          <select
            className='border rounded px-3 py-2 w-full'
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            {allowedCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Status</label>
          <select
            className='border rounded px-3 py-2 w-full'
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as 'Draft' | 'Published',
              }))
            }
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Image URL</label>
          <input
            className='border rounded px-3 py-2 w-full'
            value={form.imageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, imageUrl: e.target.value }))
            }
            placeholder='https://...'
          />
        </div>
        <div className='md:col-span-2'>
          <label className='block text-sm text-gray-600 mb-1'>
            Description
          </label>
          <textarea
            className='border rounded px-3 py-2 w-full min-h-[100px]'
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
      </div>
      <Button className='bg-blue-600 hover:bg-blue-700' onClick={create}>
        Add Portfolio Item
      </Button>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {items.map((it) => (
          <div key={it.id} className='border rounded p-3 bg-white'>
            <img
              src={it.imageUrl || '/placeholder.svg'}
              className='w-full h-40 object-cover rounded'
            />
            <div className='mt-2'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>{it.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    it.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {it.status}
                </span>
              </div>
              <p className='text-xs text-gray-500'>{it.category}</p>
            </div>
            {/* Manage Image toggle and panel */}
            <div className='mt-3 flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() =>
                  setSelectedId((prev) => (prev === it.id ? null : it.id))
                }
              >
                {selectedId === it.id ? 'Close' : 'Manage Image'}
              </Button>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => remove(it.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>

            {selectedId === it.id && (
              <div className='mt-3 p-3 border rounded bg-gray-50 space-y-3'>
                <div>
                  <label className='block text-sm text-gray-600 mb-2'>
                    Upload new image for this item
                  </label>
                  <div className='flex items-center gap-3'>
                    <input
                      type='file'
                      multiple
                      onChange={(e) =>
                        e.target.files && uploadFor(it.id, e.target.files)
                      }
                    />
                    {uploadingFor === it.id && (
                      <span className='text-xs text-gray-500 flex items-center gap-1'>
                        <Upload className='h-3 w-3' /> Uploading...
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block text-sm text-gray-600'>
                      Add from Media (Portfolio folders)
                    </label>
                    {it.imageUrl && (
                      <button
                        className='text-xs text-red-600 hover:underline'
                        onClick={() => clearImage(it.id)}
                      >
                        Remove current image
                      </button>
                    )}
                  </div>
                  <div className='grid grid-cols-3 md:grid-cols-6 gap-2 max-h-56 overflow-auto border rounded p-2 bg-white'>
                    {portfolioMedia.map((m) => (
                      <button
                        key={m.id}
                        className='border rounded overflow-hidden group'
                        onClick={() => setImageFromMedia(it.id, m.url)}
                      >
                        <img
                          src={m.url}
                          className='w-full h-20 object-cover group-hover:opacity-80'
                        />
                      </button>
                    ))}
                    {portfolioMedia.length === 0 && (
                      <p className='col-span-full text-xs text-gray-500 px-2'>
                        No media found in Portfolio folders. Upload first.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {editingId === it.id ? (
              <div className='mt-3 space-y-2'>
                <input
                  className='border rounded px-2 py-1 w-full'
                  value={edit.title}
                  onChange={(e) =>
                    setEdit((s) => ({ ...s, title: e.target.value }))
                  }
                />
                <select
                  className='border rounded px-2 py-1 w-full'
                  value={edit.category}
                  onChange={(e) =>
                    setEdit((s) => ({ ...s, category: e.target.value }))
                  }
                >
                  {allowedCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  className='border rounded px-2 py-1 w-full'
                  value={edit.status}
                  onChange={(e) =>
                    setEdit((s) => ({
                      ...s,
                      status: e.target.value as 'Draft' | 'Published',
                    }))
                  }
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
                <input
                  className='border rounded px-2 py-1 w-full'
                  value={edit.imageUrl}
                  onChange={(e) =>
                    setEdit((s) => ({ ...s, imageUrl: e.target.value }))
                  }
                  placeholder='https://...'
                />
                <textarea
                  className='border rounded px-2 py-1 w-full min-h-[80px]'
                  value={edit.description || ''}
                  onChange={(e) =>
                    setEdit((s) => ({ ...s, description: e.target.value }))
                  }
                />
                <div className='flex gap-2'>
                  <Button onClick={update}>Save</Button>
                  <Button variant='outline' onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className='mt-3 flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => {
                    setEditingId(it.id);
                    setEdit({
                      title: it.title,
                      category: it.category,
                      status: it.status,
                      description: it.description || '',
                      imageUrl: it.imageUrl || '',
                    });
                  }}
                >
                  Edit
                </Button>
                {/* Delete moved above next to Manage Image */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
