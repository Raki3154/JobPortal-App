import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function FavoritesScreen({ navigation }) {
    const { colors, shadows, spacing, borderRadius } = useTheme();
    const [favorites, setFavorites] = useState([]);
    const loadFavorites = async () => {
        try {
            const saved = await AsyncStorage.getItem('savedJobs');
            if (saved) {
                try {
                    const parsedData = JSON.parse(saved);
                    setFavorites(Array.isArray(parsedData) ? parsedData : []);
                } catch (parseError) {
                    console.error("Error parsing favorites:", parseError);
                    setFavorites([]);
                }
            } else {
                setFavorites([]);
            }
        } catch (e) {
            console.error("Error loading favorites:", e);
            setFavorites([]);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadFavorites();
        }, [])
    );

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
                <TouchableOpacity onPress={async () => {
                    const saved = await AsyncStorage.getItem('savedJobs');
                    if (saved) {
                        const jobs = JSON.parse(saved).filter(j => j.id !== item.id);
                        await AsyncStorage.setItem('savedJobs', JSON.stringify(jobs));
                        setFavorites(jobs);
                    }
                }}>
                    <Ionicons name="heart" size={24} color={colors.error} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardFooter}>
                <View style={styles.infoBadge}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.location}</Text>
                </View>
                <View style={styles.infoBadge}>
                    <Ionicons name="cash-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.infoText, { color: colors.textSecondary }]}>{item.salary || 'Competitive'}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Jobs</Text>

                {favorites.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-dislike-outline" size={80} color={colors.textSecondary + '40'} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved jobs yet</Text>
                        <TouchableOpacity
                            style={[styles.browseButton, { backgroundColor: colors.primary }]}
                            onPress={() => navigation.navigate("Dashboard")}
                        >
                            <Text style={styles.browseButtonText}>Browse Jobs</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={favorites}
                        keyExtractor={(item) => item.id}
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
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
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
