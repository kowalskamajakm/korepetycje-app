import Link from "next/link";
import Image from "next/image";
import { GraduationCap, CalendarDays, Wallet, BookOpen, FolderOpen, Star, Phone, Mail } from "lucide-react";
import { ContactForm } from "@/app/contact-form";

const PHONE = "503 654 976";
const PHONE_HREF = "+48503654976";
const CONTACT_EMAIL = "mkowalska.tutoring@gmail.com";
const RATE = "60 zł / h";

const APP_NAME = "MKowalska Tutoring";

const offer = [
  {
    subject: "Matematyka",
    level: "Poziom: szkoła podstawowa",
    details: "Bieżąca nauka oraz przygotowanie do egzaminu ósmoklasisty (E8).",
  },
  {
    subject: "Język angielski",
    level: "Poziom: szkoła podstawowa",
    details: "Bieżąca nauka oraz przygotowanie do egzaminu ósmoklasisty (E8).",
  },
];

const testimonials = [
  {
    name: "Wiktoria",
    context: "dwuletnia współpraca, przygotowanie do egzaminu ósmoklasisty",
    text: "Bardzo polecam te zajęcia z matematyki! Atmosfera była tak przyjazna, że czułam się, jakbym przyszła do koleżanki wspólnie odrobić pracę domową. Wszystko było tłumaczone prostym i zrozumiałym językiem, dzięki czemu nawet trudniejsze tematy szybko stawały się jasne. Zaczynałam z niezbyt dobrym poziomem matematyki, a w krótkim czasie zrobiłam naprawdę ogromne postępy. Udało mi się podnieść swój poziom i zaczęłam regularnie dostawać oceny od 3 do 4. Jestem bardzo zadowolona i oceniam zarówno same zajęcia, na wszystkie 100%! Z całego serca polecam każdemu.",
  },
];

const features = [
  { title: "Grafik lekcji", description: "Zawsze aktualny termin pod ręką.", icon: CalendarDays },
  { title: "Płatności", description: "Jasny status, bez niedomówień.", icon: Wallet },
  { title: "Prace domowe", description: "Zadania zawsze pod ręką.", icon: BookOpen },
  { title: "Materiały", description: "E-booki i pliki dla uczniów.", icon: FolderOpen },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-slate-900">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#kontakt" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">
              Kontakt
            </a>
            <Link
              href="/login"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Zaloguj się
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-6 py-20 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Korepetycje, które naprawdę działają
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-500">
            Matematyka i angielski dla uczniów szkoły podstawowej — w przyjaznej atmosferze,
            z jasnym grafikiem i płatnościami, zawsze w jednym miejscu.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
            >
              Zaloguj się do panelu
            </Link>
            <a
              href="#oferta"
              className="inline-block rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Więcej o korepetycjach
            </a>
          </div>
        </section>

        <section id="o-mnie" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-16 sm:flex-row sm:items-start">
            <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-full border-4 border-surface shadow-md">
              <Image
                src="/maja-photo.jpg"
                alt="Maja Kowalska"
                fill
                sizes="224px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="relative rounded-2xl rounded-tl-none border border-slate-200 bg-surface p-6 shadow-sm sm:before:absolute sm:before:-left-3 sm:before:top-6 sm:before:h-4 sm:before:w-4 sm:before:rotate-45 sm:before:border-b sm:before:border-l sm:before:border-slate-200 sm:before:bg-surface">
              <h2 className="mb-1 text-base font-semibold text-slate-900">Cześć, jestem Maja 👋</h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Uczę matematyki i języka angielskiego na poziomie podstawówki, w tym
                przygotowuję do egzaminu ósmoklasisty. Stawiam na przyjazną atmosferę i
                tłumaczenie nawet trudnych tematów prostym językiem — tak, żeby nauka
                kojarzyła się z realnymi postępami, a nie ze stresem.
              </p>
            </div>
          </div>
        </section>

        <section id="oferta" className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="mb-2 text-center text-2xl font-semibold text-slate-900">Oferta</h2>
          <p className="mb-2 text-center text-sm text-slate-500">
            Stawka: <span className="font-medium text-accent">{RATE}</span>
          </p>
          <p className="mb-8 text-center text-sm font-medium text-green-600">
            Pierwsza lekcja próbna bezpłatna!
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {offer.map((o) => (
              <div key={o.subject} className="rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="mb-1 text-lg font-medium text-slate-900">{o.subject}</h3>
                <p className="mb-2 text-sm font-medium text-accent">{o.level}</p>
                <p className="text-sm text-slate-500">{o.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="opinie" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="mb-8 text-center text-2xl font-semibold text-slate-900">Opinie</h2>
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((t) => (
                <div key={t.name} className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm">
                  <div className="mb-3 flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
                  <p className="text-sm font-medium text-slate-900">
                    {t.name}
                    <span className="ml-1 font-normal text-slate-400">— {t.context}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="mb-8 text-center text-xl font-semibold text-slate-900">
            Wygodny panel dla uczniów i rodziców
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-5 text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-medium text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-500">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="kontakt" className="border-t border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <h2 className="mb-2 text-center text-2xl font-semibold text-slate-900">Kontakt</h2>
            <p className="mb-10 text-center text-sm text-slate-500">
              Napisz, zadzwoń albo wyślij wiadomość przez formularz.
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-4">
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-4 transition hover:border-accent-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Telefon</p>
                    <p className="text-sm font-medium text-slate-900">{PHONE}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-surface p-4 transition hover:border-accent-soft"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">E-mail</p>
                    <p className="text-sm font-medium text-slate-900">{CONTACT_EMAIL}</p>
                  </div>
                </a>
              </div>

              <div className="rounded-xl border border-slate-200 bg-surface p-6 shadow-sm">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-xs text-slate-400">
        {APP_NAME}
      </footer>
    </div>
  );
}
