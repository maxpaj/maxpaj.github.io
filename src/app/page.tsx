import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="p-4 flex items-center flex-wrap flex-row">
                <div className="flex flex-col gap-4 px-8 py-24">
                    <section>
                        <p className="max-w-md">
                            I am a freelance software developer who thrives on
                            making things, solving problems, building usable
                            software and improving developer workflows.
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
