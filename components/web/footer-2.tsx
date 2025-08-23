"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button-shadcn";
import { Icons } from "./icons";
function Footer() {
  return (
    <footer className=" py-12 px-4 md:px-6 bg-background">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Link href="/" className="flex items-center">
              <Icons.logo className="w-8" />
              <h2 className="text-lg font-bold">210SS</h2>
            </Link>

            <h1 className="dark:text-gray-300 mt-4">
              Build by{" "}
              <span className="dark:text-[#039ee4]">
                <Link href="https://x.com/arihantCodes">@Brokarim</Link>
              </span>
            </h1>
            <div className="mt-2">
              <Link href="https://x.com/compose/tweet?text=Finding%20the%20right%20open%E2%80%91source%20tool%20is%20messy%E2%80%94%23210SS%20makes%20it%20simple.%20What%E2%80%99s%20one%20underrated%20tool%20you%20can%E2%80%99t%20live%20without%3F%20%40brokariim">
                <Button variant="ghost" className="border">
                  Share Your Thoughts On
                  <Icons.twitter className="icon-class ml-1 w-3.5 " />
                </Button>
              </Link>
            </div>
            <p className="text-sm dark:text-gray-400 mt-5">© {new Date().getFullYear()} 210SS. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Awesome list
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Alternative
                  </Link>
                </li>
                <li>
                  <Link href="https://blog.arihant.us/" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Categories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="https://github.com/BroKarim/open-layout" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Github
                  </Link>
                </li>
                <li>
                  <Link href="https://www.threads.com/@brokariim" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Thread
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/BroKariim" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    X
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy-policy" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/tos" className="text-gray-600 hover:text-white dark:text-gray-400 ">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className=" w-full flex mt-4 items-center justify-center   ">
          <h1 className="text-center text-3xl md:text-5xl lg:text-[10rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 to-neutral-900 select-none">21OSS.com</h1>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
