"use client";

import Blog from "@components/Blog/Blog.jsx";
import SortableGrid from "@components/SortableGrid/SortableGrid.jsx";

export default function BlogGrid({ blogs }) {
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

  return (
    <SortableGrid
      items={blogs}
      sortOptions={sortOptions}
      defaultSortBy="createdAt"
      defaultSortOrder="desc"
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
