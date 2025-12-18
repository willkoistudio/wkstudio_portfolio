"use client";
/** @format */
import { useTranslations, useLocale } from "next-intl";
import styles from "./about.module.scss";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { sanity } from "@/lib/sanity.client";
import { highlightedExperiencesQuery } from "@/lib/sanity.queries";
import { HighlightedExperience } from "@/models/highlightedExperience";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import * as z from "zod";
import { useBreakpoint } from "@/hooks/use-breakpoint";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import HighlightedExperienceRow from "@/components/app/about/highlighted-experience-row";

export default function About() {
  const t = useTranslations();
  const locale = useLocale();
  const { executeRecaptcha } = useGoogleReCaptcha() || {};
  const [experiences, setExperiences] = useState<HighlightedExperience[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const breakpoint = useBreakpoint();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await sanity.fetch<HighlightedExperience[]>(
          highlightedExperiencesQuery,
        );
        setExperiences(data);
      } catch (error) {
        console.error("Failed to load highlighted experiences:", error);
      }
    };

    fetchExperiences();
  }, []);

  const formatToLabel = (value?: string) => {
    if (!value) return "";
    return value === "present" ? t("about.present") : value;
  };

  const getTranslatedJobPosition = (experience: HighlightedExperience) => {
    return locale === "en"
      ? (experience.position?.en ?? experience.position?.fr ?? "")
      : (experience.position?.fr ?? experience.position?.en ?? "");
  };

  const formSchema = z.object({
    name: z.string().min(1, t("about.footer.contactForm.formError.name")),
    email: z.email(t("about.footer.contactForm.formError.email")),
    company: z.string().optional(),
    subject: z.string().min(1, t("about.footer.contactForm.formError.subject")),
    message: z.string().min(1, t("about.footer.contactForm.formError.message")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      subject: (
        t.raw("about.footer.contactForm.subject.options") as string[]
      )[0],
      message: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Get reCAPTCHA token - OBLIGATOIRE
      if (!executeRecaptcha) {
        throw new Error(t.raw("about.recaptcha.notAvailable"));
      }

      const recaptchaToken = await executeRecaptcha("contact_form");

      if (!recaptchaToken) {
        throw new Error(t.raw("about.recaptcha.errorToken"));
      }

      // Get honeypot value (should be empty)
      const honeypotValue =
        (document.querySelector('input[name="website"]') as HTMLInputElement)
          ?.value || "";

      // Send to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken,
          honeypot: honeypotValue, // Envoyer le honeypot
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi");
      }

      // Success
      toast.success(t.raw("about.footer.contactForm.success"), {
        position: "top-center",
        className: "!bg-green-500 !text-white !border-green-600",
      });

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue. Veuillez réessayer.",
        {
          position: "top-center",
          className: "!bg-red-500 !text-white !border-red-600",
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="about">
      {/* Info section */}
      <section className="flex flex-col lg:grid lg:grid-cols-2">
        <div className={cn(styles["about-bg-content"])}></div>
        <div className="p-10 md:p-14 lg:p-10 xl:p-14">
          <h2 className="font-bold text-3xl mb-4">{t("about.title")}</h2>
          <p
            className={
              ["sm", "md", "lg"].includes(breakpoint) ? "text-md" : "text-lg"
            }
            dangerouslySetInnerHTML={{ __html: t.raw("about.description") }}
          />
        </div>
      </section>
      {/* Highlighted experience section */}
      <section
        className={cn(styles["about-highlited-experience"], "py-10 md:py-18")}
      >
        <div className="container !px-10">
          <h2 className="font-bold text-3xl mb-12 md:mb-18 text-left md:!text-center">
            {t("about.highlitedExperience")}
          </h2>
          <div className="mt-10 flex flex-col gap-8 md:gap-18">
            {experiences.map((experience, index) => (
              <HighlightedExperienceRow
                index={index}
                key={experience._id}
                experience={experience}
                sinceLabel={t("about.since")}
                toLabel={formatToLabel(experience.to)}
                positionLabel={getTranslatedJobPosition(experience)}
                isEven={(index + 1) % 2 === 0}
              />
            ))}
          </div>
        </div>
        <p className=" text-center text-white text-lg md:text-xl mt-12 md:mt-18 font-medium">
          {t("about.seeMore")}
        </p>
        <Button
          className="!text-white rounded-3xl mt-6 block mx-auto text-lg mb-2 md:mb-0"
          size="lg"
          onClick={() =>
            window.open(
              "https://drive.google.com/file/d/1R8IA6b233GFVSjGzwx3HHb2v-QmWChZq/view?usp=sharing",
              "_blank",
            )
          }
        >
          {t("about.downloadResume")}
        </Button>
      </section>
      {/* Form section */}
      <section
        className={cn(
          styles["about-form-section"],
          "bg-muted p-10 md:p-10 xl:p-18 flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-10 xl:gap-18",
        )}
      >
        <form
          id="contact-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="order-2 lg:order-1 pb-20 lg:pb-0"
        >
          <FieldGroup>
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="contact-form-name"
                      className="text-lg font-medium"
                    >
                      {t("about.footer.contactForm.name")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact-form-name"
                      className="bg-white"
                      aria-invalid={fieldState.invalid}
                      placeholder={t(
                        "about.footer.contactForm.namePlaceholder",
                      )}
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="company"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="contact-form-company"
                      className="text-lg font-medium"
                    >
                      {t("about.footer.contactForm.company")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact-form-company"
                      className="bg-white"
                      placeholder={t(
                        "about.footer.contactForm.companyPlaceholder",
                      )}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="contact-form-email"
                      className="text-lg font-medium"
                    >
                      {t("about.footer.contactForm.email")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      id="contact-form-email"
                      className="bg-white"
                      type="email"
                      placeholder={t(
                        "about.footer.contactForm.emailPlaceholder",
                      )}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="subject"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="contact-form-subject"
                      className="text-lg font-medium"
                    >
                      {t("about.footer.contactForm.subject.title")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange as (value: string) => void}
                      value={field.value}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue
                          placeholder={t(
                            "about.footer.contactForm.subject.placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          t.raw(
                            "about.footer.contactForm.subject.options",
                          ) as string[]
                        )?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="contact-form-message"
                    className="text-lg font-medium"
                  >
                    {t("about.footer.contactForm.message")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="contact-form-message"
                    className="bg-white"
                    placeholder={t(
                      "about.footer.contactForm.messagePlaceholder",
                    )}
                    aria-invalid={fieldState.invalid}
                    rows={6}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Honeypot field - invisible pour les humains, visible pour les bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: "absolute",
                left: "-9999px",
                opacity: 0,
                pointerEvents: "none",
              }}
              aria-hidden="true"
            />
          </FieldGroup>
          <Button
            type="submit"
            size="lg"
            className="mt-8 !text-white rounded-3xl"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("about.footer.contactForm.sending")
              : t("about.footer.contactForm.send")}
          </Button>
        </form>
        <div
          className={cn(
            styles["about-footer-content"],
            "xl:w-3/4 lg:w-full order-1 lg:order-2",
          )}
        >
          <h2
            className="font-bold text-3xl mb-8"
            dangerouslySetInnerHTML={{ __html: t("about.footer.title") }}
          />
          <p
            className={
              ["sm", "md", "lg"].includes(breakpoint) ? "text-md" : "text-lg"
            }
            dangerouslySetInnerHTML={{ __html: t("about.footer.description") }}
          />
        </div>
      </section>
    </main>
  );
}
