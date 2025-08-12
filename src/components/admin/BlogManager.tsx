'use client';

import { Edit, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

interface MediaItem {
  id: string;
  url: string;
  title?: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  status: string;
  excerpt?: string | null;
  content?: string | null;
  createdAt: string;
  coverImageId?: string | null;
  coverImage?: MediaItem | null;
  externalUrl?: string | null;
  authorName?: string | null; // NEW
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/blog', { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    setPosts(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const title = prompt('Post title?');
    if (!title) return;
    const res = await fetch('/api/admin/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status: 'Draft' }),
    });
    if (res.ok) load();
  }

  async function save() {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editing.id,
          title: editing.title,
          status: editing.status,
          excerpt: editing.excerpt,
          content: editing.content,
          coverImageId: editing.coverImageId || null,
          externalUrl: editing.externalUrl || null,
          authorName: editing.authorName || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' });
    if (res.ok) load();
  }

  async function uploadCover() {
    if (!editing || !files || files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', files[0]);
      form.append('category', 'Blog');
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error(await res.text());
      const media = await res.json();
      const mediaId = media?.media?.id || media.id;
      const mediaUrl = media?.media?.url || media.url;
      setEditing({
        ...editing,
        coverImageId: mediaId,
        coverImage: { id: mediaId, url: mediaUrl } as any,
      });
      setFiles(null);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-900'>Blog Posts</h2>
        <Button className='bg-blue-600 hover:bg-blue-700' onClick={create}>
          <Plus className='h-4 w-4 mr-2' /> New Post
        </Button>
      </div>

      {error && <div className='text-sm text-red-600'>{error}</div>}

      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Cover
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Updated
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {posts.map((post) => (
              <tr key={post.id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <img
                    src={post.coverImage?.url || '/placeholder.svg'}
                    className='w-16 h-12 object-cover rounded'
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {post.title}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.status === 'Published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex space-x-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-green-600 hover:text-green-900'
                      onClick={() => setEditing(post)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      size='sm'
                      variant='ghost'
                      className='text-red-600 hover:text-red-900'
                      onClick={() => remove(post.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className='bg-white rounded-lg shadow-md p-6 space-y-4'>
          <h3 className='text-lg font-semibold'>Edit Post</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title
              </label>
              <input
                className='w-full border rounded px-3 py-2'
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status
              </label>
              <select
                className='w-full border rounded px-3 py-2'
                value={editing.status}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value })
                }
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Writer Name
            </label>
            <input
              className='w-full border rounded px-3 py-2'
              placeholder='e.g. Tanusha Dutt Misra'
              value={editing.authorName || ''}
              onChange={(e) =>
                setEditing({ ...editing, authorName: e.target.value })
              }
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Excerpt
            </label>
            <textarea
              className='w-full border rounded px-3 py-2'
              rows={3}
              value={editing.excerpt || ''}
              onChange={(e) =>
                setEditing({ ...editing, excerpt: e.target.value })
              }
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Content
            </label>
            <textarea
              className='w-full border rounded px-3 py-2'
              rows={8}
              value={editing.content || ''}
              onChange={(e) =>
                setEditing({ ...editing, content: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Cover Image
            </label>
            <div className='flex items-center gap-3'>
              <img
                src={editing.coverImage?.url || '/placeholder.svg'}
                className='w-24 h-16 object-cover rounded border'
              />
              <input type='file' onChange={(e) => setFiles(e.target.files)} />
              <Button disabled={!files} onClick={uploadCover}>
                <Upload className='h-4 w-4 mr-1' /> Upload
              </Button>
            </div>
          </div>

          <div className='flex justify-end gap-3'>
            <Button variant='outline' onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className='bg-green-600 hover:bg-green-700'
              onClick={save}
              disabled={loading}
            >
              <Save className='h-4 w-4 mr-1' /> {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
