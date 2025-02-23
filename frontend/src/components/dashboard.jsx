import React, { useState, useEffect, useCallback } from 'react';
import { 
    Grid, 
    Paper, 
    Typography,
    Box,
    CircularProgress,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { fetchCaseStats, fetchCasesByType, fetchResolutionTimes } from '../services/api';
import SearchFilter from './searchFilter';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, subtitle }) => (
    <Card raised sx={{ height: '100%' }}>
        <CardContent sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Typography color="textSecondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography color="textSecondary" variant="body2">
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const ChartContainer = ({ title, children }) => (
    <Paper 
        sx={{ 
            p: 2,
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
            {title}
        </Typography>
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            {children}
        </Box>
    </Paper>
);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [caseTypes, setCaseTypes] = useState([]);
    const [resolutionTimes, setResolutionTimes] = useState([]);
    const [filters, setFilters] = useState({});

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            const [statsData, typesData, timesData] = await Promise.all([
                fetchCaseStats(filters),
                fetchCasesByType(filters),
                fetchResolutionTimes(filters)
            ]);
            setStats(statsData);
            setCaseTypes(typesData);
            setResolutionTimes(timesData);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleExport = () => {
        const csvContent = [
            ['Case Type', 'Count', 'Success Rate', 'Avg Settlement'],
            ...caseTypes.map(type => [
                type.case_type,
                type.count,
                `${(type.success_rate * 100).toFixed(1)}%`,
                `$${type.avg_settlement.toFixed(2)}`
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'case_analytics.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading && !stats) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
            }}>
                <Typography variant="h4" component="h1">
                    Analytics Overview
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExport}
                >
                    Export Data
                </Button>
            </Box>

            <SearchFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <Box display="flex" justifyContent="center" m={3}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Total Cases"
                                value={stats.total_cases}
                                subtitle="All time"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Active Cases"
                                value={stats.active_cases}
                                subtitle="Currently in progress"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Avg Resolution Time"
                                value={`${Math.round(stats.avg_resolution_days)} days`}
                                subtitle="Time to completion"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <StatCard
                                title="Success Rate"
                                value={`${(stats.success_rate * 100).toFixed(1)}%`}
                                subtitle="Cases won or settled"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <ChartContainer title="Case Distribution by Type">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={caseTypes} margin={{ bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="case_type" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Number of Cases" />
                                        <Bar yAxisId="right" dataKey="success_rate" fill="#82ca9d" name="Success Rate" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <ChartContainer title="Case Type Distribution">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={caseTypes}
                                            dataKey="count"
                                            nameKey="case_type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {caseTypes.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </Grid>

                        <Grid item xs={12}>
                            <ChartContainer title="Resolution Times by Practice Area">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={resolutionTimes} margin={{ bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="practice_area" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="avg_days" fill="#8884d8" name="Average Days" />
                                        <Bar dataKey="min_days" fill="#82ca9d" name="Minimum Days" />
                                        <Bar dataKey="max_days" fill="#ffc658" name="Maximum Days" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default Dashboard;