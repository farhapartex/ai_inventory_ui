import React from "react";
import {
    Layout,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Space,
    Typography
} from 'antd';
import {
    ShoppingCartOutlined,
    InboxOutlined,
    TeamOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from '@ant-design/icons';
import AppLayout from "../layouts/AppLayout";

const { Title, Text } = Typography;



const dashboardData = {
    stats: [
        { title: 'Total Products', value: 1234, prefix: <InboxOutlined />, change: 12 },
        { title: 'Low Stock Items', value: 23, prefix: <ArrowDownOutlined />, change: -5 },
        { title: 'Orders Today', value: 89, prefix: <ShoppingCartOutlined />, change: 8 },
        { title: 'Total Revenue', value: 45600, prefix: '$', change: 15 }
    ],
    recentOrders: [
        { key: '1', orderNo: 'ORD-001', customer: 'John Doe', status: 'Completed', amount: 250 },
        { key: '2', orderNo: 'ORD-002', customer: 'Jane Smith', status: 'Pending', amount: 180 },
        { key: '3', orderNo: 'ORD-003', customer: 'Bob Johnson', status: 'Processing', amount: 320 },
        { key: '4', orderNo: 'ORD-004', customer: 'Alice Brown', status: 'Completed', amount: 150 },
    ]
};

const Dashboard = () => {
    const orderColumns = [
        {
            title: 'Order No',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const color = status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'blue';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `$${amount}`,
        },
    ];
    return (
        <AppLayout>
            <div>
                <Title level={2} style={{ marginBottom: '24px' }}>Dashboard</Title>

                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {dashboardData.stats.map((stat, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card>
                                <Statistic
                                    title={stat.title}
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    suffix={
                                        <Space>
                                            {stat.change > 0 ? (
                                                <Text type="success">
                                                    <ArrowUpOutlined /> {stat.change}%
                                                </Text>
                                            ) : (
                                                <Text type="danger">
                                                    <ArrowDownOutlined /> {Math.abs(stat.change)}%
                                                </Text>
                                            )}
                                        </Space>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card title="Recent Orders" style={{ marginBottom: '24px' }}>
                    <Table
                        dataSource={dashboardData.recentOrders}
                        columns={orderColumns}
                        pagination={false}
                        size="middle"
                    />
                </Card>

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                        <Card title="Quick Actions" style={{ height: '200px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" block icon={<InboxOutlined />}>
                                    Add New Product
                                </Button>
                                <Button block icon={<ShoppingCartOutlined />}>
                                    Create Order
                                </Button>
                                <Button block icon={<TeamOutlined />}>
                                    Add Customer
                                </Button>
                            </Space>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title="System Status" style={{ height: '200px' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Database Connection:</Text>
                                    <Tag color="green">Active</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Last Backup:</Text>
                                    <Text>2 hours ago</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>System Load:</Text>
                                    <Tag color="blue">Normal</Tag>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </AppLayout>
    )
}

export default Dashboard;