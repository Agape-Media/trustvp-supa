import Link from "next/link";
import { useAppContext } from "@/context/state";
import Logo from "/public/logo.svg";

const navItems = [
  {
    id: "0",
    label: "Dashboard",
    link: "/",
  },
  {
    id: "1",
    label: "RSVPS",
    link: "/rsvp",
  },
];

function Header() {
  const view = useAppContext();

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="border-t-[5px] border-trustBlue" />
      <div className="px-8 2xl:px-0  max-w-6xl mx-auto flex items-center justify-between h-[60px] -mb-px">
        {/* Header: Left side */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Logo */}
          {/* {Logo} */}
          <Link exact href="/">
            <div className="w-7 h-7 mr-2 rounded-full bg-trustBlue cursor-pointer" />
          </Link>
          {navItems.map((item) => (
            <Link key={item.id} exact href={item.link}>
              <p className="text-base font-light hover:underline text-black cursor-pointer">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
        {/* Header: Right side */}
        {/* Default */}
        <Link exact href="/settings">
          {view?.avatar_url ? (
            <img
              src={view?.avatar_url}
              className="object-cover rounded-full w-8 h-8 cursor-pointer"
            />
          ) : (
            <div className="grid place-items-center w-8 h-8 rounded-full bg-trustBlue text-white cursor-pointer">
              <p className="text-xs">{view?.username[0]}</p>
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
