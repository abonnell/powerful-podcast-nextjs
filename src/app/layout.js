"use client";
// import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";

import theme from "../../theme";
const inter = Inter({ subsets: ["latin"] });

const navLinks = {
  0: {
    key: "Home",
    path: "/",
  },
  1: {
    key: "Episodes",
    path: "/episodes",
  },
  2: {
    key: "About",
    path: "/about",
  },
  3: {
    key: "Contact",
    path: "/contact",
  },
  4: {
    key: "Blog",
    path: "/blog",
  },
  5: {
    key: "Gallery",
    path: "/gallery",
  },
};

export default function RootLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <html lang="en">
        <body className={inter.className}>
          <Navbar navLinks={navLinks} />
          {children}
        </body>
      </html>
    </ThemeProvider>
  );
}
