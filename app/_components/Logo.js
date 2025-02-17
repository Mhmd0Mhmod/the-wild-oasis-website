import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png"
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 z-10">
      {/*<img src="/logo.png" height="60" loading={"lazy"} width="60" alt="The Wild Oasis logo" />*/}
      {/*  <Image src={"/logo.png"} alt={"The Wild Oasis logo"} height={60} width={60}/>*/}
        <Image src={logo} quality={1} height={60} width={60} alt={"The Wild Oasis logo"} />
      <span className="text-xl font-semibold text-primary-100">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
