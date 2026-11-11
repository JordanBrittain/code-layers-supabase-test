import { createClient } from "@/lib/supabase/server";
import { addNote, deleteNote } from "@/app/protected/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Lists the logged-in user's notes from the Supabase "notes" table,
// with a form to add more. Data comes from the real database on every load.
export async function Notes() {
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, body, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4 w-full">
      <form action={addNote} className="flex gap-2">
        <Input name="body" placeholder="Write a note…" maxLength={280} required />
        <Button type="submit">Add</Button>
      </form>

      {error ? (
        <p className="text-sm text-red-500">
          Couldn&apos;t load notes: {error.message}. Did you run supabase/notes.sql?
        </p>
      ) : notes && notes.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-start justify-between gap-4 rounded-md border p-3"
            >
              <div className="flex flex-col gap-1">
                <span>{note.body}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <Button type="submit" variant="ghost" size="sm">
                  Delete
                </Button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No notes yet. Add your first one.</p>
      )}
    </div>
  );
}
