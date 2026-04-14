import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import { scheduleApplicationNotification } from '../utils/notifications';

export default function JobDetails({ route, navigation }) {
    const { colors, shadows = {} } = useTheme();
    const { job } = route.params;

    const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const applied = await AsyncStorage.getItem('appliedJobs');
                const appliedJobs = applied ? JSON.parse(applied) : [];

                setHasApplied(appliedJobs.some(item => item.id === job.id));

                const saved = await AsyncStorage.getItem('savedJobs');
                const savedJobs = saved ? JSON.parse(saved) : [];

                setIsSaved(savedJobs.some(item => item.id === job.id));

            } catch (e) {
                console.log(e);
            }
        };

        checkStatus();
    }, [job.id]);

    const handleApply = async () => {
        if (hasApplied) {
            Alert.alert("Already Applied", "You have already applied for this job.");
            return;
        }

        try {
            const data = await AsyncStorage.getItem('appliedJobs');
            let jobs = data ? JSON.parse(data) : [];

            const newJob = {
                ...job,
                appliedAt: new Date().toISOString()
            };

            jobs.push(newJob);

            await AsyncStorage.setItem('appliedJobs', JSON.stringify(jobs));

            setHasApplied(true);

            try {
                if (!__DEV__) {
                    await scheduleApplicationNotification(job.title, job.company);
                } else {
                    console.log("Skipping notification in Expo Go");
                }
            } catch (e) {
                console.log("Notification skipped:", e);
            }

            Alert.alert("Success ✅", `Applied for ${job.title}`);

        } catch (e) {
            Alert.alert("Error", "Failed to apply");
        }
    };

    const handleToggleSave = async () => {
        try {
            const data = await AsyncStorage.getItem('savedJobs');
            let jobs = data ? JSON.parse(data) : [];

            if (isSaved) {
                jobs = jobs.filter(item => item.id !== job.id);
                setIsSaved(false);
            } else {
                const exists = jobs.some(item => item.id === job.id);
                if (!exists) {
                    jobs.push(job);
                }
                setIsSaved(true);
            }

            await AsyncStorage.setItem('savedJobs', JSON.stringify(jobs));

        } catch (e) {
            Alert.alert("Error", "Could not save job.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>

            {/* Header */}
            <View style={styles.navHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleToggleSave}>
                    <Ionicons
                        name={isSaved ? "heart" : "heart-outline"}
                        size={28}
                        color={isSaved ? colors.error : colors.text}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Job Header */}
                <View style={[styles.headerSection, { borderBottomColor: colors.border }]}>
                    <View style={[styles.iconContainer, { ...(shadows?.light || {}) }]}>
                        <Image source={{ uri: job.image }} style={styles.jobImage} resizeMode="contain" />
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
                    <Text style={[styles.company, { color: colors.primary }]}>{job.company}</Text>

                    <Text style={{ color: colors.textSecondary }}>{job.location}</Text>
                </View>

                {/* Details */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>

                    <Text style={{ color: colors.textSecondary }}>
                        This is a great opportunity for {job.title} at {job.company}.
                    </Text>
                </View>

                {/* Apply Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.applyButton,
                            { backgroundColor: colors.primary, ...(shadows?.medium || {}) },
                            hasApplied && styles.appliedButton
                        ]}
                        onPress={handleApply}
                        disabled={hasApplied}
                    >
                        <Text style={styles.applyButtonText}>
                            {hasApplied ? "Applied ✅" : "Apply Now"}
                        </Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    navHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },

    scrollContent: {
        paddingBottom: 30,
    },

    headerSection: {
        alignItems: 'center',
        padding: 25,
        borderBottomWidth: 1,
    },

    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    company: {
        fontSize: 18,
        marginTop: 5,
    },

    section: {
        padding: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    footer: {
        padding: 20,
    },

    applyButton: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    appliedButton: {
        backgroundColor: 'gray',
    },

    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    jobImage: {
        width: 60,
        height: 60,
    },
});