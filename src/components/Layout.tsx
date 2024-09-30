"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./SideBar";
import useIsCollapsed from "@/hooks/useIsCollapsed";
import ThemeToggle from "./theme-toggle";
import { TopNav } from "./TopNav";
import { Input } from "./ui/input";
import { UserNav } from "./UserNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }
  return (
    <div className="relative overflow-hidden bg-background h-svh">
      <a
        className={`fixed left-44 z-[999] -translate-y-52 whitespace-nowrap bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-95 shadow transition hover:bg-primary/90 focus:translate-y-3 focus:transform focus-visible:ring-1 focus-visible:ring-ring`}
        href="#content"
      >
        Skip to Main
      </a>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        <div className="h-full overflow-auto">
          <div className="z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 md:px-8 shadow-none">
            <TopNav links={topNav} />
            <div className="ml-auto flex items-center space-x-4">
              <div>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="md:w-[100px] lg:w-[300px]"
                />
              </div>
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
          <div className="px-4 py-6 md:overflow-hidden md:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

const topNav = [
  {
    title: "Overview",
    href: "/",
    isActive: true,
  },
  {
    title: "Customers",
    href: "/",
    isActive: false,
  },
  {
    title: "Products",
    href: "/",
    isActive: false,
  },
  {
    title: "Settings",
    href: "/",
    isActive: false,
  },
];
