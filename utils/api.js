const ALL_JOBS = [
    {
        id: '1',
        title: 'Frontend Developer',
        company: 'TCS',
        location: 'Chennai',
        salary: '₹8 - 12 LPA',
        type: 'Full-time',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776019941/1726116477867_x1zazs.png'
    },
    {
        id: '2',
        title: 'Backend Developer',
        company: 'Infosys',
        location: 'Bangalore',
        salary: '₹10 - 15 LPA',
        type: 'Remote',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776019966/Infosys_Logo_qqityc.jpg'
    },
    {
        id: '3',
        title: 'Full Stack Developer',
        company: 'Wipro',
        location: 'Hyderabad',
        salary: '₹12 - 18 LPA',
        type: 'Contract',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776019915/100000000003019_1wipro-logo-digital-rgb_idabha.png'
    },
    {
        id: '4',
        title: 'UI/UX Designer',
        company: 'Google',
        location: 'Chennai',
        salary: '₹20 - 30 LPA',
        type: 'Full-time',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776208471/bAseQlKvNmjdLQrvYWm_q3QDp8C8YKyYI-nYJewgOkPi0JU1_3X9oFgjrEdzkOlXzLGFxFbnsw_s900-c-k-c0x00ffffff-no-rj_kamaw2.jpg'
    },
    {
        id: '5',
        title: 'React Native Expert',
        company: 'Meta',
        location: 'Remote',
        salary: '₹25 - 40 LPA',
        type: 'Remote',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776208492/Meta_Logo_w8ktix.jpg'
    },
    {
        id: '6',
        title: 'Java Developer',
        company: 'Amazon',
        location: 'Hyderabad',
        salary: '₹15 - 25 LPA',
        type: 'Full-time',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776208921/oakImage-1614794068335-superJumbo_cix71t.jpg'
    },
    {
        id: '7',
        title: 'DevOps Engineer',
        company: 'Microsoft',
        location: 'Bangalore',
        salary: '₹18 - 28 LPA',
        type: 'Full-time',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776209006/qgSeLfJk2OKnQicVDvc_VSlSISmAmWVHYtmSTckcC_iUn7hVfpURctMAqoSz0u4xfER6rlKDBA_s900-c-k-c0x00ffffff-no-rj_qr0ret.jpg'
    },
    {
        id: '8',
        title: 'Python Developer',
        company: 'Netflix',
        location: 'Remote',
        salary: '₹22 - 35 LPA',
        type: 'Remote',
        image: 'https://res.cloudinary.com/ddomklfbe/image/upload/q_auto/f_auto/v1776208599/apps.56161.9007199266246365.1d5a6a53-3c49-4f80-95d7-78d76b0e05d0_cdecha.png'
    }
];

export const fetchJobs = async (page = 1, limit = 4, filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    let filteredJobs = [...ALL_JOBS];

    if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job =>
            job.title.toLowerCase().includes(search) ||
            job.company.toLowerCase().includes(search)
        );
    }

    if (filters.location && filters.location !== 'All') {
        filteredJobs = filteredJobs.filter(job => job.location === filters.location);
    }

    if (filters.type && filters.type !== 'All') {
        filteredJobs = filteredJobs.filter(job => job.type === filters.type);
    }

    const startIndex = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + limit);

    return {
        jobs: paginatedJobs,
        hasMore: startIndex + limit < filteredJobs.length
    };
};
