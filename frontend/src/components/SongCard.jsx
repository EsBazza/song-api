import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'

function getYoutubeThumbnail(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    let videoId = null
    if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v')
    } else if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1)
    }
    if (videoId) return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  } catch {}
  return null
}

export default function SongCard({ song }) {
  const navigate = useNavigate()
  const thumbnail = getYoutubeThumbnail(song.url)

  return (
    <Card
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#fff',
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/watch/${song.id}`)}>
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-[#272727] flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <MusicNoteIcon sx={{ fontSize: 64, color: '#555' }} />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
            <PlayCircleIcon sx={{ fontSize: 56, color: 'white' }} />
          </div>
        </div>

        {/* Info */}
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, color: '#fff', mb: 0.5 }}>
            {song.title || 'Untitled'}
          </Typography>
          {song.artist && (
            <Typography variant="body2" sx={{ color: '#aaa', mb: 0.5 }} noWrap>
              {song.artist}
            </Typography>
          )}
          {song.album && (
            <Typography variant="caption" sx={{ color: '#777' }} noWrap display="block">
              {song.album}
            </Typography>
          )}
          {song.genre && (
            <Chip
              label={song.genre}
              size="small"
              sx={{ mt: 1, bgcolor: '#333', color: '#ccc', fontSize: '0.7rem', height: 20 }}
            />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
