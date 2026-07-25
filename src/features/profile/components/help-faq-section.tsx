import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQS } from "@/constants/faq";

export function HelpFaqSection() {
  return (
    <div>
      <h2 className="text-h4 font-semibold text-foreground">Help &amp; FAQ</h2>
      <p className="mt-1 text-body text-muted-foreground">Answers to common questions, without leaving the app.</p>
      <Accordion type="single" collapsible className="mt-4">
        {FAQS.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
