import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '$IM Worth',
    short_name: 'SIM Worth',
    description: '$IM Banc - SIM Worth',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ]
  }
}
