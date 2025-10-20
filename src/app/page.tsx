/** @format */

import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur mon portfolio</h1>
      <p className="text-lg">Site en construction...</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Projet 1</h2>
          <p className="mb-4">Description du projet</p>
          <Link
            href="/projects/projet-1"
            className="text-blue-600 hover:underline"
          >
            Voir le projet
          </Link>
        </div>
      </div>
    </main>
  );
}
