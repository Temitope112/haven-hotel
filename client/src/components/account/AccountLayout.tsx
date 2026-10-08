import {
  Outlet,
} from "react-router";

import AccountSidebar from "./AccountSidebar";
import AccountMobileNav from "./AccountMobileNav";

export default function AccountLayout() {
  return (
    <div className="min-h-screen bg-[#151613] text-[#f5f1e8]">
      <AccountSidebar />

      <AccountMobileNav />

      <main className="min-h-screen pt-[76px] lg:ml-[280px] lg:pt-0">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-7 sm:py-10 lg:px-10 lg:py-12 xl:px-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
}