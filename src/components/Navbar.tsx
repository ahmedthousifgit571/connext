import Link from "next/link";
import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";

async function  Navbar() {
  const user = await currentUser()
  if(user){
    await syncUser() //POST REQUEST TO CLERK TO NEONDB
  } 
  return (
    <nav className="sticky top-0 w-full border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-gray-200/20 dark:border-gray-700/20 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 group">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-mono tracking-wider hover:scale-105 transition-transform duration-200"
            >
              Connext
            </Link>
          </div>

          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
