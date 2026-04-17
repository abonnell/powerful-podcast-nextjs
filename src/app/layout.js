import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

const navLinks = [
  {
    key: "Home",
    path: "/",
  },
  {
    key: "Episodes",
    path: "/episodes",
  },
  {
    key: "Blog",
    path: "/blog",
  },
  {
    key: "About",
    path: "/about",
  },
  {
    key: "Contact",
    path: "/contact",
  },
  {
    key: "Gallery",
    path: [
      {
        key: "Blogs",
        path: "/gallery/blogs",
      },
      {
        key: "Episodes",
        path: "/gallery/episodes",
      },
    ],
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar navLinks={navLinks} />
        {children}
      </body>
    </html>
  );
}
