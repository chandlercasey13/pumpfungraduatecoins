"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SubOption {
  label: string;
  href: string;
}

interface MenuSection {
  title: string;
  subOptions: SubOption[];
}

interface CollapsibleMenuProps {
  sections: MenuSection[];
}

export default function CollapsibleMenu({ sections }: CollapsibleMenuProps) {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index} className="mb-2">
          <button
            className="sidebar-items"
            onClick={() => toggleMenu(section.title)}
          >
            <span>{section.title}</span>

            <motion.div
              animate={{ rotate: openMenus[section.title] ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <ChevronRight size={18} />
            </motion.div>
          </button>

          <AnimatePresence>
            {openMenus[section.title] && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pl-3 mt-2 space-y-1"
              >
                {section.subOptions.map((option, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <Link
                      href={option.href}
                      className="block w-full text-left text-sm text-white p-2 hover:bg-white/20 rounded-md"
                    >
                      {option.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
