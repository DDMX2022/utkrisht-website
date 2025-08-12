'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  title?: string | null;
  category?: string | null;
  folder?: string | null;
  createdAt: string;
}

export default function MediaManager() {
  // Hero images
  const [heroFiles, setHeroFiles] = useState<FileList | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  // About images
  const [aboutFiles, setAboutFiles] = useState<FileList | null>(null);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  // Team images
  const [teamFiles, setTeamFiles] = useState<FileList | null>(null); // NEW
  const [uploadingTeam, setUploadingTeam] = useState(false); // NEW

  const [items, setItems] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileErrors, setFileErrors] = useState<Record<string, string>>({});
  const MAX = 10 * 1024 * 1024; // 10MB

  async function fetchMedia() {
    const res = await fetch('/api/admin/media');
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    fetchMedia();
  }, []);

  async function uploadBatch(fileList: FileList, category: string) {
    let uploaded = 0;
    for (const file of Array.from(fileList)) {
      const form = new FormData();
      form.append('file', file);
      form.append('category', category);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      uploaded++;
      setProgress(Math.round((uploaded / fileList.length) * 100));
    }
  }

  function validateSelection(list: FileList | null) {
    if (!list) {
      setFileErrors({});
      return;
    }
    const errs: Record<string, string> = {};
    Array.from(list).forEach((f) => {
      if (f.size > MAX)
        errs[f.name] = `Too large ${(f.size / 1024 / 1024).toFixed(2)}MB`;
    });
    setFileErrors(errs);
  }

  async function handleHeroUpload() {
    if (!heroFiles || Object.keys(fileErrors).length) return;
    setUploadingHero(true);
    setError(null);
    setProgress(0);
    try {
      await uploadBatch(heroFiles, 'Hero');
      await fetchMedia();
      setHeroFiles(null);
      setFileErrors({});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleAboutUpload() {
    if (!aboutFiles || Object.keys(fileErrors).length) return;
    setUploadingAbout(true);
    setError(null);
    setProgress(0);
    try {
      await uploadBatch(aboutFiles, 'About');
      await fetchMedia();
      setAboutFiles(null);
      setFileErrors({});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingAbout(false);
    }
  }

  async function handleTeamUpload() {
    if (!teamFiles || Object.keys(fileErrors).length) return;
    setUploadingTeam(true);
    setError(null);
    setProgress(0);
    try {
      await uploadBatch(teamFiles, 'Team'); // NEW
      await fetchMedia();
      setTeamFiles(null);
      setFileErrors({});
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploadingTeam(false);
    }
  }

  async function deleteMedia(id: string) {
    if (!confirm('Delete this image?')) return;
    const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchMedia();
  }

  const heroItems = items.filter(
    (i) => i.folder === 'utkrisht/hero' || i.category === 'Hero'
  );
  const aboutItems = items.filter(
    (i) => i.folder === 'utkrisht/about' || i.category === 'About'
  );
  const teamItems = items.filter(
    (i) => i.folder === 'utkrisht/team' || i.category === 'Team'
  ); // NEW
  const anyUploading = uploadingHero || uploadingAbout || uploadingTeam; // NEW
  const teamLimitReached = teamItems.length >= 2; // NEW

  return (
    <div className='space-y-12'>
      {/* Shared error / progress */}
      {error && <div className='text-sm text-red-600'>{error}</div>}
      {anyUploading && (
        <div className='w-full h-2 bg-gray-200 rounded overflow-hidden'>
          <div
            className='h-full bg-indigo-600 transition-all'
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Hero Section */}
      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Hero Images</h2>
        <p className='text-sm text-gray-500'>
          Upload images for the homepage hero slideshow. They will appear
          automatically.
        </p>
        <div className='flex items-center gap-4 flex-wrap'>
          <input
            type='file'
            multiple
            onChange={(e) => {
              setHeroFiles(e.target.files);
              validateSelection(e.target.files);
            }}
          />
          <Button
            disabled={
              !heroFiles || uploadingHero || Object.keys(fileErrors).length > 0
            }
            onClick={handleHeroUpload}
            className='bg-purple-600 hover:bg-purple-700'
          >
            {uploadingHero ? 'Uploading...' : 'Upload Hero Images'}
          </Button>
        </div>
        {Object.keys(fileErrors).length > 0 && heroFiles && (
          <ul className='text-xs text-red-600 w-full'>
            {Object.entries(fileErrors).map(([n, m]) => (
              <li key={n}>
                {n}: {m}
              </li>
            ))}
          </ul>
        )}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {heroItems.map((h) => (
            <div key={h.id} className='border rounded overflow-hidden relative'>
              <img
                src={h.url}
                alt={h.title || ''}
                className='w-full h-32 object-cover'
              />
              <button
                onClick={() => deleteMedia(h.id)}
                className='absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded'
              >
                <Trash2 className='h-3 w-3' />
              </button>
            </div>
          ))}
          {heroItems.length === 0 && (
            <div className='col-span-full text-sm text-gray-500'>
              No hero images yet.
            </div>
          )}
        </div>
      </div>

      {/* About Us Section */}
      <div className='space-y-4 border-t pt-8'>
        <h2 className='text-xl font-semibold'>About Us Images</h2>
        <p className='text-sm text-gray-500'>
          Upload images used in the About Us section (first one displayed by
          default).
        </p>
        <div className='flex items-center gap-4 flex-wrap'>
          <input
            type='file'
            multiple
            onChange={(e) => {
              setAboutFiles(e.target.files);
              validateSelection(e.target.files);
            }}
          />
          <Button
            disabled={
              !aboutFiles ||
              uploadingAbout ||
              Object.keys(fileErrors).length > 0
            }
            onClick={handleAboutUpload}
            className='bg-blue-600 hover:bg-blue-700'
          >
            {uploadingAbout ? 'Uploading...' : 'Upload About Images'}
          </Button>
        </div>
        {Object.keys(fileErrors).length > 0 && aboutFiles && (
          <ul className='text-xs text-red-600 w-full'>
            {Object.entries(fileErrors).map(([n, m]) => (
              <li key={n}>
                {n}: {m}
              </li>
            ))}
          </ul>
        )}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {aboutItems.map((a) => (
            <div key={a.id} className='border rounded overflow-hidden relative'>
              <img
                src={a.url}
                alt={a.title || ''}
                className='w-full h-32 object-cover'
              />
              <button
                onClick={() => deleteMedia(a.id)}
                className='absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded'
              >
                <Trash2 className='h-3 w-3' />
              </button>
            </div>
          ))}
          {aboutItems.length === 0 && (
            <div className='col-span-full text-sm text-gray-500'>
              No about images yet.
            </div>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div className='space-y-4 border-t pt-8'>
        <h2 className='text-xl font-semibold'>Team Members Photos</h2>
        <p className='text-sm text-gray-500'>
          Upload photos for the Team section. Recommended square images (e.g.
          800x800).
        </p>
        {teamLimitReached && (
          <div className='text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2'>
            Team photos limit reached (2). Delete one to upload another.
          </div>
        )}
        <div className='flex items-center gap-4 flex-wrap'>
          <input
            type='file'
            multiple
            disabled={teamLimitReached}
            onChange={(e) => {
              setTeamFiles(e.target.files);
              validateSelection(e.target.files);
            }}
          />
          <Button
            disabled={
              teamLimitReached ||
              !teamFiles ||
              uploadingTeam ||
              Object.keys(fileErrors).length > 0
            }
            onClick={handleTeamUpload}
            className='bg-gray-900 hover:bg-gray-800'
          >
            {uploadingTeam ? 'Uploading...' : 'Upload Team Photos'}
          </Button>
        </div>
        {Object.keys(fileErrors).length > 0 && teamFiles && (
          <ul className='text-xs text-red-600 w-full'>
            {Object.entries(fileErrors).map(([n, m]) => (
              <li key={n}>
                {n}: {m}
              </li>
            ))}
          </ul>
        )}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
          {teamItems.map((t) => (
            <div key={t.id} className='border rounded overflow-hidden relative'>
              <img
                src={t.url}
                alt={t.title || ''}
                className='w-full h-32 object-cover'
              />
              <button
                onClick={() => deleteMedia(t.id)}
                className='absolute top-1 right-1 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded'
              >
                <Trash2 className='h-3 w-3' />
              </button>
            </div>
          ))}
          {teamItems.length === 0 && (
            <div className='col-span-full text-sm text-gray-500'>
              No team photos yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
