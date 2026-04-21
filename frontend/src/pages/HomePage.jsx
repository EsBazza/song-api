import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import { fetchSongs, searchSongs } from '../api/songApi'
import SongCard from '../components/SongCard'

function SongCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1a1a1a]">
      <Skeleton variant="rectangular" sx={{ aspectRatio: '16/9', width: '100%', bgcolor: '#2a2a2a' }} />
      <div className="p-3">
        <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a' }} width="80%" />
        <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a' }} width="60%" />
      </div>
    </div>
  )
}

export default function HomePage() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    setError(null)
    const load = searchQuery ? searchSongs(searchQuery) : fetchSongs()
    load
      .then(setSongs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [searchQuery])

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {searchQuery && (
          <Typography variant="h6" sx={{ mb: 3, color: '#aaa' }}>
            Results for: <span className="text-white font-semibold">"{searchQuery}"</span>
          </Typography>
        )}

        {!searchQuery && (
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            All Songs
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SongCardSkeleton key={i} />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MusicNoteIcon sx={{ fontSize: 80, color: '#333', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#555' }}>
              {searchQuery ? 'No songs found for your search' : 'No songs yet'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#444', mt: 1 }}>
              {searchQuery ? 'Try a different keyword' : 'Add songs via the API to get started'}
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
