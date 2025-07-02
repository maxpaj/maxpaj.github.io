import { WarpEffect } from "@/components/warp";
import type { Metadata, Viewport } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const fira = Fira_Code({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "black",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata: Metadata = {
    title: "maxpaj",
    description: "I am a software developer.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={fira.className}>
                <WarpEffect />
                <main>{children}</main>
            </body>
        </html>
    );
}
