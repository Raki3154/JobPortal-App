import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ProfileScreen({ route, navigation }) {

    const { userEmail } = route.params || { userEmail: 'Guest User' };
    const { isDark, toggleTheme, colors, shadows = {} } = useTheme();

    const [appliedCount, setAppliedCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [profileName, setProfileName] = useState("Active Professional");
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {

        const fetchStats = async () => {
            try {
                const applied = await AsyncStorage.getItem('appliedJobs');
                const appliedJobs = applied ? JSON.parse(applied) : [];
                setAppliedCount(appliedJobs.length);

                const saved = await AsyncStorage.getItem('savedJobs');
                const savedJobs = saved ? JSON.parse(saved) : [];
                setFavoritesCount(savedJobs.length);

                const savedProfile = await AsyncStorage.getItem('userProfile_' + userEmail);
                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);
                    setProfileName(profile.name || "Active Professional");
                    setProfileImage(profile.profileImage || null);
                }

            } catch (e) {
                console.log(e);
            }
        };

        const unsubscribe = navigation.addListener('focus', fetchStats);
        return unsubscribe;

    }, [navigation, userEmail]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userEmail');
            alert("Logged Out Successfully");
            navigation.replace("Login");
        } catch (e) {
            alert("Error during logout");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={[
                    styles.header,
                    {
                        backgroundColor: colors.surface,
                        borderBottomColor: colors.border,
                        ...(shadows?.light || {})
                    }
                ]}>

                    <View style={[
                        styles.avatarContainer,
                        { backgroundColor: colors.background, borderColor: colors.primary }
                    ]}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="person" size={60} color={colors.primary} />
                        )}
                    </View>

                    <Text style={[styles.userName, { color: colors.text }]}>
                        {profileName}
                    </Text>

                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                        {userEmail}
                    </Text>

                    {/* STATS */}
                    <View style={styles.statsRow}>

                        {/* Applied */}
                        <View style={styles.statBox}>
                            <Text style={[styles.statCount, { color: colors.text }]}>
                                {appliedCount}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                Applied
                            </Text>
                        </View>

                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

                        {/* Favorites (FIXED) */}
                        <View style={styles.statBox}>
                            <Text style={[styles.statCount, { color: colors.text }]}>
                                {favoritesCount}
                            </Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                Favorites
                            </Text>
                        </View>

                    </View>
                </View>

                {/* MENU */}
                <View style={[
                    styles.menuContainer,
                    {
                        backgroundColor: colors.surface,
                        borderTopColor: colors.border,
                        borderBottomColor: colors.border
                    }
                ]}>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate("Applied Jobs")}
                    >
                        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Applied Jobs</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate("Favorites")}
                    >
                        <Ionicons name="heart-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Favorites</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { borderBottomColor: colors.border }]}
                        onPress={() => navigation.navigate("EditProfile", { userEmail })}
                    >
                        <Ionicons name="pencil-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* DARK MODE */}
                    <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
                        <Ionicons name="moon-outline" size={24} color={colors.primary} />
                        <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#767577", true: colors.primary + '80' }}
                            thumbColor={isDark ? colors.primary : "#f4f3f4"}
                        />
                    </View>

                    {/* LOGOUT */}
                    <TouchableOpacity
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={24} color={colors.error} />
                        <Text style={[styles.menuText, { color: colors.error }]}>Log Out</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    header: {
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
    },

    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 2,
        overflow: 'hidden',
    },

    profileImage: {
        width: 100,
        height: 100,
    },

    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    userEmail: {
        fontSize: 16,
        marginTop: 4,
    },

    statsRow: {
        flexDirection: 'row',
        marginTop: 32,
        paddingHorizontal: 32,
        alignItems: 'center',
    },

    statBox: {
        flex: 1,
        alignItems: 'center',
    },

    statCount: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },

    statDivider: {
        width: 1,
        height: 30,
    },

    menuContainer: {
        marginTop: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },

    menuText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 16,
    },

    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 8,
    }
});