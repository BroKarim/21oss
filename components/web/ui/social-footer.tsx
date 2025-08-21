import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Twitter } from "lucide-react";

const socialLinks = [
  {
    href: "https://github.com/BroKarim",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://x.com/BroKariim",
    label: "X",
    icon: Twitter,
  },
];

export function SocialFooter({ referral = "ray-so" }: { referral?: string }) {
  return (
    <div className="pt-2 mt-auto">
      <div className="flex items-center gap-2 mt-2 justify-between">
        <a href={`https://raycast.com/#ref=ray-so-${referral}`} className="flex items-center gap-1.5 text-gray-12 group">
          <Avatar>
            <AvatarImage src="https://github.com/BroKarim.png" />
            <AvatarFallback>DZ</AvatarFallback>
          </Avatar>
          <span className="text-[13px] font-medium group-hover:underline">Made by BroKarim</span>
        </a>
        <div className="flex gap-3">
          {socialLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-9 hover:text-gray-11 transition-colors">
              <link.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
