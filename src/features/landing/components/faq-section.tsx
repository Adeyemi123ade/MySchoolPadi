import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/constants/faq";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="text-center">
        <h2 className="text-h2 font-bold text-foreground">Frequently asked questions</h2>
      </div>

      <Accordion type="single" collapsible className="mt-10">
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
