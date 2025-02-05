import { Auth } from "@/components/auth"
import { NoteList } from "@/components/note-list"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Note-Taking App</h1>
      <Auth />
      <NoteList />
    </main>
  )
}

