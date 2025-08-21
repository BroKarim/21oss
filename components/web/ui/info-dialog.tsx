import { Button } from "@/components/ui/button-shadcn";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BadgeInfo } from "lucide-react";
import { useState } from "react";
import { SocialFooter } from "@/components/web/ui/social-footer";

export function InfoDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="hidden z-50 md:flex gap-2">
          <BadgeInfo /> About
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:min-w-[900px]">
        <div className="flex gap-8">
          {/* Why I Built This */}
          <div className="flex flex-col gap-3 flex-1 text-[13px] text-gray-11 leading-relaxed">
            <DialogTitle>Why I Built This</DialogTitle>
            <p>I’ve always believed that open-source tools have the power to change how we work, create, and live. But too often, they’re scattered across the internet, hard to discover, and even harder to compare.</p>
            <p>
              I built this platform because I wanted to help people like me—students, developers, researchers, and creators—find the right tools without wasting hours searching. It’s not just about software, it’s about empowering people to
              learn, build, and solve real problems faster.
            </p>
            <p className="font-bold">If even one person finds a tool here that makes their day easier, this project is worth it.</p>
            <SocialFooter />
          </div>

          <div className="w-px h-full bg-gray-a3" />

          {/* About + Roadmap */}
          <div className="flex flex-col gap-3 flex-1 text-[13px] text-gray-11 leading-relaxed">
            <DialogTitle>About</DialogTitle>
            <p>
              This platform is an open-source catalog designed to make discovering tools easier. Every tool is organized by category and subcategory, complete with details like license, stack, and links—so you can find exactly what you
              need, faster.
            </p>
            <p>
              Whether you’re looking for a library, a framework, or an everyday utility, the goal is simple: <span className="italic">make open-source tools accessible, clear, and useful for daily life.</span>
            </p>

            <DialogTitle>Roadmap 🚧</DialogTitle>
            <p>This project is in active development—here’s what’s coming soon:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>More frequent daily updates to the tool database</li>
              <li>Alternative tool recommendations for easier comparison</li>
              <li>Dedicated blog section for tutorials, stories, and updates</li>
              <li>Expanded categories & richer metadata for each tool</li>
              <li>More ways to contribute and suggest tools</li>
            </ul>
            <p>Thanks for being part of the journey! 🙌</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
