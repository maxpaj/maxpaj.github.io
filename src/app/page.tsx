import Image from "next/image";
import logo from "@/assets/logo.svg";

export default function Home() {
    return (
        <>
            <main className="flex min-h-screen flex-col p-8">
                <div>
                    <Image
                        src={logo}
                        priority
                        alt="Logo"
                        width={28}
                        className="mb-12"
                    />
                    <section>
                        <p>
                            I am a freelance software developer who thrives on
                            solving problems, building amazing products,
                            improving developer workflows and getting stuff
                            done.
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}
