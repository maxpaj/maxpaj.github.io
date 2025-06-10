import { AsciiEffect } from "@/components/ascii";

export default function Home() {
    return (
        <>
            <section className="absolute z-10 flex max-w-(--breakpoint-md) flex-col p-8 xs:flex-wrap">
                <div className="flex gap-2 items-center">
                    <AsciiEffect width={30} height={30} />

                    <section>
                        <p>
                            I am a freelance software developer who thrives on
                            solving problems, building amazing products,
                            improving developer workflows and getting stuff
                            done.
                        </p>
                    </section>
                </div>
            </section>
        </>
    );
}
