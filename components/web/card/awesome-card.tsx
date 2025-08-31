"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, GitFork, Copy } from "lucide-react";
import { Button } from "@/components/ui/button-shadcn";

const GitHubRepoCard = () => {
  const referralUrl = `https://peerlist.io/tes`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const repoData = {
    name: "awesome-react-components",
    description: "A curated collection of awesome React components and libraries for building modern web applications.",
    url: "https://github.com/johndoe/awesome-react-components",
    stars: 2847,
    forks: 156,
    owner: {
      avatar: "https://avatars.githubusercontent.com/u/1?v=4",
      name: "John Doe",
      username: "johndoe",
    },
    contributors: [
      { avatar: "https://avatars.githubusercontent.com/u/2?v=4", name: "Alice Chen", username: "alicech" },
      { avatar: "https://avatars.githubusercontent.com/u/3?v=4", name: "Bob Smith", username: "bobsmith" },
      { avatar: "https://avatars.githubusercontent.com/u/4?v=4", name: "Carol Wilson", username: "carolw" },
      { avatar: "https://avatars.githubusercontent.com/u/5?v=4", name: "David Brown", username: "davidb" },
    ],
  };

  const getAvatarPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const radius = 50;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <Card className="w-full mx-auto  border text-white md:py-1">
      <CardContent className="py-0">
        <div className="flex items-center gap-4">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Owner Avatar */}
              <Avatar className="w-12 h-12 z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-800">
                <AvatarImage src={repoData.owner.avatar} alt={repoData.owner.name} />
                <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                  {repoData.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {/* Contributors */}
              {repoData.contributors.map((contributor, index) => {
                const position = getAvatarPosition(index, repoData.contributors.length);
                return (
                  <Avatar
                    key={contributor.username}
                    className="absolute w-8 h-8 ring-2 ring-gray-600 ring-offset-1 ring-offset-gray-800 hover:ring-blue-400 transition-all duration-200 hover:scale-110"
                    style={{
                      left: `50%`,
                      top: `50%`,
                      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                    }}
                  >
                    <AvatarImage src={contributor.avatar} alt={contributor.name} />
                    <AvatarFallback className="bg-gray-600 text-white text-[10px]">
                      {contributor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          </div>

          {/* Repository Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">{repoData.name}</h3>
              <p className="text-gray-300 text-xs leading-snug line-clamp-3">{repoData.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>{repoData.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                <span>{repoData.forks}</span>
              </div>
              <div className="text-gray-500">{repoData.contributors.length + 1} contributors</div>
            </div>

            {/* Owner Info */}
            <div className="text-xs text-gray-400">
              by <span className="text-blue-400 font-medium">{repoData.owner.name}</span>
            </div>

            {/* Action Button */}
            <div className="pt-1">
              <div className="flex items-center gap-2 bg-black/30 rounded-md p-2 border border-gray-700">
                <span className="text-gray-300 text-[11px] font-mono flex-1 truncate">{referralUrl}</span>
                <Button variant="secondary" size="sm" onClick={copyToClipboard} className="h-7 px-2 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30 transition-all duration-200">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubRepoCard;
