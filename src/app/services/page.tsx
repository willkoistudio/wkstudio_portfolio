"use client";
/** @format */
import { useLocale, useTranslations } from "next-intl";
import { ChevronsDown, Code, PencilRuler, FilePen, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./services.module.scss";
import { Button } from "@/components/ui/button";

export default function Services() {
  const t = useTranslations();
  const locale = useLocale();

  const scrollToMainContent = () => {
    const servicesList = document.getElementById("services-container");
    if (servicesList) {
      servicesList.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const openDevInquiryForm = () => {
    switch (locale) {
      case "fr":
        window.open("https://forms.gle/2PLRuKwZcdzY1AtS8", "_blank");
        break;
      case "en":
        window.open("https://forms.gle/QqsU4UkRjeEmYtjUA", "_blank");
        break;
    }
  };

  const openDesignInquiryForm = () => {
    switch (locale) {
      case "fr":
        window.open("https://forms.gle/YnGtUrb9n76bFAN18", "_blank");
        break;
      case "en":
        window.open("https://forms.gle/9Ur51f7oApFQd64t7", "_blank");
        break;
    }
  };

  return (
    <main id="services">
      {/* Header */}
      <header
        className={`${styles["services-header"]} flex flex-col justify-center items-center text-center`}
      >
        <div className="container z-1">
          <h1
            className={`${styles["services-title"]} font-black text-white mb-8`}
          >
            {t("services.title")}
          </h1>
          <p
            className={`${styles["services-description"]} text-white mx-auto font-medium`}
            dangerouslySetInnerHTML={{ __html: t.raw("services.description") }}
          />
          <div className="flex flex-wrap gap-6 justify-center my-10 xl:my-14">
            <Code className="w-12 h-12" color="white" />
            <PencilRuler className="w-12 h-12 " color="white" />
            <FilePen className="w-12 h-12 " color="white" />
          </div>
          <div
            className={cn(
              "flex flex-col md:grid md:grid-cols-2 gap-10 lg:gap-10 xl:gap-14 text-white",
              styles["services-header-content"],
            )}
          >
            <div className="text-center md:!text-right w-3/4 md:w-full mx-auto md:mx-0">
              <h2 className="font-bold">{t("services.inquiry")}</h2>
              <p className="text-lg">{t("services.inquiryDescription")}</p>
            </div>
            <div className="text-center md:!text-left w-3/4 md:w-full mx-auto md:mx-0">
              <h2 className="font-bold">{t("services.consultation")}</h2>
              <p className="text-lg">{t("services.consultationDescription")}</p>
            </div>
          </div>
          <ChevronsDown
            className="text-white animate-bounce mx-auto mt-20 cursor-pointer"
            size={32}
            color="white"
            onClick={scrollToMainContent}
          />
        </div>
      </header>

      {/* Content */}
      <section id="services-container">
        {/* Web */}
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          <div
            className={cn(
              styles["services-bg-content"],
              styles["dev-bg-content"],
            )}
          ></div>
          <div className="p-10 md:p-12 2xl:p-14">
            <h2 className="text-primary font-bold text-3xl mb-8">
              {t("services.webDevelopment.title")}
            </h2>
            <h3 className="font-bold text-xl">
              📝 {t("services.webDevelopment.contract")}
            </h3>
            <p>{t("services.webDevelopment.contractDescription")}</p>
            <h3 className="font-bold text-xl">
              ‍👨‍💻 {t("services.webDevelopment.development")}
            </h3>
            <p>{t("services.webDevelopment.developmentDescription")}</p>
            <h3 className="font-bold text-xl">
              ✅ {t("services.webDevelopment.finalApproval")}
            </h3>
            <p>{t("services.webDevelopment.finalApprovalDescription")}</p>
            <h3 className="font-bold text-xl">
              😄 {t("services.webDevelopment.feedback")}
            </h3>
            <p>{t("services.webDevelopment.feedbackDescription")}</p>
            <Button
              className="!text-white rounded-2xl mt-6"
              onClick={openDevInquiryForm}
            >
              <Pencil className="w-4 h-4" />
              {t("services.fillInquiryForm")}
            </Button>
          </div>
        </div>

        {/* Design */}
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          <div className="p-10 md:p-12 2xl:p-14 order-2 md:order-1">
            <h2 className="text-primary font-bold text-3xl mb-8">
              {t("services.webDesign.title")}
            </h2>
            <h3 className="font-bold text-xl">
              📝 {t("services.webDesign.contract")}
            </h3>
            <p>{t("services.webDesign.contractDescription")}</p>
            <h3 className="font-bold text-xl">
              ‍🎨 {t("services.webDesign.design")}
            </h3>
            <p>{t("services.webDesign.designDescription")}</p>
            <h3 className="font-bold text-xl">
              ✅ {t("services.webDesign.finalApproval")}
            </h3>
            <p>{t("services.webDesign.finalApprovalDescription")}</p>
            <h3 className="font-bold text-xl">
              😄 {t("services.webDesign.feedback")}
            </h3>
            <p>{t("services.webDesign.feedbackDescription")}</p>
            <Button
              className="!text-white rounded-2xl mt-6"
              onClick={openDesignInquiryForm}
            >
              <Pencil className="w-4 h-4" />
              {t("services.fillInquiryForm")}
            </Button>
          </div>
          <div
            className={cn(
              styles["services-bg-content"],
              styles["design-bg-content"],
              "order-1",
            )}
          ></div>
        </div>
      </section>
    </main>
  );
}
