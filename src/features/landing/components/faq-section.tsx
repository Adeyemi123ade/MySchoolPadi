import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Is MySchoolPadi free to use?",
    answer:
      "Yes. Creating a student or lecturer account and using the dashboard, announcements and courses is free. We don't have any paid features live yet.",
  },
  {
    question: "Do I need my school's permission to sign up?",
    answer:
      "No — you can register with your school email as either a student or a lecturer. You'll see announcements for the courses you're enrolled in or teaching.",
  },
  {
    question: "Is this available for my institution?",
    answer:
      "MySchoolPadi is in early access and growing. If your institution isn't set up yet, reach out and we'll help get it added.",
  },
  {
    question: "How does account verification work?",
    answer:
      "After you register, we send a one-time verification code to your email. You'll need to confirm it before you can log in, which helps keep announcements limited to real students and staff.",
  },
  {
    question: "What happens to my data?",
    answer:
      "Your profile and course data are stored securely with role-based access controls, so students and lecturers only ever see what's relevant to them.",
  },
];

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
