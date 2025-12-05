import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface Props {
  className?: string;
}

const Logo = ({ className }: Props) => {
  return (
    <Link href={"/"}>
      <div className={cn("relative w-24 h-auto", className)}>
        <Image
          src="/images/nuzi-logo.png"
          alt="Nuzii Logo"
          width={96}
          height={40}
          className="w-full h-full object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
