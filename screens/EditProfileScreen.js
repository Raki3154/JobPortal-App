import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function EditProfileScreen({ route, navigation }) {
    const { colors, shadows, spacing, borderRadius } = useTheme();
    const { userEmail } = route.params;
    const [name, setName] = useState("Active Professional");
    const [email, setEmail] = useState(userEmail);
    const [profileImage, setProfileImage] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const savedProfile = await AsyncStorage.getItem('userProfile_' + userEmail);
                if (savedProfile) {
                    const profile = JSON.parse(savedProfile);
                    setName(profile.name || "Active Professional");
                    setEmail(profile.email || userEmail);
                    setProfileImage(profile.profileImage || null);
                    setResume(profile.resume || null);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadProfile();
    }, [userEmail]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true,
            });

            if (!result.canceled) {
                setResume(result.assets[0]);
                Alert.alert("Success", "Resume uploaded: " + result.assets[0].name);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !email.trim()) {
            Alert.alert("Error", "Name and Email are required");
            return;
        }

        setLoading(true);
        try {
            const profileData = {
                name: name.trim(),
                email: email.trim(),
                profileImage,
                resume
            };
            await AsyncStorage.setItem('userProfile_' + userEmail, JSON.stringify(profileData));

            await AsyncStorage.setItem('userEmail', email.trim());

            Alert.alert("Success", "Profile updated successfully ✅");
            navigation.goBack();
        } catch (e) {
            Alert.alert("Error", "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.navHeader, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.imageSection}>
                    <TouchableOpacity onPress={pickImage} style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={[styles.placeholderImage, { backgroundColor: colors.surface }]}>
                                <Ionicons name="person" size={50} color={colors.textSecondary} />
                            </View>
                        )}
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Profile Photo</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Full Name"
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Email Address"
                            placeholderTextColor={colors.textSecondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Documents</Text>
                    <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={pickDocument}>
                        <View style={styles.uploadInfo}>
                            <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                            <View style={styles.uploadTextContainer}>
                                <Text style={[styles.uploadTitle, { color: colors.text }]}>
                                    {resume ? resume.name : "Upload Resume (PDF)"}
                                </Text>
                                <Text style={[styles.uploadSubtitle, { color: colors.textSecondary }]}>
                                    {resume ? "Tap to change" : "Max size 5MB"}
                                </Text>
                            </View>
                        </View>
                        <Ionicons name="cloud-upload-outline" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    imageSection: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    imageContainer: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
    },
    placeholderImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
    },
    form: {
        paddingHorizontal: 25,
    },
    inputGroup: {
        marginBottom: 20,
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
    sectionDivider: {
        height: 1,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    uploadInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    uploadTextContainer: {
        marginLeft: 12,
    },
    uploadTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    uploadSubtitle: {
        fontSize: 12,
        marginTop: 2,
    }
});
