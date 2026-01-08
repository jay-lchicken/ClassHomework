import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from '@auth0/nextjs-auth0/client';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project S208",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <Auth0Provider>
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
