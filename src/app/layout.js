import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import { auth0 } from "@/lib/auth0";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Auth0Provider>
            {session?.user ? (
              children
            ) : (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-sm border p-8">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-muted text-muted-foreground">
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
                    <h1 className="text-2xl font-semibold mb-2">
                      Sign in
                    </h1>
                    <p className="text-muted-foreground">
                      Use your school account to continue.
                    </p>
                  </div>

                  <a
                    href="/auth/login"
                    className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-colors duration-200 mb-4"
                  >
                    Continue with Google
                  </a>

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-card text-muted-foreground">or</span>
                    </div>
                  </div>

                  <a
                    href="/auth/login?screen_hint=signup"
                    className="block w-full text-center border hover:border-foreground/20 font-semibold py-3 px-4 rounded-xl transition-colors duration-200 hover:bg-accent"
                  >
                    Create account
                  </a>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-6">
                  By signing in, you agree to use a verified school email.
                </p>
              </div>
            </div>
            )}
          </Auth0Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
