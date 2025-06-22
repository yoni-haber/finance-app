/**
 * ThemeToggle Component
 *
 * Button to switch between light and dark mode using ThemeContext.
 * Shows a sun icon for dark mode and a moon icon for light mode.
 *
 * No props.
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ThemeToggle: React.FC = () => {
  // Get theme state and toggle function from context
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    // IconButton toggles theme; icon changes based on current mode
    <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};
