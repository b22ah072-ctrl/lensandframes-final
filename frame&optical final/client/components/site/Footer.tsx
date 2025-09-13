export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-200" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4">
          <a href="#home" className="flex items-center gap-3">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2F4831fa9ad687427b9a1f1e60e3ebd1e7?format=webp&width=800" alt="Lens & Frame logo" className="h-9 w-auto" />
            <img src="https://cdn.builder.io/api/v1/image/assets%2F29bacb3ca6f64d399ffc1c3b10eddcb2%2Fe8eafd03a90142ed8cfde299911116e2?format=webp&width=800" alt="Lens & Frame Optics" className="h-6 w-auto" />
          </a>
          <p className="text-sm text-neutral-400 max-w-sm">Premium eyewear, expert eye care. Discover designer frames and personalized service.</p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/share/15R6Bajx1HX/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-md bg-neutral-800 p-2 hover:bg-neutral-700"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'><path d='M13 22v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3V2h-3a5 5 0 0 0-5 5v2H6v4h3v9h4Z'/></svg></a>
            <a href="https://www.instagram.com/lensandframes.qa?igsh=MWEybnRzcjI4aHM2cg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-md bg-neutral-800 p-2 hover:bg-neutral-700"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'><path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z'/></svg></a>
            <a href="https://wa.me/97433509888" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-md bg-neutral-800 p-2 hover:bg-neutral-700"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-4'><path d='M20.52 3.48A11.88 11.88 0 0 0 12 0C5.37 0 .01 5.36 0 12a11.9 11.9 0 0 0 2.88 7.56L0 24l4.68-1.24A11.94 11.94 0 0 0 12 24c6.63 0 12-5.36 12-12 0-1.98-.44-3.86-1.48-5.52zM12 21.5a9.35 9.35 0 0 1-5.02-1.45l-.36-.22-2.78.74.74-2.71-.23-.35A9.4 9.4 0 1 1 21.4 12 9.4 9.4 0 0 1 12 21.5z'/><path d='M17.57 14.6c-.28-.14-1.66-.82-1.92-.92-.26-.1-.45-.14-.64.14s-.74.92-.9 1.11c-.16.18-.32.2-.6.07a6.83 6.83 0 0 1-2.01-1.24c-.37-.32-.62-.71-.69-.99-.07-.28-.01-.56.21-.76.22-.2.48-.47.71-.71.23-.24.31-.42.46-.7.15-.28.08-.53-.04-.7-.11-.17-.64-1.54-.88-2.11-.23-.55-.47-.48-.64-.49l-.55-.01c-.18 0-.47.07-.72.33-.25.26-.95.93-.95 2.27s.97 2.63 1.1 2.81c.14.18 1.9 2.9 4.61 3.95 1.74.75 2.46.8 3.34.67.54-.08 1.66-.67 1.9-1.32.24-.65.24-1.21.17-1.33-.07-.12-.26-.18-.54-.32z'/></svg></a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-neutral-400">
            <li><a href="#about" className="hover:text-white">About</a></li>
            <li><a href="#collection" className="hover:text-white">Premium Collection</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-neutral-400">
            <li>Eye Examinations</li>
            <li>Designer Eyewear</li>
            <li>Contact Lenses</li>
            <li>Lens Fitting</li>
            <li>Vision Testing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact Info</h3>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><a className="hover:text-white" href="tel:+97433509888">+974 3350 9888</a></li>
            <li><a className="hover:text-white" href="mailto:Lensandframesqa@gmail.com">Lensandframesqa@gmail.com</a></li>
            <li>Al Sadd , Doha , Qatar</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Lens & Frame Optics. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-300">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
