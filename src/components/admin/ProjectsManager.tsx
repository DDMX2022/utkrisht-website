'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ProjectImage {
  id: string;
  url: string;
  order: number;
  projectId: string;
}
interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  summary?: string | null;
  content?: string | null;
  createdAt: string;
  images?: ProjectImage[];
}

interface MediaItem {
  id: string;
  url: string;
  category?: string | null;
  folder?: string | null;
}

export default function ProjectsManager() {
  const [items, setItems] = useState<Project[]>([]);
  const [images, setImages] = useState<Record<string, ProjectImage[]>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Living Room',
    status: 'Draft',
    summary: '',
    content: '',
  });
  const [creating, setCreating] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState<{
    title: string;
    category: string;
    status: 'Draft' | 'Published';
    summary: string;
    content: string;
  }>({
    title: '',
    category: 'Living Room',
    status: 'Draft',
    summary: '',
    content: '',
  });

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    if (res.ok) {
      const list: Project[] = await res.json();
      setItems(list);
      // seed images map
      const map: Record<string, ProjectImage[]> = {};
      for (const p of list)
        map[p.id] = (p.images || []).sort((a, b) => a.order - b.order);
      setImages(map);
    }
    const m = await fetch('/api/admin/media');
    if (m.ok) setMedia(await m.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProject() {
    if (!form.title.trim()) return;
    setCreating(true);
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      await load();
      setForm({
        title: '',
        category: 'Living Room',
        status: 'Draft',
        summary: '',
        content: '',
      });
    }
    setCreating(false);
  }

  async function attachImage(projectId: string, mediaId: string, url: string) {
    const res = await fetch('/api/admin/project-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        mediaId,
        url,
        order: images[projectId]?.length || 0,
      }),
    });
    if (res.ok) {
      const img = await res.json();
      setImages((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), img],
      }));
    }
  }

  async function removeImage(id: string, projectId: string) {
    const res = await fetch(`/api/admin/project-images?id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok)
      setImages((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] || []).filter((i) => i.id !== id),
      }));
  }

  async function uploadDirect(files: FileList, projectId: string) {
    setUploadingFor(projectId);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append('file', file);
        form.append('category', 'Projects');
        form.append('projectId', projectId);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: form,
        });
        if (res.ok) {
          const { projectImage } = await res.json();
          setImages((prev) => ({
            ...prev,
            [projectId]: [...(prev[projectId] || []), projectImage],
          }));
        }
      }
    } finally {
      setUploadingFor(null);
      const m = await fetch('/api/admin/media');
      if (m.ok) setMedia(await m.json());
    }
  }

  async function updateStatus(id: string, status: 'Draft' | 'Published') {
    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const proj = await res.json();
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: proj.status } : p))
      );
    }
  }

  async function saveEdit() {
    if (!editingId) return;
    setEditSaving(true);
    const res = await fetch('/api/admin/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, ...editForm }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      setEditingId(null);
    }
    setEditSaving(false);
  }

  const projectMedia = useMemo(
    () =>
      media.filter(
        (m) =>
          m.folder?.startsWith('utkrisht/projects') || m.category === 'Projects'
      ),
    [media]
  );
  const allowedCategories = [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Office',
    'Dining Room',
    'Bathroom',
  ];

  return (
    <div className='space-y-8'>
      <div className='flex items-end gap-3 flex-wrap'>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Title</label>
          <input
            className='border rounded px-3 py-2'
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Category</label>
          <select
            className='border rounded px-3 py-2'
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
          >
            <option>Living Room</option>
            <option>Bedroom</option>
            <option>Kitchen</option>
            <option>Office</option>
            <option>Dining Room</option>
            <option>Bathroom</option>
          </select>
        </div>
        <div>
          <label className='block text-sm text-gray-600 mb-1'>Status</label>
          <select
            className='border rounded px-3 py-2'
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </div>
        <div className='flex-1 min-w-[240px]'>
          <label className='block text-sm text-gray-600 mb-1'>Summary</label>
          <input
            className='border rounded px-3 py-2 w-full'
            value={form.summary}
            onChange={(e) =>
              setForm((f) => ({ ...f, summary: e.target.value }))
            }
          />
        </div>
      </div>
      <div>
        <label className='block text-sm text-gray-600 mb-1'>Content</label>
        <textarea
          className='border rounded px-3 py-2 w-full min-h-[100px]'
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
        />
      </div>
      <div className='flex gap-2'>
        <Button
          className='bg-blue-600 hover:bg-blue-700'
          onClick={createProject}
          disabled={creating}
        >
          <Plus className='h-4 w-4 mr-2' />
          {creating ? 'Creating...' : 'Add Project'}
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {items.map((p) => (
          <div key={p.id} className='bg-white rounded-lg shadow-md p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-semibold text-gray-900'>{p.title}</h3>
                <p className='text-sm text-gray-500'>
                  {p.category} • {new Date(p.createdAt).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                    p.status === 'Published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {p.status === 'Published' ? (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => updateStatus(p.id, 'Draft')}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    className='bg-green-600 hover:bg-green-700'
                    size='sm'
                    onClick={() => updateStatus(p.id, 'Published')}
                  >
                    Publish
                  </Button>
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setSelectedProject(p)}
                >
                  Manage Images
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setEditingId(p.id);
                    setEditForm({
                      title: p.title,
                      category: p.category,
                      status: p.status as 'Draft' | 'Published',
                      summary: p.summary || '',
                      content: p.content || '',
                    });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={async () => {
                    if (
                      !confirm(
                        'Delete this project? This will remove its folder in Cloudinary.'
                      )
                    )
                      return;
                    const res = await fetch(`/api/admin/projects?id=${p.id}`, {
                      method: 'DELETE',
                    });
                    if (res.ok) {
                      setItems((prev) => prev.filter((x) => x.id !== p.id));
                      setSelectedProject(null);
                      if (editingId === p.id) setEditingId(null);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            {editingId === p.id && (
              <div className='mt-4 p-4 border rounded bg-gray-50 space-y-3'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-sm text-gray-600 mb-1'>
                      Title
                    </label>
                    <input
                      className='border rounded px-3 py-2 w-full'
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-600 mb-1'>
                      Category
                    </label>
                    <select
                      className='border rounded px-3 py-2 w-full'
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, category: e.target.value }))
                      }
                    >
                      {allowedCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>
                    Summary
                  </label>
                  <input
                    className='border rounded px-3 py-2 w-full'
                    value={editForm.summary}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, summary: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>
                    Content
                  </label>
                  <textarea
                    className='border rounded px-3 py-2 w-full min-h-[100px]'
                    value={editForm.content}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, content: e.target.value }))
                    }
                  />
                </div>
                <div className='flex gap-2'>
                  <Button
                    className='bg-blue-600 hover:bg-blue-700'
                    onClick={saveEdit}
                    disabled={editSaving}
                  >
                    {editSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant='outline' onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {selectedProject?.id === p.id && (
              <div className='mt-4'>
                <div className='mb-4 p-3 border rounded bg-gray-50'>
                  <label className='block text-sm text-gray-600 mb-2'>
                    Upload new images to this project
                  </label>
                  <div className='flex items-center gap-3'>
                    <input
                      type='file'
                      multiple
                      onChange={(e) =>
                        e.target.files && uploadDirect(e.target.files, p.id)
                      }
                    />
                    {uploadingFor === p.id && (
                      <span className='text-xs text-gray-500 flex items-center gap-1'>
                        <Upload className='h-3 w-3' /> Uploading...
                      </span>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {(images[p.id] || []).map((img) => (
                    <div key={img.id} className='relative border rounded'>
                      <img src={img.url} className='w-full h-24 object-cover' />
                      <button
                        className='absolute top-1 right-1 bg-red-600 text-white p-1 rounded'
                        onClick={() => removeImage(img.id, p.id)}
                      >
                        <Trash2 className='h-3 w-3' />
                      </button>
                    </div>
                  ))}
                </div>

                <div className='mt-3'>
                  <label className='block text-sm text-gray-600 mb-1'>
                    Add from Media (Projects folders)
                  </label>
                  <div className='grid grid-cols-3 md:grid-cols-6 gap-2 max-h-56 overflow-auto border rounded p-2'>
                    {projectMedia.map((m) => (
                      <button
                        key={m.id}
                        className='border rounded overflow-hidden group'
                        onClick={() => attachImage(p.id, m.id, m.url)}
                      >
                        <img
                          src={m.url}
                          className='w-full h-20 object-cover group-hover:opacity-80'
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
