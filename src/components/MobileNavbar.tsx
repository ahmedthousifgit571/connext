"use client";

import { Bell, Home, User, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

const navLinks = [{ name: "Home", href: "/", icon: Home }];

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        >
          <SheetHeader>
            <SheetTitle className="text-left text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Menu
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-3 mt-6">
            {navLinks.map((link, index) => (
              <Button
                key={link.name}
                variant="ghost"
                className="flex items-center gap-3 justify-start px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium"
                asChild
                onClick={() => setShowMobileMenu(false)}
              >
                <Link href={link.href}>
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              </Button>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              {isSignedIn ? (
                <div className="flex flex-col space-y-3">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium"
                    asChild
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Link href="/notifications">
                      <Bell className="w-5 h-5" />
                      Notifications
                      <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 justify-start px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 font-medium"
                    asChild
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Link href="/profile">
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                  </Button>

                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 justify-start w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </SignOutButton>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Get Started
                  </Button>
                </SignInButton>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;
