import { Bell, Home, User, Star, DollarSign, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "./ModeToggle";
import { currentUser } from "@clerk/nextjs/server";

const navLinks = [{ name: "Home", href: "/", icon: Home }];

async function DesktopNavbar() {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-1">
      {/* Navigation Links */}
      <div className="flex items-center space-x-1 mr-6">
        {navLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            className="group relative px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
            asChild
          >
            <Link href={link.href}>
              <span className="relative z-10 flex items-center gap-2">
                <link.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{link.name}</span>
              </span>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
            </Link>
          </Button>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <ModeToggle />

        {user ? (
          <>
            <Button
              variant="ghost"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              asChild
            >
              <Link href="/notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </span>
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              asChild
            >
              <Link
                href={`/profile/${
                  user.username ??
                  user.emailAddresses[0].emailAddress.split("@")[0]
                }`}
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">Profile</span>
              </Link>
            </Button>

            <UserButton />
          </>
        ) : (
          <SignInButton mode="modal">
            <Button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Get Started
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default DesktopNavbar;
