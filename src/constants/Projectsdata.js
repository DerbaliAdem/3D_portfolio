import {
  Layers,
  Server,
  Database,
  Wind,
  Code,
  Palette,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

const tech = (name, icon) => ({ name, icon });

export const projects = [
  {
    title: "ClinicHub",
    category: "Clinic Management System",
    description:
      "A full-stack clinic management platform that simplifies healthcare administration by managing doctors, patients, appointments, and appointment statuses through a secure, responsive dashboard.",
    image: "/assets/projects/clinicHub.jpg",
    technologies: [
      tech("React", Layers),
      tech("NestJS", Server),
      tech("TypeScript", Code),
      tech("PostgreSQL", Database),
      tech("Prisma", Database),
      tech("JWT Auth", ShieldCheck),
      tech("Tailwind CSS", Wind),
    ],
  },
  {
    title: "CV Score",
    category: "AI-Powered CV Analysis Platform",
    description:
      "A web application that analyzes CVs, evaluates their quality, and provides a score with actionable feedback to help users improve their resumes and better match job requirements.",
    image: "/assets/projects/CvScore.png",
    technologies: [
      tech("React", Layers),
      tech("TypeScript", Code),
      tech("NestJS", Server),
      tech("PostgreSQL", Database),
      tech("AI / NLP", Sparkles),
      tech("Tailwind CSS", Wind),
    ],
  },
  {
    title: "UniManage",
    category: "University Management System",
    description:
      "A full-stack university management platform that simplifies academic administration by managing students, teachers, courses, and enrollments through an organized, user-friendly interface.",
    image: "/assets/projects/uniManeg.png",
    technologies: [
      tech("React", Layers),
      tech("TypeScript", Code),
      tech("NestJS", Server),
      tech("PostgreSQL", Database),
      tech("Tailwind CSS", Wind),
    ],
  },
  {
    title: "Calkoul",
    category: "Smart Calculation Mobile App",
    description:
      "A mobile application built to simplify calculations through a clean, intuitive interface, giving users a fast and convenient calculation experience.",
    image: "/assets/projects/calkoulImage.jpg",
    technologies: [
      tech("React Native", Smartphone),
      tech("TypeScript", Code),
      tech("Expo", Smartphone),
      tech("AsyncStorage", Database),
    ],
  },
  {
    title: "Personal Portfolio",
    category: "Frontend Developer Portfolio",
    description:
      "A modern, interactive developer portfolio showcasing my projects, technical skills, and professional background through a space-inspired design, smooth scroll-driven animations, parallax effects, and responsive layouts.",
    image: "/assets/projects/portfolio.png",
    technologies: [
      tech("React", Layers),
      tech("TypeScript", Code),
      tech("Framer Motion", Palette),
      tech("Tailwind CSS", Wind),
      tech("Vite", Globe),
    ],
  },
];