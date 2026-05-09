"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";

export default function SocialIcons() {
  const socials = [
    { 
      name: "GitHub", 
      icon: FaGithub, 
      href: "https://github.com/Emirhan-Arikan" 
    },
    { 
      name: "LinkedIn", 
      icon: FaLinkedinIn, 
      href: "https://www.linkedin.com/in/emirhan-arıkan-7970a4331/" 
    },
    { 
      name: "Instagram", 
      icon: FaInstagram, 
      href: "https://www.instagram.com/your-instagram" 
    },
    { 
      name: "YouTube", 
      icon: FaYoutube, 
      href: "https://youtube.com/@your-youtube" 
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-6">
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="text-white/40 hover:text-white transition-colors hover:scale-110 transform duration-200"
          aria-label={social.name}
        >
          <social.icon size={24} />
        </motion.a>
      ))}
    </div>
  );
}
