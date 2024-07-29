"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import LOGO from "@/assets/logo.png";
import { usePathname } from "next/navigation";
import { IoMdMenu as Hamburger, IoMdClose as Close } from "react-icons/io";
import Drawer from "@mui/material/Drawer";
import userContext from "@/hooks/useUserContext";

const Nav = () => {
  const [show, setShow] = useState<boolean>(false);
  const { user, userLogout } = userContext();
  const pathname = usePathname();
  const links = {
    first: [
      { title: "phrases", href: "/", condition: Boolean(user) },
      { title: "settings", href: "/settings", condition: Boolean(user) },
    ],
    last: [
      { title: "login", href: "/auth/login", condition: Boolean(!user) },
      {
        title: "register",
        href: "/auth/register",
        condition: Boolean(!user),
        asButton: true,
      },
      {
        title: "logout",
        href: "#",
        condition: Boolean(user),
        asButton: true,
        handleClick: () => userLogout(),
      },
    ],
  };

  return (
    <nav className="border-b-2 border-secondary h-20 bg-white">
      <div className="container h-full flex gap-48 justify-between object-contain p-2">
        {/* Logo */}
        <Link href="/" className="h-full flex items-center w-44">
          <Image src={LOGO} alt="Phrase picker" priority className="" />
        </Link>

        <ul className="hidden md:flex items-center gap-10 uppercase">
          {links.first.map(
            (link, ind) =>
              link.condition && (
                <li key={ind}>
                  <Link
                    href={link.href}
                    className={`${pathname === link.href && "font-bold"} text-primary`}
                  >
                    {link.title}
                  </Link>
                </li>
              )
          )}
        </ul>

        <ul className="hidden md:flex items-center gap-10 uppercase">
          {links.last.map(
            (link, ind) =>
              link.condition && (
                <li key={ind}>
                  <Link
                    href={link.href}
                    className={`${pathname === link.href && "font-bold"} ${link.asButton ? buttonVariants({ variant: "default" }) : "text-primary"}`}
                    onClick={link?.handleClick}
                  >
                    {link.title}
                  </Link>
                </li>
              )
          )}
        </ul>

        {/* Mobile */}
        <div className="flex md:hidden items-center full">
          <Button variant="secondary" size="icon" onClick={() => setShow(true)}>
            <Hamburger size={30} className="text-primary" />
          </Button>
        </div>

        <>
          <Drawer open={show} anchor="right" onClose={() => setShow(false)}>
            <div className="w-64 space-y-10 m-3 flex flex-col">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShow(false)}
                className="ml-auto"
              >
                <Close size={30} className="text-destructive" />
              </Button>

              <div>
                <ul className="space-y-10 uppercase">
                  {links.first.map(
                    (link, ind) =>
                      link.condition && (
                        <li key={ind}>
                          <Link
                            href={link.href}
                            className={`${pathname === link.href && "font-bold"} text-primary`}
                          >
                            {link.title}
                          </Link>
                        </li>
                      )
                  )}
                  {links.last.map(
                    (link, ind) =>
                      link.condition && (
                        <li key={ind}>
                          <Link
                            href={link.href}
                            className={`${pathname === link.href && "font-bold"} ${link.asButton ? buttonVariants({ variant: "default" }) : "text-primary"}`}
                            onClick={link?.handleClick}
                          >
                            {link.title}
                          </Link>
                        </li>
                      )
                  )}
                </ul>
              </div>
            </div>
          </Drawer>
        </>
      </div>
    </nav>
  );
};

export default Nav;
