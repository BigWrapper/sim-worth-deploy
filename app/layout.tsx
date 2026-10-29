import { AuthProvider } from "../lib/auth"
export default function RootLayout({children}){
  return <html><body><AuthProvider>{children}</AuthProvider></body></html>
}
