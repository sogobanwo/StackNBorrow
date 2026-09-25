import Image from "next/image";
import footerLogoIcon from "@/public/illustrations/footer-logo-icon.png";
import { AiFillGithub } from "react-icons/ai";

export default function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-[#F6F7FB]">
      <div className="mx-auto flex max-w-360 flex-col items-center gap-6 px-6 py-10 sm:px-10 md:flex-row md:justify-between lg:px-29">
        <div className="flex items-center gap-2.5">
          <Image
            src={footerLogoIcon}
            alt=""
            width={17}
            height={18}
            className="h-4.5 w-4.25"
          />
          <span className="text-base font-bold text-heading">
            StackNBorrow
          </span>
        </div>

        <p className="text-sm text-muted">
          Stack stocks. Borrow against them. Never sell.
        </p>

        <a href="https://github.com/sogobanwo/StackNBorrow" aria-label="GitHub" className="text-muted transition-colors hover:text-heading">
          <AiFillGithub className="h-8 w-8"/>
        </a>
      </div>
    </footer>
  );
}
