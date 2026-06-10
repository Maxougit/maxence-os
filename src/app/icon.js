import { ImageResponse } from 'next/og'

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          borderRadius: 12,
          color: '#fff',
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    size
  )
}
