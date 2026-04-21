"use client"

import { DropdownLink } from "../DropdownLink";
import { handleSignOut } from "../action/auth";

function getInitial(name: string | null | undefined): string {
  return name?.[0]?.toUpperCase() ?? "U";
}

export function AvatarMenu({
  name,
  email,
}: {
  name: string | null | undefined;
  email: string | null | undefined;
}) {
  return (
    <div className="relative group">
      <button
        aria-label="Account menu"
        className="w-8 h-8 rounded-full bg-[#08a05c] text-white text-[13px] font-bold flex items-center justify-center cursor-pointer border-none select-none focus-visible:ring-2 focus-visible:ring-[#08a05c]/40 outline-none"
      >
        {getInitial(name)}
      </button>
 
      <div className="hidden group-hover:block group-focus-within:block absolute right-0 top-[calc(100%+10px)] w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-200">
        <div className="px-4 pt-2.5 pb-3">
          <p className="text-sm font-semibold text-gray-900 truncate">{name ?? "User"}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>
 
        <div className="h-px bg-gray-100 my-1" />
 
        <DropdownLink href="/dashboard">Dashboard</DropdownLink>
        <DropdownLink href="/profile">Profile</DropdownLink>
        <DropdownLink href="/orders">Orders</DropdownLink>
        <DropdownLink href="/watchlist">Watchlist</DropdownLink>
 
        <div className="h-px bg-gray-100 my-1" />
 
        <form action={handleSignOut}>
          <button
            type="submit"
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors bg-transparent border-none font-[inherit] cursor-pointer"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}