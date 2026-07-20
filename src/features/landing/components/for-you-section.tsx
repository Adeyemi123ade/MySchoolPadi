"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, BookOpen, Megaphone, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

type Audience = {
  value: string;
  label: string;
  title: string;
  description: string;
  features: { icon: LucideIcon; label: string }[];
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
};

const AUDIENCES: Audience[] = [
  {
    value: "student",
    label: "For Students",
    title: "Never miss a class update again",
    description:
      "See announcements from every course you're enrolled in, bookmark the ones you need later, and get notified the moment something new is posted.",
    features: [
      { icon: BookOpen, label: "One feed for all your enrolled courses" },
      { icon: Bell, label: "Real-time notifications for new announcements" },
      { icon: Users, label: "A profile tied to your matric number & department" },
    ],
    image: "/images/auth/student-illustration.webp",
    imageAlt: "A student carrying textbooks and a backpack",
    href: ROUTES.registerStudent,
    cta: "Register as a Student",
  },
  {
    value: "lecturer",
    label: "For Lecturers",
    title: "Reach your students without the noise",
    description:
      "Publish announcements straight to the students enrolled in your courses, track what you've shared, and manage everything from one dashboard.",
    features: [
      { icon: Megaphone, label: "Publish announcements per course" },
      { icon: ShieldCheck, label: "Verified staff accounts" },
      { icon: BookOpen, label: "A dashboard built around your courses" },
    ],
    image: "/images/auth/lecturer-illustration.webp",
    imageAlt: "A lecturer holding a folder and books",
    href: ROUTES.registerLecturer,
    cta: "Register as a Lecturer",
  },
];

export function ForYouSection() {
  return (
    <section id="for-you" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-h2 font-bold text-foreground">Designed for everyone on campus</h2>
        <p className="mt-3 text-body-lg text-muted-foreground">
          The same platform, tailored to how students and lecturers each use it.
        </p>
      </div>

      <Tabs defaultValue="student" className="mt-12 items-center">
        <TabsList>
          {AUDIENCES.map((audience) => (
            <TabsTrigger key={audience.value} value={audience.value}>
              {audience.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {AUDIENCES.map((audience) => (
          <TabsContent key={audience.value} value={audience.value} className="w-full">
            <div className="grid items-center gap-10 rounded-xl border border-border p-6 md:grid-cols-2 md:p-10">
              <div className="relative mx-auto h-72 w-full max-w-xs overflow-hidden rounded-lg bg-primary/5 md:h-96">
                <Image
                  src={audience.image}
                  alt={audience.imageAlt}
                  fill
                  sizes="(min-width: 768px) 384px, 90vw"
                  className="-scale-x-100 object-contain object-bottom"
                />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-h3 font-semibold text-foreground">{audience.title}</h3>
                <p className="text-body text-muted-foreground">{audience.description}</p>

                <ul className="flex flex-col gap-3">
                  {audience.features.map((feature) => (
                    <li key={feature.label} className="flex items-center gap-3 text-body text-foreground">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <feature.icon className="size-4" />
                      </span>
                      {feature.label}
                    </li>
                  ))}
                </ul>

                <Button className="mt-2 w-fit" asChild>
                  <Link href={audience.href}>{audience.cta}</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
