"use client";
// import "./globals.css";
// import { Inter } from "next/font/google";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";

import theme from "../../theme";
// const inter = Inter({ subsets: ["latin"] });

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
    key: "About",
    path: "/about",
  },
  {
    key: "Contact",
    path: "/contact",
  },
  {
    key: "Blog",
    path: "/blog",
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
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <html lang="en">
        <body>
          <Navbar navLinks={navLinks} />
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}
