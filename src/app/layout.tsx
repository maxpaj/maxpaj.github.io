import { NoiseEffect } from "@/components/noise";
import type { Metadata, Viewport } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const fira = Fira_Code({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "black",
    width: "device-width",
    initialScale: 1
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
                <NoiseEffect />
                <main>{children}</main>
            </body>
        </html>
    );
}
