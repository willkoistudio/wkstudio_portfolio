/** @format */

import type { DocumentActionComponent, DocumentActionsContext } from "sanity";
import { UnpublishIcon } from "@sanity/icons";

export function createUnpublishAction(
  context: DocumentActionsContext,
): DocumentActionComponent {
  const client = context.getClient({ apiVersion: "2023-08-01" });

  return (props) => {
    const { published, id, onComplete } = props;

    if (!published) return null;

    return {
      label: "Dépublier",
      title: "Retirer de la publication et conserver une version brouillon",
      icon: UnpublishIcon,
      tone: "caution",
      onHandle: async () => {
        try {
          const draftId = id.startsWith("drafts.") ? id : `drafts.${id}`;
          const draftDoc = { ...published, _id: draftId };

          delete (draftDoc as { _rev?: string })._rev;
          delete (draftDoc as { _updatedAt?: string })._updatedAt;
          delete (draftDoc as { _createdAt?: string })._createdAt;

          const tx = client.transaction();
          tx.createOrReplace(draftDoc);
          if (!id.startsWith("drafts.")) {
            tx.delete(id);
          } else if (published._id && published._id !== id) {
            tx.delete(published._id);
          }
          await tx.commit({ tag: "unpublish" });

          onComplete();
        } catch (err) {
          console.error("Dépublier: échec", err);
          onComplete();
        }
      },
    };
  };
}
