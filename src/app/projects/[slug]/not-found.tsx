/** @format */

import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ProjectNotFound() {
  const t = await getTranslations();

  return (
    <main className="container py-12">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-black mb-4">Projet non trouvé</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Le projet que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link
          href="/projects"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-foreground transition-colors"
        >
          Retour aux projets
        </Link>
      </div>
    </main>
  );
}
