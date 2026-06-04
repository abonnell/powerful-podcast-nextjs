import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "powerful. the power metal podcast",
  openGraph: {
    title: "powerful. the power metal podcast",
    url: "https://www.powerful-podcast.com",
    siteName: "powerful. the power metal podcast",
    images: [
      {
        url: "/logo.png",
        width: 942,
        height: 942,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "powerful. the power metal podcast",
    images: ["/logo.png"],
  },
};

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
