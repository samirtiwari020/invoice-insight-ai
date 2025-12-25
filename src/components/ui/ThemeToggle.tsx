import React from 'react';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi2';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-lg transition-colors',
        'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {theme === 'light' ? (
          <HiOutlineMoon className="w-5 h-5" />
        ) : (
          <HiOutlineSun className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  );
};
