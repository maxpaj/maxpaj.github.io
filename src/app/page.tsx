import logo from "@/assets/logo.svg";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <section className="absolute z-10 flex max-w-screen-sm flex-col p-4">
                <div>
                    <Image
                        src={logo}
                        priority
                        alt="Logo"
                        width={28}
                        className="mb-6"
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
            </section>
        </>
    );
}
