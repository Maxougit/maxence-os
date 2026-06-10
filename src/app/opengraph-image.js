import { ImageResponse } from 'next/og'
import { profile } from '@/data/cv'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = `${profile.name} — ${profile.jobTitle}`

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            fontSize: 64,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          M
        </div>
        <div style={{ fontSize: 64, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ fontSize: 36, marginTop: 16, color: '#93c5fd' }}>
          {profile.jobTitle}
        </div>
        <div style={{ fontSize: 24, marginTop: 32, color: '#94a3b8' }}>
          cv.maxenceleroux.fr
        </div>
      </div>
    ),
    size
  )
}
