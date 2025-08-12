'use client';

import { ArrowLeft, Folder, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  url: string;
  category?: string | null;
  folder?: string | null;
  title?: string | null;
}

const allowedCategories = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Commercial',
  '3D Renders',
];

export default function GalleryManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/admin/media');
    if (res.ok) {
      const all = await res.json();
      setItems(
        all.filter(
          (m: MediaItem) =>
            m.folder?.startsWith('utkrisht/gallery') ||
            m.category === 'Gallery' ||
            (m.category && allowedCategories.includes(m.category))
        )
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  const byCategory = useMemo(() => {
    const map = new Map<string, MediaItem[]>();
    for (const c of allowedCategories) map.set(c, []);
    for (const m of items) {
      const c =
        m.category && allowedCategories.includes(m.category)
          ? m.category
          : null;
      if (c) map.get(c)!.push(m);
    }
    return map;
  }, [items]);

  const currentItems = selected ? byCategory.get(selected) || [] : [];

  async function upload() {
    if (!files || !selected) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        // Save under utkrisht/gallery/<category-slug> and set metadata category
        form.append('category', selected);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: form,
        });
        if (!res.ok) throw new Error(await res.text());
      }
      await load();
      setFiles(null);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this image from Media?')) return;
    const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
    if (res.ok) load();
  }

  return (
    <div className='space-y-6'>
      {!selected ? (
        <div>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            Gallery Folders
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
            {allowedCategories.map((c) => {
              const list = byCategory.get(c) || [];
              const cover = list[0]?.url;
              return (
                <button
                  key={c}
                  className='group border rounded-lg overflow-hidden bg-white hover:shadow-md transition'
                  onClick={() => setSelected(c)}
                >
                  <div className='relative h-24 bg-gray-100'>
                    {cover ? (
                      <img src={cover} className='w-full h-full object-cover' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-gray-400'>
                        <Folder className='h-8 w-8' />
                      </div>
                    )}
                    <div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity' />
                  </div>
                  <div className='p-2 text-left'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-gray-800 text-sm'>
                        {c}
                      </span>
                      <span className='text-xs text-gray-500'>
                        {list.length}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='flex flex-col items-start gap-4 justify-between'>
            <div className='flex items-center gap-2'>
              <Button variant='outline' onClick={() => setSelected(null)}>
                <ArrowLeft className='h-4 w-4 mr-1' /> Back
              </Button>
              <h2 className='text-xl font-semibold text-gray-900'>
                {selected}
              </h2>
            </div>
            <div className='flex items-center gap-3'>
              <input
                type='file'
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
              <Button
                className='bg-blue-600 hover:bg-blue-700'
                disabled={!files || uploading}
                onClick={upload}
              >
                <Upload className='h-4 w-4 mr-2' />{' '}
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
          {error && <div className='text-sm text-red-600'>{error}</div>}

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3'>
            {currentItems.length === 0 && (
              <div className='col-span-full text-center text-gray-500'>
                No images in this folder yet.
              </div>
            )}
            {currentItems.map((m) => (
              <div
                key={m.id}
                className='relative border rounded overflow-hidden'
              >
                <img src={m.url} className='w-full h-28 object-cover' />
                <button
                  className='absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs'
                  onClick={() => remove(m.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
