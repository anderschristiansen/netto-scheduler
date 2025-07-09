"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MessageSquare,
  Settings,
  History,
  Home,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Planning", href: "/planning", icon: MessageSquare },
  { name: "History", href: "/history", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div 
      className="flex h-full w-64 flex-col bg-gray-900"
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div 
        className="flex h-16 items-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white">Netto Scheduler</h2>
      </motion.div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
            >
              <Link
                href={item.href}
                className={cn(
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors duration-200"
                )}
              >
                <item.icon
                  className={cn(
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white",
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );
}