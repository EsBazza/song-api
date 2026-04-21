const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function fetchSongs() {
  const res = await fetch(`${BASE_URL}/alonzo/songs`)
  if (!res.ok) throw new Error(`Failed to fetch songs: ${res.status}`)
  return res.json()
}

export async function fetchSong(id) {
  const res = await fetch(`${BASE_URL}/alonzo/songs/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch song ${id}: ${res.status}`)
  return res.json()
}

export async function searchSongs(keyword) {
  if (!keyword.trim()) return fetchSongs()
  const res = await fetch(`${BASE_URL}/alonzo/songs/search/${encodeURIComponent(keyword)}`)
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  return res.json()
}
