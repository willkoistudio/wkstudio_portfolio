/** @format */

export const projectBySlugQuery = `
*[_type=="project" && (slugFr.current==$slug || slugEn.current==$slug)][0]{
  _id,
  title,
  "featuredImage": featuredImage.asset->url,
  "featuredImageWidth": featuredImage.asset->metadata.dimensions.width,
  "featuredImageHeight": featuredImage.asset->metadata.dimensions.height,
  "gallery": gallery[].asset->url,
  content,
  "type": type->{
    _id,
    title
  },
  "status": status->{
    _id,
    title
  },
  year,
  "tools": tools[]->{
    _id,
    title
  },
  website,
  "client": client->{
    _id,
    title
  },
  "slugFr": slugFr.current,
  "slugEn": slugEn.current,
  "projectFilterType": projectFilterType->{
    _id,
    title,
    color,
    className
  }
}`;

export const allProjectsQuery = `
  *[_type=="project"] | order(date desc){
    _id,
    title,
    "featuredImage": featuredImage.asset->url,
    "featuredImageWidth": featuredImage.asset->metadata.dimensions.width,
    "featuredImageHeight": featuredImage.asset->metadata.dimensions.height,
    "gallery": gallery[].asset->url,
    content,
    "type": type->{
      _id,
      title
    },
    "status": status->{
      _id,
      title
    },
    year,
    "tools": tools[]->{
      _id,
      title
    },
    website,
    "client": client->{
      _id,
      title
    },
    "slugFr": slugFr.current,
    "slugEn": slugEn.current,
    "projectFilterType": projectFilterType->{
      _id,
      title,
      color,
      className
    }
  }`;

export const projectFiltersQuery = `
*[_type=="projectFilter"] | order(_createdAt asc){
  _id,
  title,
  color,
  className
}`;

export const highlightedExperiencesQuery = `
*[_type=="highlightedExperience"] | order(from desc){
  _id,
  company,
  "logo": logo.asset->url,
  position,
  from,
  "to": to.year,
  clients
}`;
