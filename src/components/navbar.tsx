import { Link } from "@heroui/link";
import { Navbar as HeroUINavbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { BookText } from "lucide-react";
import { ButtonConnectWallet } from "./wallet/button-connect-wallet";
import clsx from "clsx";
import { useState } from "react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState(window.location.pathname);

  return (
    <HeroUINavbar maxWidth="full" position="sticky" className="bg-transparent">
      <NavbarContent className="basis-1/5 sm:basis-full hidden sm:block" justify="start">
        <div className="relative flex items-center border border-gray-600 rounded-full w-fit">
          <div className="realtive flex p-1">
            {siteConfig.navItems.map((item) => (
              <NavbarItem
                key={item.href}
                className="relative navbar-item"
              >
                <Link
                  className={clsx(
                    "text-sm font-normal px-4 py-2 rounded-full",
                    activeTab === item.href ? "text-background" : "text-foreground"
                  )}
                  href={item.href}
                  onClick={() => setActiveTab(item.href)}
                >
                  {activeTab === item.href && (
                    <motion.span
                      layoutId="bubble"
                      className="absolute inset-0 z-10 bg-foreground mix-blend-difference"
                      style={{ borderRadius: 9999 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="z-10">{item.label}</span>
                </Link>
              </NavbarItem>
            ))}
          </div>
        </div>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-4">
          <Link isExternal href={siteConfig.links.docs} title="Docs">
            <BookText className="text-default-500 h-5 w-5" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <ButtonConnectWallet />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4">
        <div className="flex justify-between items-center w-full">
          <NavbarMenuToggle className="p-5 -ml-5"/>
          <div className="flex flex-row gap-3">
            <Link isExternal href={siteConfig.links.docs} title="Docs">
              <BookText className="text-default-500 h-5 w-5" />
            </Link>
            <Link isExternal href={siteConfig.links.github} title="GitHub">
              <GithubIcon className="text-default-500" />
            </Link>
            <ThemeSwitch />
          </div>
        </div>
      </NavbarContent>

      <NavbarMenu className="z-50 absolute inset-0 full-height">
        <div className="mx-4 flex-col gap-5 flex-grow inline-flex pt-10">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className={clsx(
                  "border-l-2 pl-5 h-10",
                  activeTab === item.href ? "border-primary text-primary" : "border-transparent"
                )}
                color="foreground"
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
