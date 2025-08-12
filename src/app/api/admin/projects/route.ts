import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, unauthorized } from '@/lib/admin';

import { db } from '@/lib/db';
import { cloudinary } from '@/lib/cloudinary';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const data = await req.json();
  const project = await db.project.create({ data });
  return NextResponse.json(project, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const data = await req.json();
  const { id, ...rest } = data;
  const project = await db.project.update({ where: { id }, data: rest });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return unauthorized();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // Delete related images records first
  await db.projectImage.deleteMany({ where: { projectId: id } });

  // Delete Cloudinary assets in the project folder and then the folder itself
  const projectFolder = `utkrisht/projects/${id}`;
  try {
    // List resources by folder and destroy
    const resources: any[] = [];
    let nextCursor: string | undefined;
    do {
      const res: any = await cloudinary.api.resources({ type: 'upload', prefix: projectFolder, max_results: 100, next_cursor: nextCursor });
      resources.push(...(res.resources || []));
      nextCursor = res.next_cursor;
    } while (nextCursor);

    if (resources.length > 0) {
      const publicIds = resources.map(r => r.public_id);
      // Batch delete (in chunks of 100)
      for (let i = 0; i < publicIds.length; i += 100) {
        const chunk = publicIds.slice(i, i + 100);
        await cloudinary.api.delete_resources(chunk);
      }
    }

    // Attempt to delete the folder
    try { await cloudinary.api.delete_folder(projectFolder); } catch {}
  } catch (e) {
    console.error('[CLOUDINARY_FOLDER_DELETE_FAILED]', e);
  }

  // Delete media DB rows that were stored in this project folder
  await db.media.deleteMany({ where: { folder: projectFolder } });

  await db.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
