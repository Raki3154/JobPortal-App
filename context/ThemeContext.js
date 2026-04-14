import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme !== null) {
                    setIsDark(JSON.parse(savedTheme));
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newValue = !isDark;
            setIsDark(newValue);
            await AsyncStorage.setItem('theme', JSON.stringify(newValue));
        } catch (e) {
            console.error(e);
        }
    };

    const currentTheme = isDark ? theme.dark : theme.light;
    const colors = currentTheme.colors;
    const shadows = currentTheme.shadows || {};

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, colors, shadows }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
