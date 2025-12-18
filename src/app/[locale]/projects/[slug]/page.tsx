/** @format */

import { setRequestLocale } from "next-intl/server";
import ProjectPage, {
  generateMetadata as baseGenerateMetadata,
} from "../../../projects/[slug]/page";

interface LocaleProjectPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: LocaleProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return baseGenerateMetadata({
    params: Promise.resolve({ slug }),
  });
}

export default async function LocaleProjectPage({
  params,
}: LocaleProjectPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return <ProjectPage params={Promise.resolve({ slug })} />;
}
