import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const patchSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().optional(),
  color: z.string().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [note] = await query('SELECT * FROM notes WHERE id = $1', [id]);
    if (!note) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = patchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: (result.error as any).errors }, { status: 400 });
    }
    const { title, content, color } = result.data;
    const [note] = await query(
      'UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), color = COALESCE($3, color), updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, content, color, id]
    );
    if (!note) return NextResponse.json({ error: 'No encontrada' }, { status: 404 });
    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await query('DELETE FROM notes WHERE id = $1', [id]);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}