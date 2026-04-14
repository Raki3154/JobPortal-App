import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchJobs } from '../utils/api';

export default function DashboardScreen({ navigation }) {
    const { isDark, colors, shadows = {}, spacing, borderRadius } = useTheme();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    const locations = ['All', 'Chennai', 'Bangalore', 'Hyderabad', 'Remote'];
    const jobTypes = ['All', 'Full-time', 'Remote', 'Contract'];

    const loadJobs = useCallback(async (pageNum, currentFilters, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await fetchJobs(pageNum, 4, currentFilters);
            if (isInitial) {
                setJobs(data.jobs);
            } else {
                setJobs(prev => [...prev, ...data.jobs]);
            }
            setHasMore(data.hasMore);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        loadJobs(1, { search, location: selectedLocation, type: selectedType }, true);
        setPage(1);
    }, [search, selectedLocation, selectedType, loadJobs]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadJobs(nextPage, { search, location: selectedLocation, type: selectedType });
        }
    };

    const renderJobItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, ...(shadows?.light || {}) }]}
            onPress={() => navigation.navigate("JobDetails", { job: item })}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
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
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
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
                <View style={[styles.typeBadge, { backgroundColor: item.type === 'Remote' ? (isDark ? '#065F46' : '#ECFDF5') : (isDark ? '#3730A3' : '#EEF2FF') }]}>
                    <Text style={[styles.typeText, { color: item.type === 'Remote' ? (isDark ? '#A7F3D0' : '#059669') : (isDark ? '#E0E7FF' : '#4F46E5') }]}>{item.type}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderHeader = () => (
        <View style={styles.headerSection}>
            <View style={[styles.searchContainer, { backgroundColor: colors.surface, ...(shadows?.light || {}) }]}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search jobs, companies..."
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.searchInput, { color: colors.text }]}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>Location</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {locations.map(loc => (
                    <TouchableOpacity
                        key={loc}
                        style={[
                            styles.filterBadge,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            selectedLocation === loc && { backgroundColor: colors.primary, borderColor: colors.primary }
                        ]}
                        onPress={() => setSelectedLocation(loc)}
                    >
                        <Text style={[
                            styles.filterBadgeText,
                            { color: colors.textSecondary },
                            selectedLocation === loc && { color: '#fff' }
                        ]}>{loc}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={[styles.filterTitle, { color: colors.textSecondary }]}>Job Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {jobTypes.map(type => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.filterBadge,
                            { backgroundColor: colors.surface, borderColor: colors.border },
                            selectedType === type && { backgroundColor: colors.primary, borderColor: colors.primary }
                        ]}
                        onPress={() => setSelectedType(type)}
                    >
                        <Text style={[
                            styles.filterBadgeText,
                            { color: colors.textSecondary },
                            selectedType === type && { color: '#fff' }
                        ]}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Jobs</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <FlatList
                        data={jobs}
                        keyExtractor={(item) => item.id}
                        renderItem={renderJobItem}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="search-outline" size={60} color={colors.textSecondary + '40'} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No jobs found matching your filters</Text>
                            </View>
                        }
                        ListFooterComponent={
                            loadingMore && <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} />
                        }
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
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
        paddingHorizontal: 16,
    },
    headerSection: {
        paddingVertical: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        marginLeft: 4,
    },
    filterScroll: {
        marginBottom: 16,
    },
    filterBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    filterBadgeText: {
        fontSize: 13,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 16,
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
        flexWrap: 'wrap',
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
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginLeft: 'auto',
    },
    typeText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    jobImage: {
        width: 70,
        height: 70,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    }
});
