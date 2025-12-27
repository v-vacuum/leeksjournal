import Link from "next/link";
import CustomShapedHoverImage from "./components/custom-shaped-hover-image";

export default function Header() {
  return (
    <nav>
      <div className="flex flex-col items-center py-4">
        {/* Link to the home page */}
        <Link href="/">
          <CustomShapedHoverImage
            src="/memory-box.png"
            hoverSrc="/memory-box-hover.png"
            alt="Memory Box"
            width={500}
            height={100}
          />
        </Link>

        <ol className="text-sm flex items-center justify-center gap-4 font-[family-name:var(--font-inria-serif)]">
          <li>
            <Link
              href="/"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              me
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link
              href="/us"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              us
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link
              href="/how-to-make-yourself"
              className="transition-colors hover:underline hover:underline-offset-4"
            >
              how to make yourself
            </Link>
          </li>
        </ol>
      </div>
    </nav>
  );
}
