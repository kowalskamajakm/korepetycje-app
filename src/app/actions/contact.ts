"use server";

import { sendEmail } from "@/lib/email";

export type ContactFormState = { error?: string; success?: boolean } | undefined;

const CONTACT_EMAIL = "mkowalska.tutoring@gmail.com";

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot - bots tend to fill every field, real visitors never see this one.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { success: true };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const grade = String(formData.get("grade") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !grade || !message) {
    return { error: "Wypełnij wszystkie pola." };
  }

  try {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Wiadomość ze strony od ${name} (${subject}, klasa ${grade})`,
      html: `
        <p><strong>Od:</strong> ${name} (${email})</p>
        <p><strong>Przedmiot:</strong> ${subject}</p>
        <p><strong>Klasa:</strong> ${grade}</p>
        <p><strong>Wiadomość:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });
  } catch {
    return { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie później." };
  }

  return { success: true };
}
