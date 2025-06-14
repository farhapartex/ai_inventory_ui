import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Typography,
    Select,
    DatePicker,
    Space,
    Button,
    Statistic,
    Table,
    Tag,
    Progress,
    Tabs,
    Radio,
    Tooltip,
    message
} from 'antd';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    Brush,
    ScatterChart,
    Scatter
} from 'recharts';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    InboxOutlined,
    DownloadOutlined,
    FilterOutlined,
    CalendarOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import AppLayout from '../layouts/AppLayout';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Generate sample analytics data
const generateTimeSeriesData = (days = 30) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        const sales = Math.floor(Math.random() * 10000) + 5000;
        const orders = Math.floor(Math.random() * 100) + 20;
        const customers = Math.floor(Math.random() * 50) + 10;
        const profit = sales * (0.2 + Math.random() * 0.3); // 20-50% profit margin

        data.push({
            date: date.toISOString().split('T')[0],
            displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: Math.round(sales),
            orders: orders,
            customers: customers,
            profit: Math.round(profit),
            revenue: sales,
            avgOrderValue: Math.round(sales / orders),
            conversionRate: (Math.random() * 5 + 2).toFixed(2)
        });
    }

    return data;
};

const generateCategoryData = () => [
    { name: 'Electronics', value: 4500, sales: 85000, profit: 25500, orders: 450, color: '#8884d8' },
    { name: 'Clothing', value: 3200, sales: 62000, profit: 18600, orders: 320, color: '#82ca9d' },
    { name: 'Home & Garden', value: 2100, sales: 45000, profit: 13500, orders: 210, color: '#ffc658' },
    { name: 'Sports', value: 1800, sales: 38000, profit: 11400, orders: 180, color: '#ff7300' },
    { name: 'Books', value: 900, sales: 22000, profit: 6600, orders: 90, color: '#00ff88' },
    { name: 'Automotive', value: 1500, sales: 55000, profit: 16500, orders: 150, color: '#ff0088' }
];

const generateProductPerformance = () => [
    { name: 'Wireless Headphones', sales: 1250, profit: 375, orders: 85, stock: 45, category: 'Electronics' },
    { name: 'Smart Watch', sales: 980, profit: 294, orders: 65, stock: 23, category: 'Electronics' },
    { name: 'Running Shoes', sales: 750, profit: 225, orders: 45, stock: 67, category: 'Sports' },
    { name: 'Coffee Maker', sales: 650, profit: 195, orders: 35, stock: 12, category: 'Home & Garden' },
    { name: 'Laptop Stand', sales: 420, profit: 126, orders: 28, stock: 89, category: 'Electronics' },
    { name: 'Yoga Mat', sales: 380, profit: 114, orders: 32, stock: 156, category: 'Sports' },
    { name: 'Desk Lamp', sales: 290, profit: 87, orders: 22, stock: 78, category: 'Home & Garden' },
    { name: 'Bluetooth Speaker', sales: 560, profit: 168, orders: 38, stock: 34, category: 'Electronics' }
];

const generateCustomerSegmentation = () => [
    { segment: 'VIP Customers', customers: 45, revenue: 125000, avgSpent: 2778, color: '#ff6b6b' },
    { segment: 'Regular Customers', customers: 234, revenue: 185000, avgSpent: 790, color: '#4ecdc4' },
    { segment: 'New Customers', customers: 156, revenue: 89000, avgSpent: 570, color: '#45b7d1' },
    { segment: 'Inactive Customers', customers: 89, revenue: 0, avgSpent: 0, color: '#96ceb4' }
];

const ReportsPage = () => {
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [customerSegmentation, setCustomerSegmentation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState('30days');
    const [chartType, setChartType] = useState('line');
    const [selectedMetric, setSelectedMetric] = useState('sales');

    // Key metrics
    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgOrderValue: 0,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
        customerGrowth: 15.2
    });

    useEffect(() => {
        loadAnalyticsData();
    }, [dateRange]);

    const loadAnalyticsData = () => {
        setLoading(true);

        setTimeout(() => {
            const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : dateRange === '90days' ? 90 : 365;
            const tsData = generateTimeSeriesData(days);
            const catData = generateCategoryData();
            const prodData = generateProductPerformance();
            const custData = generateCustomerSegmentation();

            setTimeSeriesData(tsData);
            setCategoryData(catData);
            setProductData(prodData);
            setCustomerSegmentation(custData);

            // Calculate metrics
            const totalRevenue = tsData.reduce((sum, item) => sum + item.sales, 0);
            const totalOrders = tsData.reduce((sum, item) => sum + item.orders, 0);
            const totalCustomers = tsData.reduce((sum, item) => sum + item.customers, 0);

            setMetrics({
                totalRevenue,
                totalOrders,
                totalCustomers,
                avgOrderValue: Math.round(totalRevenue / totalOrders),
                revenueGrowth: (Math.random() * 20 - 5).toFixed(1), // -5% to +15%
                orderGrowth: (Math.random() * 15 - 2).toFixed(1),
                customerGrowth: (Math.random() * 25).toFixed(1)
            });

            setLoading(false);
        }, 1000);
    };

    const formatCurrency = (value) => `$${value.toLocaleString()}`;
    const formatPercent = (value) => `${value}%`;

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ margin: '4px 0', color: entry.color }}>
                            {`${entry.dataKey}: ${entry.dataKey.includes('sales') || entry.dataKey.includes('revenue') || entry.dataKey.includes('profit')
                                ? formatCurrency(entry.value)
                                : entry.value
                                }`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const renderTimeSeriesChart = () => {
        const ChartComponent = chartType === 'line' ? LineChart : chartType === 'area' ? AreaChart : BarChart;

        if (chartType === 'line') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" />
                        <YAxis />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#8884d8"
                            strokeWidth={2}
                            dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Brush dataKey="displayDate" height={30} stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            );
        } else if (chartType === 'area') {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" />
                        <YAxis />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            );
        } else {
            return (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" />
                        <YAxis />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey={selectedMetric} fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            );
        }
    };

    const productColumns = [
        {
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category) => <Tag color="blue">{category}</Tag>
        },
        {
            title: 'Sales',
            dataIndex: 'sales',
            key: 'sales',
            render: (value) => formatCurrency(value),
            sorter: (a, b) => a.sales - b.sales,
        },
        {
            title: 'Profit',
            dataIndex: 'profit',
            key: 'profit',
            render: (value) => formatCurrency(value),
            sorter: (a, b) => a.profit - b.profit,
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            sorter: (a, b) => a.orders - b.orders,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (
                <span style={{ color: stock < 30 ? '#ff4d4f' : stock < 50 ? '#faad14' : '#52c41a' }}>
                    {stock}
                </span>
            ),
            sorter: (a, b) => a.stock - b.stock,
        }
    ];

    return (
        <AppLayout>
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>Reports & Analytics</Title>
                    <Text type="secondary">
                        Comprehensive business intelligence and performance analytics
                    </Text>
                </div>

                {/* Filters and Controls */}
                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} sm={6}>
                            <Select
                                value={dateRange}
                                onChange={setDateRange}
                                style={{ width: '100%' }}
                            >
                                <Option value="7days">Last 7 Days</Option>
                                <Option value="30days">Last 30 Days</Option>
                                <Option value="90days">Last 90 Days</Option>
                                <Option value="365days">Last 12 Months</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={6}>
                            <RangePicker style={{ width: '100%' }} />
                        </Col>
                        <Col xs={24} sm={6}>
                            <Select
                                value={selectedMetric}
                                onChange={setSelectedMetric}
                                style={{ width: '100%' }}
                            >
                                <Option value="sales">Sales Revenue</Option>
                                <Option value="orders">Order Count</Option>
                                <Option value="customers">New Customers</Option>
                                <Option value="profit">Profit</Option>
                                <Option value="avgOrderValue">Avg Order Value</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={6}>
                            <Space>
                                <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
                                    <Radio.Button value="line"><LineChartOutlined /></Radio.Button>
                                    <Radio.Button value="area"><BarChartOutlined /></Radio.Button>
                                    <Radio.Button value="bar"><PieChartOutlined /></Radio.Button>
                                </Radio.Group>
                                <Button icon={<DownloadOutlined />} onClick={() => message.info('Export functionality')}>
                                    Export
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Key Metrics */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Revenue"
                                value={metrics.totalRevenue}
                                formatter={(value) => formatCurrency(value)}
                                prefix={<DollarOutlined />}
                                suffix={
                                    <span style={{
                                        fontSize: '12px',
                                        color: metrics.revenueGrowth >= 0 ? '#52c41a' : '#ff4d4f'
                                    }}>
                                        {metrics.revenueGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        {formatPercent(Math.abs(metrics.revenueGrowth))}
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Orders"
                                value={metrics.totalOrders}
                                prefix={<ShoppingCartOutlined />}
                                suffix={
                                    <span style={{
                                        fontSize: '12px',
                                        color: metrics.orderGrowth >= 0 ? '#52c41a' : '#ff4d4f'
                                    }}>
                                        {metrics.orderGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        {formatPercent(Math.abs(metrics.orderGrowth))}
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="New Customers"
                                value={metrics.totalCustomers}
                                prefix={<UserOutlined />}
                                suffix={
                                    <span style={{
                                        fontSize: '12px',
                                        color: '#52c41a'
                                    }}>
                                        <ArrowUpOutlined />
                                        {formatPercent(metrics.customerGrowth)}
                                    </span>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Avg Order Value"
                                value={metrics.avgOrderValue}
                                formatter={(value) => formatCurrency(value)}
                                prefix={<DollarOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Analytics Tabs */}
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Time Series Analysis" key="1">
                        <Card
                            title={`${selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend`}
                            loading={loading}
                            style={{ marginBottom: 24 }}
                        >
                            {renderTimeSeriesChart()}
                        </Card>

                        {/* Multi-metric comparison */}
                        <Card title="Performance Overview" loading={loading}>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={timeSeriesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="displayDate" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="orders" fill="#ffc658" name="Orders" />
                                    <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#8884d8" name="Sales" strokeWidth={2} />
                                    <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" strokeWidth={2} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Card>
                    </TabPane>

                    <TabPane tab="Category Analysis" key="2">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="Sales by Category" loading={loading}>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="sales"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Category Performance" loading={loading}>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={categoryData} layout="horizontal">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                                            <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Category Metrics" loading={loading} style={{ marginTop: 16 }}>
                            <Row gutter={[16, 16]}>
                                {categoryData.map((category, index) => (
                                    <Col xs={24} sm={12} lg={8} key={index}>
                                        <Card size="small">
                                            <Statistic
                                                title={category.name}
                                                value={category.sales}
                                                formatter={(value) => formatCurrency(value)}
                                                suffix={
                                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                                        <div>{category.orders} orders</div>
                                                        <div>Profit: {formatCurrency(category.profit)}</div>
                                                    </div>
                                                }
                                            />
                                            <Progress
                                                percent={Math.round((category.sales / Math.max(...categoryData.map(c => c.sales))) * 100)}
                                                strokeColor={category.color}
                                                showInfo={false}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </TabPane>

                    <TabPane tab="Product Performance" key="3">
                        <Card title="Top Performing Products" loading={loading} style={{ marginBottom: 16 }}>
                            <Table
                                dataSource={productData}
                                columns={productColumns}
                                pagination={{ pageSize: 10 }}
                                size="middle"
                            />
                        </Card>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="Sales vs Stock Analysis" loading={loading}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ScatterChart data={productData}>
                                            <CartesianGrid />
                                            <XAxis dataKey="sales" name="Sales" />
                                            <YAxis dataKey="stock" name="Stock" />
                                            <RechartsTooltip
                                                cursor={{ strokeDasharray: '3 3' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div style={{
                                                                backgroundColor: 'white',
                                                                padding: '10px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px'
                                                            }}>
                                                                <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
                                                                <p style={{ margin: '4px 0' }}>Sales: {formatCurrency(data.sales)}</p>
                                                                <p style={{ margin: '4px 0' }}>Stock: {data.stock}</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Scatter dataKey="stock" fill="#8884d8" />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Profit Margins" loading={loading}>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={productData.slice(0, 6)}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <RechartsTooltip content={<CustomTooltip />} />
                                            <Bar dataKey="profit" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    <TabPane tab="Customer Analytics" key="4">
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="Customer Segmentation" loading={loading}>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <PieChart>
                                            <Pie
                                                data={customerSegmentation}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ segment, customers }) => `${segment}: ${customers}`}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="customers"
                                            >
                                                {customerSegmentation.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Revenue by Segment" loading={loading}>
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={customerSegmentation}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="segment" angle={-45} textAnchor="end" height={100} />
                                            <YAxis />
                                            <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                                            <Bar dataKey="revenue" fill="#ffc658" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Card title="Customer Segment Details" loading={loading} style={{ marginTop: 16 }}>
                            <Row gutter={[16, 16]}>
                                {customerSegmentation.map((segment, index) => (
                                    <Col xs={24} sm={12} lg={6} key={index}>
                                        <Card size="small" style={{ backgroundColor: segment.color + '10' }}>
                                            <Statistic
                                                title={segment.segment}
                                                value={segment.customers}
                                                suffix="customers"
                                            />
                                            <div style={{ marginTop: 8 }}>
                                                <Text strong>Revenue: </Text>
                                                <Text>{formatCurrency(segment.revenue)}</Text>
                                            </div>
                                            <div>
                                                <Text strong>Avg Spent: </Text>
                                                <Text>{formatCurrency(segment.avgSpent)}</Text>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default ReportsPage;