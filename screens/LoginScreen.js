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

export default function LoginScreen({ navigation }) {
    const { isDark, colors, shadows } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const logo = "https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776022518/job-portal-lettering-logo-design-template-concept-vector-37017445_ndy4xl.jpg";

    const staticUsers = [
        { email: "admin@gmail.com", password: "1234" },
        { email: "user@gmail.com", password: "abcd" },
        { email: "rakkesh3154@gmail.com", password: "Raki3154" }
    ];

    const handleLogin = async () => {
        const inputEmail = email.trim().toLowerCase();
        const inputPassword = password.trim();

        if (!inputEmail || !inputPassword) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const staticUser = staticUsers.find(
                (u) => u.email === inputEmail && u.password === inputPassword
            );
            const existingUsers = await AsyncStorage.getItem('users');
            const localUsers = existingUsers ? JSON.parse(existingUsers) : [];
            const localUser = localUsers.find(
                (u) => u.email.toLowerCase() === inputEmail && u.password === inputPassword
            );

            if (staticUser || localUser) {
                await AsyncStorage.setItem('userEmail', inputEmail);
                navigation.replace("Main", { userEmail: inputEmail });
                return;
            }

            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'pro_4a890f617b2b6ac0266e4a1e9b449a6e22839753b6a5322e6ec871d0faf3b8b0'
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem('userEmail', inputEmail);
                navigation.replace("Main", { userEmail: inputEmail });
            } else {
                alert(data.error || "Incorrect Email or Password ❌");
            }

        } catch (error) {
            console.error(error);
            alert("Network error ❌");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.content}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <View style={[styles.logoContainer, isDark && { backgroundColor: '#fff', borderRadius: 12, padding: 5 }]}>
                            <Image source={{ uri: logo }} style={styles.logo} resizeMode="contain" />
                        </View>

                        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                            Sign in to continue your career journey
                        </Text>
                    </View>

                    <View style={styles.form}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: colors.primary }]}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 25,
        paddingVertical: 50,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
    },
    form: { width: '100%' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    input: {
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        borderWidth: 1,
    },
    loginButton: {
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logo: { width: 80, height: 80 },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
});