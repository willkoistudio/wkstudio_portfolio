/** @format */

export const projectBySlugQuery = `
*[_type=="project" && select(
  $locale=="fr" => slugFr.current==$slug,
  $locale=="en" => slugEn.current==$slug
)][0]{
  _id, title, summary, date, cover, body, slugFr, slugEn
}`;

export const allProjectsQuery = `
*[_type=="project"] | order(date desc){
  _id, title, summary, date, cover,
  "slugFr": slugFr.current, "slugEn": slugEn.current
}`;

export const projectFiltersQuery = `
*[_type=="projectFilter"] | order(_createdAt asc){
  _id,
  title
}`;
