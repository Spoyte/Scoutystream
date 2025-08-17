import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/WagmiProvider";
import { WalletConnectEvm } from "@/components/WalletConnectEvm";
import { WalletConnectFlow } from "@/components/WalletConnectFlow";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScoutyStream - AI-Powered Sports Scouting Platform",
  description: "Stream and analyze sports training sessions with blockchain-powered access control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                      ScoutyStream
                    </Link>
                    <div className="hidden md:ml-6 md:flex md:space-x-8">
                      <Link href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                        Gallery
                      </Link>
                      <Link href="/club/upload" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                        Upload
                      </Link>
                      <Link href="/agent" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                        Agent Demo
                      </Link>
                      <Link href="/profile" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                        Profile
                      </Link>
                      <Link href="/infos" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                        Infos
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <WalletConnectEvm />
                    <WalletConnectFlow />
                  </div>
                </div>
              </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
