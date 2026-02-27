import { Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { socialMediaLinks } from "@/constants";

interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}

const getIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="w-5 h-5" />;
    case "tiktok":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case "facebook":
      return <Facebook className="w-5 h-5" />;
    case "whatsapp":
      return <FaWhatsapp className="w-5 h-5" />;
    default:
      return null;
  }
};

const SocialMedia = ({ className, iconClassName, tooltipClassName }: Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5 text-nuziiTextLight", className)}>
        {socialMediaLinks.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 border border-nuziiSand rounded-full hover:text-nuziiRoseGoldDark hover:border-nuziiRoseGoldDark hover:bg-nuziiBeige hoverEffect",
                  iconClassName
                )}
              >
                {getIcon(item.platform)}
              </a>
            </TooltipTrigger>
            <TooltipContent
              className={cn(
                "bg-nuziiRoseGold text-white font-semibold",
                tooltipClassName
              )}
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default SocialMedia;
