const STEPS = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Register as a student or lecturer with your school email. Verify it with a one-time code and you're in.",
  },
  {
    number: "02",
    title: "Get matched to your courses",
    description:
      "Students see announcements for the courses they're enrolled in. Lecturers publish to the courses they teach.",
  },
  {
    number: "03",
    title: "Stay in the loop",
    description:
      "New announcements, reminders and updates show up in your feed and notifications — no more digging through chats.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-muted/40 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-h2 font-bold text-foreground">How it works</h2>
          <p className="mt-3 text-body-lg text-muted-foreground">
            Three steps between you and a clearer inbox.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col gap-3">
              <span className="text-display font-bold text-primary/25">{step.number}</span>
              <h3 className="text-h4 font-semibold text-foreground">{step.title}</h3>
              <p className="text-body text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
