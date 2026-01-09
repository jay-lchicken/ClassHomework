import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { auth0 } from "@/lib/auth0";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Project S304",
  description: "",
};

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}
      >
        <Auth0Provider>
          {session?.user ? (
            children
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-slate-100 text-slate-700">
                      <svg
                        className="w-7 h-7"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                      Sign in
                    </h1>
                    <p className="text-slate-600">
                      Use your school account to continue.
                    </p>
                  </div>

                  <a
                    href="/auth/login"
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 mb-4"
                  >
                    Continue with Auth0
                  </a>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">or</span>
                    </div>
                  </div>

                  <a
                    href="/auth/login?screen_hint=signup"
                    className="block w-full text-center border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 hover:bg-slate-50"
                  >
                    Create account
                  </a>
                </div>
                <p className="text-xs text-slate-500 text-center mt-6">
                  By signing in, you agree to use a verified school email.
                </p>
              </div>
            </div>
          )}
        </Auth0Provider>
      </body>
    </html>
  );
}
