"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ChevronRight, User, LogOut, LayoutDashboard, Bookmark, Share2, Bell, Settings } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const isPartnerRoute = pathname.startsWith("/partner") || pathname.startsWith("/partners") || pathname.startsWith("/apply");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Initial for circular avatar fallback
  const firstLetter = user?.name ? user.name.trim().charAt(0).toUpperCase() : "M";

  // Links for Consumer realm
  const consumerLinks = [
    { href: "/experiences", label: "Experiences" },
    { href: "/cities", label: "Cities" },
    { href: "/interests", label: "Interests" },
    { href: "/about", label: "About" },
    { href: "/partners", label: "Partners" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  // Links for Partner realm
  const partnerLinks = [
    { href: "/partners", label: "Overview" },
    { href: "/partners/artists", label: "For Artists" },
    { href: "/partners/venues", label: "For Venues" },
    { href: "/partners/hosts", label: "For Hosts" },
    { href: "/", label: "Consumer Site" },
  ];

  const activeNavLinks = isPartnerRoute ? partnerLinks : consumerLinks;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-obsidian/90 backdrop-blur-md border-b border-warm-ivory/10 py-4 shadow-2xl"
            : "bg-gradient-to-b from-obsidian/90 via-obsidian/40 to-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Central Reusable Logo */}
          <Logo
            variant="full"
            size="md"
            href={isPartnerRoute ? "/partners" : "/"}
            badgeText={isPartnerRoute ? "Partner Atelier" : undefined}
          />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase text-muted-stone">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-300 hover:text-warm-ivory ${isActive ? "text-warm-ivory font-medium" : ""
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-champagne"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTAs & Auth Header State */}
          <div className="flex items-center space-x-4 z-50">
            {user ? (
              /* Logged In State: Profile Circular Avatar with Dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-champagne/20 border border-champagne/50 text-champagne font-editorial text-sm font-semibold flex items-center justify-center hover:bg-champagne hover:text-obsidian transition-all cursor-pointer shadow-md overflow-hidden"
                  aria-label="User account menu"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{firstLetter}</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 glass-panel p-2 rounded-xl border border-warm-ivory/20 shadow-2xl bg-obsidian/95 backdrop-blur-xl z-50 space-y-1 font-mono text-xs text-warm-ivory"
                    >
                      <div className="px-3 py-2 border-b border-warm-ivory/10 mb-1">
                        <p className="font-editorial text-sm text-warm-ivory font-medium truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-stone truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-champagne/15 hover:text-champagne transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-champagne" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard?tab=profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-champagne/15 hover:text-champagne transition-colors"
                      >
                        <User className="w-4 h-4 text-champagne" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard?tab=experiences"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-champagne/15 hover:text-champagne transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-champagne" />
                        <span>My Experiences</span>
                      </Link>

                      <Link
                        href="/dashboard?tab=referrals"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-champagne/15 hover:text-champagne transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-champagne" />
                        <span>Referral Circle</span>
                      </Link>

                      <Link
                        href="/dashboard?tab=notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-champagne/15 hover:text-champagne transition-colors"
                      >
                        <Bell className="w-4 h-4 text-champagne" />
                        <span>Notifications</span>
                      </Link>

                      <div className="border-t border-warm-ivory/10 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Unauthenticated State: Sign In + Early Access */
              <>
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-widest text-muted-stone hover:text-champagne transition-colors font-mono hidden sm:inline-block"
                >
                  Sign In
                </Link>

                {isPartnerRoute ? (
                  <div className="hidden sm:flex items-center gap-3">
                    <Link
                      href="/apply/artist"
                      className="px-4 py-2 text-xs uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-colors rounded-sm"
                    >
                      Apply Artist
                    </Link>
                    <Link
                      href="/apply/venue"
                      className="px-4 py-2 text-xs uppercase tracking-widest font-medium text-obsidian bg-champagne hover:bg-warm-ivory transition-colors rounded-sm shadow-md"
                    >
                      Apply Venue
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/early-access"
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-widest font-medium text-obsidian bg-warm-ivory hover:bg-champagne transition-colors duration-300 rounded-sm shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Join Early Access
                  </Link>
                )}
              </>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-warm-ivory hover:text-champagne transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-obsidian/98 backdrop-blur-2xl flex flex-col justify-between px-8 pt-28 pb-12 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

            <div className="relative z-10 flex flex-col space-y-6">
              <span className="text-xs uppercase tracking-widest text-champagne/80 font-mono">
                {isPartnerRoute ? "Partner Atelier" : "Cultural Realm"}
              </span>
              <div className="flex flex-col space-y-4">
                {activeNavLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="group flex items-center justify-between font-editorial text-4xl text-warm-ivory hover:text-champagne transition-colors py-2 border-b border-warm-ivory/10"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-6 h-6 text-muted-stone group-hover:text-champagne group-hover:translate-x-1 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-warm-ivory/10 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMobileMenu}
                    className="w-full py-3.5 text-center text-xs uppercase tracking-widest font-medium bg-champagne text-obsidian rounded-sm"
                  >
                    My Dashboard ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      handleLogout();
                    }}
                    className="w-full py-3 text-center text-xs uppercase tracking-widest font-mono border border-rose-500/40 text-rose-300 rounded-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="w-full py-3.5 text-center text-xs uppercase tracking-widest font-mono border border-warm-ivory/20 text-warm-ivory rounded-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/early-access"
                    onClick={closeMobileMenu}
                    className="w-full py-4 text-center text-xs uppercase tracking-widest font-medium bg-champagne text-obsidian rounded-sm"
                  >
                    Join Early Access
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
