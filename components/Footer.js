import Link from "next/link";

const Footer = () => {
  return (
    <div className="mb-8 mt-24 flex items-center justify-center space-x-4">
      <Link href="/">
        <p className="text-sm font-medium text-gray-500 cursor-pointer">
          Privacy
        </p>
      </Link>
      <Link href="/">
        <p className="text-sm font-medium text-gray-500 cursor-pointer">
          Terms
        </p>
      </Link>
      <Link href="/">
        <p className="text-sm font-medium text-gray-500 cursor-pointer">Home</p>
      </Link>
    </div>
  );
};

export default Footer;
