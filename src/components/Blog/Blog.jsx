import Image from "next/image";
import Link from "next/link";

export default function Blog({
  img,
  imgAlt,
  title,
  href,
  previewText,
  author,
  createdAt,
}) {
  return (
    <Link href={href}>
      <div className="text-center relative overflow-hidden rounded-lg max-w-[400px] mx-auto">
        <Image
          src={img}
          alt={imgAlt}
          width={400}
          height={400}
          className="object-cover w-full h-[400px]"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-black/50 p-4">
          <h2 className="text-xl font-bold text-white mb-1 text-left">
            {title}
          </h2>
          <div className="text-sm text-white/80 text-left mb-1">
            {author && <span>By {author}</span>}
            {author && createdAt && <span> • </span>}
            {createdAt && (
              <span>
                {new Date(createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <p className="text-sm text-white text-left line-clamp-2">
            {previewText}
          </p>
        </div>
      </div>
    </Link>
  );
}
