import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/Auth";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { Loader2, TrendingUp, Activity, PieChart as PieChartIcon } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

interface ConsumptionEvent {
    id: string;
    item_type: string;
    created_at: string;
    context: string[] | null;
}

export default function Insights() {
    const { user } = useAuth();
    const [events, setEvents] = useState<ConsumptionEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("30");

    useEffect(() => {
        if (!user) return;

        const fetchEvents = async () => {
            setIsLoading(true);
            const startDate = subDays(new Date(), parseInt(timeRange));

            const { data, error } = await supabase
                .from("consumption_events")
                .select("id, item_type, created_at, context")
                .eq("user_id", user.id)
                .gte("created_at", startDate.toISOString());

            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data || []);
            }
            setIsLoading(false);
        };

        fetchEvents();
    }, [user, timeRange]);

    // Aggregation Logic
    const categoryData = events.reduce((acc, curr) => {
        const type = curr.item_type || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.keys(categoryData).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: categoryData[key],
    }));

    const dailyData = events.reduce((acc, curr) => {
        const date = format(parseISO(curr.created_at), "MMM dd");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Fill in missing days for the last N days
    const lineChartData = [];
    for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, "MMM dd");
        lineChartData.push({
            date: dateStr,
            count: dailyData[dateStr] || 0,
        });
    }

    const contextData = events.reduce((acc, curr) => {
        if (curr.context && Array.isArray(curr.context)) {
            curr.context.forEach((ctx) => {
                acc[ctx] = (acc[ctx] || 0) + 1;
            });
        } else if (typeof curr.context === 'string') {
            // Handle case where context might be a string behaving like an array or JSON
            const ctx = curr.context as string;
            acc[ctx] = (acc[ctx] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const barChartData = Object.keys(contextData).map((key) => ({
        name: key,
        count: contextData[key],
    })).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 activities

    const totalInteractions = events.length;

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            My Consumption Insights
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Track your mindful journey and content habits.
                        </p>
                    </div>
                    <Tabs defaultValue="30" onValueChange={setTimeRange}>
                        <TabsList>
                            <TabsTrigger value="7">Last 7 Days</TabsTrigger>
                            <TabsTrigger value="30">Last 30 Days</TabsTrigger>
                            <TabsTrigger value="90">Last 3 months</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* KPI Cards */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalInteractions}</div>
                                <p className="text-xs text-muted-foreground">
                                    in the last {timeRange} days
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Activity</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {barChartData.length > 0 ? barChartData[0].name : "N/A"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Most frequent context
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Most Loved Format</CardTitle>
                                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {pieChartData.length > 0 ? pieChartData.sort((a, b) => b.value - a.value)[0].name : "N/A"}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Based on interaction count
                                </p>
                            </CardContent>
                        </Card>

                        {/* Charts */}
                        <Card className="col-span-1 md:col-span-2">
                            <CardHeader>
                                <CardTitle>Consumption Over Time</CardTitle>
                                <CardDescription>Daily interaction activity</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>By Category</CardTitle>
                                <CardDescription>Distribution of content types</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 md:col-span-3">
                            <CardHeader>
                                <CardTitle>Top Activities Context</CardTitle>
                                <CardDescription>Which activities drive your consumption?</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                                        <XAxis type="number" stroke="#888" fontSize={12} hide />
                                        <YAxis dataKey="name" type="category" width={100} stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
