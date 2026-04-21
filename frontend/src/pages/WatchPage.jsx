import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import AlbumIcon from '@mui/icons-material/Album'
import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'
import IconButton from '@mui/material/IconButton'
import { fetchSong, fetchSongs } from '../api/songApi'
import SongCard from '../components/SongCard'

function getYoutubeEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    let videoId = null
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
      videoId = u.searchParams.get('v')
    } else if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1)
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
  } catch {}
  return null
}

function isVideoUrl(url) {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

export default function WatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [song, setSong] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchSong(id), fetchSongs()])
      .then(([s, all]) => {
        setSong(s)
        setRelated(all.filter((x) => String(x.id) !== String(id)).slice(0, 12))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const embedUrl = song ? getYoutubeEmbedUrl(song.url) : null
  const isDirectVideo = song && !embedUrl && isVideoUrl(song.url)

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Back button */}
        <div className="mb-4 flex items-center gap-2">
          <IconButton onClick={() => navigate(-1)} sx={{ color: '#fff' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body2" sx={{ color: '#aaa' }}>Back</Typography>
        </div>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main player area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <>
                <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '16/9', bgcolor: '#2a2a2a', borderRadius: 2 }} />
                <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a', mt: 2 }} width="60%" height={32} />
                <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a' }} width="40%" />
              </>
            ) : song ? (
              <>
                {/* Player */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={song.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : isDirectVideo ? (
                    <video
                      src={song.url}
                      controls
                      autoPlay
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a]">
                      <MusicNoteIcon sx={{ fontSize: 80, color: '#333' }} />
                      <Typography variant="body2" sx={{ color: '#555', mt: 2 }}>
                        {song.url ? 'Unsupported media format' : 'No video available'}
                      </Typography>
                      {song.url && (
                        <a
                          href={song.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-red-400 hover:text-red-300 underline text-sm"
                        >
                          Open in new tab
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Song details */}
                <div className="mt-4">
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                    {song.title || 'Untitled'}
                  </Typography>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {song.artist && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <PersonIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{song.artist}</Typography>
                      </div>
                    )}
                    {song.album && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <AlbumIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{song.album}</Typography>
                      </div>
                    )}
                    {song.genre && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <CategoryIcon sx={{ fontSize: 18 }} />
                        <Chip label={song.genre} size="small" sx={{ bgcolor: '#333', color: '#ccc' }} />
                      </div>
                    )}
                  </div>

                  <Divider sx={{ my: 3, borderColor: '#333' }} />

                  {/* Song metadata card */}
                  <div className="bg-[#1a1a1a] rounded-xl p-4 grid grid-cols-2 gap-4">
                    {[
                      { label: 'Title', value: song.title, icon: <MusicNoteIcon sx={{ fontSize: 18, color: '#ff0000' }} /> },
                      { label: 'Artist', value: song.artist, icon: <PersonIcon sx={{ fontSize: 18, color: '#ff0000' }} /> },
                      { label: 'Album', value: song.album, icon: <AlbumIcon sx={{ fontSize: 18, color: '#ff0000' }} /> },
                      { label: 'Genre', value: song.genre, icon: <CategoryIcon sx={{ fontSize: 18, color: '#ff0000' }} /> },
                    ].filter(item => item.value).map((item) => (
                      <div key={item.label} className="flex items-start gap-2">
                        {item.icon}
                        <div>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>{item.label}</Typography>
                          <Typography variant="body2" sx={{ color: '#ddd' }}>{item.value}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Side rail */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              More Songs
            </Typography>
            <div className="flex flex-col gap-3">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-3 rounded-lg overflow-hidden bg-[#1a1a1a] p-2">
                      <Skeleton variant="rectangular" width={120} height={68} sx={{ bgcolor: '#2a2a2a', borderRadius: 1, flexShrink: 0 }} />
                      <div className="flex-1">
                        <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a' }} />
                        <Skeleton variant="text" sx={{ bgcolor: '#2a2a2a' }} width="70%" />
                      </div>
                    </div>
                  ))
                : related.map((s) => (
                    <SongCard key={s.id} song={s} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
