import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Image,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function SignupScreen({ navigation }) {
    const { isDark, colors, shadows } = useTheme();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const logo = "https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776022518/job-portal-lettering-logo-design-template-concept-vector-37017445_ndy4xl.jpg";

    const handleSignup = async () => {
        const inputName = name.trim();
        const inputEmail = email.trim();
        const inputPassword = password.trim();

        if (!inputName || !inputEmail || !inputPassword || !confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (inputPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const existingUsers = await AsyncStorage.getItem('users');
            const users = existingUsers ? JSON.parse(existingUsers) : [];

            if (users.find(u => u.email === inputEmail)) {
                alert("Email already registered");
                return;
            }

            const newUser = { name: inputName, email: inputEmail, password: inputPassword };
            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));

            alert("Signup Success ✅");
            navigation.navigate("Login");
        } catch (error) {
            console.error(error);
            alert("Error saving user data");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={[styles.logoContainer, isDark && { backgroundColor: '#fff', borderRadius: 12, padding: 5 }]}>
                            <Image
                                source={{ uri: logo }}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join our community and find your dream job</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                            <TextInput
                                placeholder="John Doe"
                                placeholderTextColor={colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                            <TextInput
                                placeholder="Mail-Id"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                            <TextInput
                                placeholder="Password"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                            <TextInput
                                placeholder="Confirm Password"
                                placeholderTextColor={colors.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <TouchableOpacity style={[styles.signupButton, { backgroundColor: colors.primary, ...shadows.light }]} onPress={handleSignup}>
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={[styles.linkText, { color: colors.primary }]}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 25,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoContainer: {
    },
    logo: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    signupButton: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
    },
    linkText: {
        fontSize: 14,
        fontWeight: 'bold',
    }
});
