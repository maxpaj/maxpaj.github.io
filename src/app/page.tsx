import { AsciiEffect } from "@/components/ascii";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="p-4 flex gap-8 items-center flex-wrap flex-row-reverse md:flex-row md:flex-nowrap">
                <AsciiEffect width={20} height={20} />
                <div className="flex flex-col gap-4">
                    <section>
                        <p className="max-w-md">
                            I am a freelance software developer who thrives on
                            solving problems, building usable software,
                            improving developer workflows and getting stuff
                            done.
                        </p>
                    </section>
                    <section className="flex gap-4">
                        <Link href="https://github.com/maxpaj">GitHub</Link>
                        <Link href="https://www.linkedin.com/in/maxpaj/">
                            LinkedIn
                        </Link>
                    </section>
                </div>
            </div>
        </>
    );
}
