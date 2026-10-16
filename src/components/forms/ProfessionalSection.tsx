import { story } from "@/content/copy";
import { InquiryForm } from "./InquiryForm";
import { LabelCrop } from "@/components/ui/LabelCrop";

export function ProfessionalSection() {
  return (
    <section id="profesionales" aria-labelledby="profesionales-title" data-tone="dark" className="relative overflow-hidden bg-noche py-28 text-pergamino md:py-40">
      <div className="container-editorial grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow text-oro-claro">{story.professionals.eyebrow}</p>
          <h2 id="profesionales-title" className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
            {story.professionals.title}
          </h2>
          <p className="display mt-6 text-2xl italic text-pergamino/85">{story.professionals.body}</p>
          <p className="mt-8 max-w-[40ch] leading-relaxed text-pergamino/75">
            Restaurantes, vinotecas, comercios especializados, distribuidores y hostelería: cuéntanos qué necesitas y
            te enviaremos la información disponible.
          </p>
          <div className="mt-14 hidden max-w-xs opacity-80 md:block">
            <LabelCrop cx={0.5} cy={0.62} span={0.7} ratio={1.6} alt="" className="bg-noche" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <InquiryForm kind="profesional" tone="dark" />
        </div>
      </div>
    </section>
  );
}
