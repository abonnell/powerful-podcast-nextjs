"use client";

import Blog from "@components/Blog/Blog.jsx";
import SortableGrid from "@components/SortableGrid/SortableGrid.jsx";

export default function BlogGrid({ blogs, authors = [] }) {
  const sortOptions = [
    {
      value: "createdAt",
      label: "Date",
      compareFn: (a, b, sortOrder) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      },
    },
    {
      value: "author",
      label: "Author",
      compareFn: (a, b, sortOrder) => {
        const authorA = a.author || "";
        const authorB = b.author || "";
        return sortOrder === "desc"
          ? authorB.localeCompare(authorA)
          : authorA.localeCompare(authorB);
      },
    },
  ];

  // Create filter options from authors list
  const filterOptions = authors.map((author) => {
    const authorName = `${author.firstname} ${author.lastname}`.trim();
    return {
      value: author.id.toString(),
      label: authorName,
      filterFn: (blog) => blog.author === authorName,
    };
  });

  return (
    <SortableGrid
      items={blogs}
      sortOptions={sortOptions}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
      filterOptions={filterOptions}
      defaultFilterBy="all"
      emptyMessage="No blogs found."
      renderItem={(blog, index) => (
        <Blog
          key={index}
          img={blog.img}
          imgAlt={blog.imgAlt}
          title={blog.title}
          href={blog.href}
          previewText={blog.previewText}
          author={blog.author}
          createdAt={blog.createdAt}
        />
      )}
    />
  );
}
