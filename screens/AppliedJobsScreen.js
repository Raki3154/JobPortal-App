import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function AppliedJobsScreen({ navigation }) {
    const { colors, shadows = {}, spacing, borderRadius } = useTheme();
    const [appliedJobs, setAppliedJobs] = useState([]);

    useEffect(() => {
        const fetchApplied = async () => {
            try {
                const saved = await AsyncStorage.getItem('appliedJobs');
                if (saved) {
                    setAppliedJobs(JSON.parse(saved));
                }
            } catch (e) {
                console.error(e);
            }
        };

        const unsubscribe = navigation.addListener('focus', () => {
            fetchApplied();
        });

        return unsubscribe;
    }, [navigation]);

    const renderJobItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, ...(shadows?.light || {}) }]}
            onPress={() => navigation.navigate("JobDetails", { job: item })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#fff', borderColor: colors.border }]}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.jobImage}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.companyName, { color: colors.textSecondary }]}>{item.company}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: colors.primary + '15' }]}>
                    <Text style={[styles.statusText, { color: colors.primary }]}>Applied</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.infoBadge}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                        {item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : 'Just now'}
                    </Text>
                </View>
                <View style={styles.infoBadge}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.location}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Applied Jobs</Text>
                
                {appliedJobs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="briefcase-outline" size={80} color={colors.textSecondary + '40'} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No applications yet</Text>
                        <TouchableOpacity 
                            style={[styles.browseButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate("Dashboard")}
                        >
                            <Text style={styles.browseButtonText}>Search for Jobs</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={appliedJobs}
                        keyExtractor={(item, index) => item.id + index}
                        renderItem={renderJobItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    listContent: {
        paddingBottom: 32,
    },
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
    },
    titleContainer: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    companyName: {
        fontSize: 14,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    infoText: {
        fontSize: 13,
        marginLeft: 4,
    },
    jobImage: {
        width: 40,
        height: 40,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        marginTop: 16,
        fontWeight: '500',
    },
    browseButton: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    }
});
