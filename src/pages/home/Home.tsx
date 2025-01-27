import { subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function HomePage() {
  return (
    <DefaultLayout>
      <section id="home" className="flex w-full h-full items-center justify-center flex-grow">
        <div className="max-w-lg text-center inline-block">
          <div className={subtitle({ class: "mt-4" })}>
            Your Web3 AI Agent for Confident Decisions.
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
