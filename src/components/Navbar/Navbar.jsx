"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@public/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({ navLinks }) {
  const path = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      const isDark = savedMode === "true";
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      // Default to light mode
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [path]);

  const handleOpenGallery = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseGallery = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const isActive = (itemPath) => {
    if (itemPath === "/") return path === "/";
    return path.startsWith(itemPath);
  };

  const renderDesktopMenuItems = navLinks.map((item, index) => {
    if (item.key === "Gallery") {
      return (
        <div key={`${item.key}-${index}`} className="relative group">
          <button
            onMouseEnter={handleOpenGallery}
            className={`px-4 py-4 hover:text-primary-main transition-colors no-underline ${
              path.includes("gallery")
                ? "text-primary-main"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {item.key.toUpperCase()}
            <svg
              className="inline-block ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {anchorEl && (
            <div
              onMouseLeave={handleCloseGallery}
              className="absolute left-0 mt-0 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
            >
              {item.path.map((galleryItem, galleryIndex) => (
                <Link
                  key={`${galleryItem.key}-${galleryIndex}`}
                  href={galleryItem.path}
                  className={`block px-4 py-4 hover:text-primary-main transition-colors no-underline ${
                    path.includes(galleryItem.path)
                      ? "text-primary-main"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                  onClick={handleCloseGallery}
                >
                  {galleryItem.key.toUpperCase()}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <Link
        key={`${item.key}-${index}`}
        href={item.path}
        className={`px-4 py-4 hover:text-primary-main transition-colors no-underline ${
          path === item.path
            ? "text-primary-main"
            : "text-gray-900 dark:text-gray-100"
        }`}
        onMouseEnter={handleCloseGallery}
      >
        {item.key.toUpperCase()}
      </Link>
    );
  });

  const renderMobileMenuItems = navLinks.map((item, index) => {
    if (item.key === "Gallery") {
      return (
        <div key={`${item.key}-${index}`}>
          <button
            onClick={() => setAnchorEl(anchorEl ? null : {})}
            className={`w-full text-left px-4 py-4 flex items-center justify-between no-underline ${
              path.includes("gallery")
                ? "text-primary-main"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {item.key.toUpperCase()}
            <svg
              className={`w-4 h-4 transition-transform ${anchorEl ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {anchorEl && (
            <div className="bg-white dark:bg-gray-900">
              <Link
                href="/gallery"
                className={`block px-8 py-4 hover:text-primary-main transition-colors no-underline ${
                  path === "/gallery"
                    ? "text-primary-main"
                    : "text-gray-900 dark:text-gray-100"
                }`}
                onClick={handleCloseMenu}
              >
                ALL
              </Link>
              {item.path.map((galleryItem, galleryIndex) => (
                <Link
                  key={`${galleryItem.key}-${galleryIndex}`}
                  href={galleryItem.path}
                  className={`block px-8 py-4 hover:text-primary-main transition-colors no-underline ${
                    path.includes(galleryItem.path)
                      ? "text-primary-main"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                  onClick={handleCloseMenu}
                >
                  {galleryItem.key.toUpperCase()}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <Link
        key={`${item.key}-${index}`}
        href={item.path}
        className={`block px-4 py-4 hover:text-primary-main transition-colors no-underline ${
          path === item.path
            ? "text-primary-main"
            : "text-gray-900 dark:text-gray-100"
        }`}
        onClick={handleCloseMenu}
      >
        {item.key.toUpperCase()}
      </Link>
    );
  });

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed w-full top-0 z-50 shadow-md">
      {!isMobile && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center justify-center flex-1">
                <Link href="/">
                  <Image src={Logo} alt="logo" width={50} height={50} />
                </Link>
                <div className="flex items-center">
                  {renderDesktopMenuItems}
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    className="w-6 h-6 text-gray-900 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-900 dark:text-gray-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/">
            <Image src={Logo} alt="logo" width={50} height={50} />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-gray-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-900 dark:text-gray-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={handleOpenMenu}
              className="text-gray-900 dark:text-gray-100 p-2"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {openMenu && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleCloseMenu}
            >
              <div
                className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">{renderMobileMenuItems}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
