/**
 * ThemeToggle Component
 *
 * This component provides a button to toggle between light and dark themes.
 * It uses the ThemeContext to manage the theme state and provides visual feedback
 * through different icons for each theme state.
 *
 * Component Structure:
 * 1. Context Usage:
 *    - useTheme hook for accessing theme state and toggle function
 *
 * 2. UI Components:
 *    - IconButton with dynamic icon based on theme
 *    - Brightness4Icon for light mode
 *    - Brightness7Icon for dark mode
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
    <IconButton onClick={toggleDarkMode} color="inherit" aria-label="toggle dark mode">
      {/* Show sun icon in dark mode, moon icon in light mode */}
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
};
