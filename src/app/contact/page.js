import Image from "next/image";
import Logo from "@public/logo.png";

export default function Contact() {
  return (
    <div>
      <div className="h-16" />
      <div className="flex flex-col items-center py-16 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-primary-main/10 dark:bg-primary-main/20 border border-primary-main/30 rounded-xl p-8 mb-12 text-center">
            <Image src={Logo} alt="Powerful Podcast Logo" width={200} height={200} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-3">Support Us on Patreon</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Help Kyle & Fernando save power metal
            </p>
            <a
              href="https://www.patreon.com/powerfulpodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-primary-main text-white font-bold text-lg px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Become a Patron
            </a>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Follow Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <a
              href="https://www.facebook.com/powerfulpodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gray-400 dark:border-gray-700 hover:border-primary-main hover:bg-primary-main/5 transition-colors"
            >
              <svg className="w-8 h-8 text-primary-main" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold">Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/powerfulpodcast"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gray-400 dark:border-gray-700 hover:border-primary-main hover:bg-primary-main/5 transition-colors"
            >
              <svg className="w-8 h-8 text-primary-main" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span className="font-semibold">Instagram</span>
            </a>
            <a
              href="https://twitter.com/powerfulpm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gray-400 dark:border-gray-700 hover:border-primary-main hover:bg-primary-main/5 transition-colors"
            >
              <svg className="w-8 h-8 text-primary-main" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="font-semibold">X / Twitter</span>
            </a>
            <a
              href="https://bsky.app/profile/powerfulpodcast.bsky.social"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gray-400 dark:border-gray-700 hover:border-primary-main hover:bg-primary-main/5 transition-colors"
            >
              <svg className="w-8 h-8 text-primary-main" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 15.294c-.534.563-2.108 2.165-4.172 3.346C5.764 19.82 3.5 20.5 3.5 20.5s1.43-3.308 1.826-4.157c.38-.818 1.122-1.8 2.362-2.343-1.24-.543-1.982-1.525-2.362-2.343C4.93 9.808 3.5 6.5 3.5 6.5s2.264.68 4.328 1.86c2.064 1.18 3.638 2.783 4.172 3.346.534-.563 2.108-2.165 4.172-3.346C18.236 7.18 20.5 6.5 20.5 6.5s-1.43 3.308-1.826 4.157c-.38.818-1.122 1.8-2.362 2.343 1.24.543 1.982 1.525 2.362 2.343.396.849 1.826 4.157 1.826 4.157s-2.264-.68-4.328-1.86c-2.064-1.18-3.638-2.783-4.172-3.346z"/>
              </svg>
              <span className="font-semibold">Bluesky</span>
            </a>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Email Us</h2>
            <a
              href="mailto:contact@powerful-podcast.com"
              className="inline-flex items-center gap-2 text-primary-main hover:text-primary-dark transition-colors font-semibold text-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M22 4L12 13 2 4"/>
              </svg>
              contact@powerful-podcast.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
