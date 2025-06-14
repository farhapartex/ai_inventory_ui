import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Input,
    Space,
    Tag,
    Typography,
    Row,
    Col,
    Card,
    Avatar,
    Dropdown,
    Tooltip,
    Modal,
    message,
    Badge,
    Statistic,
    DatePicker,
    Select,
    Drawer,
    Descriptions,
    Divider,
    Progress
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    ExclamationCircleOutlined,
    FilterOutlined,
    ExportOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    CalendarOutlined,
    StarOutlined,
    TeamOutlined
} from '@ant-design/icons';
import AppLayout from '../../layouts/AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Generate sample customer data
const generateSampleCustomers = () => {
    const customerTypes = ['Individual', 'Business', 'Wholesale', 'VIP'];
    const statuses = ['Active', 'Inactive', 'Suspended', 'Blocked'];
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'];
    const cities = {
        'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
        'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
        'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool'],
        'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
        'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt']
    };

    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const companies = ['Acme Corp', 'Tech Solutions Inc', 'Global Enterprises', 'Innovation Labs', 'Digital Dynamics'];

    return Array.from({ length: 180 }, (_, index) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const city = cities[country][Math.floor(Math.random() * cities[country].length)];
        const customerType = customerTypes[Math.floor(Math.random() * customerTypes.length)];
        const joinDate = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000); // Last 2 years
        const lastOrderDate = Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null;

        return {
            key: index + 1,
            customerId: `CUS-${String(index + 1).padStart(5, '0')}`,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index + 1}@example.com`,
            phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            secondaryPhone: Math.random() > 0.6 ? `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}` : null,
            company: customerType === 'Business' || customerType === 'Wholesale' ? companies[Math.floor(Math.random() * companies.length)] : null,
            customerType,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            joinDate: joinDate.toISOString().split('T')[0],
            lastOrderDate: lastOrderDate ? lastOrderDate.toISOString().split('T')[0] : null,
            totalOrders: Math.floor(Math.random() * 50),
            totalSpent: parseFloat((Math.random() * 10000).toFixed(2)),
            averageOrderValue: parseFloat((Math.random() * 200 + 50).toFixed(2)),
            address: {
                street: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}`,
                city,
                state: ['NY', 'CA', 'TX', 'FL', 'IL'][Math.floor(Math.random() * 5)],
                zipCode: String(Math.floor(Math.random() * 90000) + 10000),
                country
            },
            dateOfBirth: Math.random() > 0.5 ? new Date(1950 + Math.random() * 50, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : null,
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            notes: Math.random() > 0.7 ? 'VIP customer with special pricing' : '',
            loyaltyPoints: Math.floor(Math.random() * 5000),
            referredBy: Math.random() > 0.8 ? `CUS-${String(Math.floor(Math.random() * index) + 1).padStart(5, '0')}` : null,
            marketingOptIn: Math.random() > 0.3,
            preferredCommunication: ['Email', 'Phone', 'SMS'][Math.floor(Math.random() * 3)],
            tags: Math.random() > 0.5 ? ['VIP', 'Frequent Buyer', 'New Customer', 'Wholesale'][Math.floor(Math.random() * 4)] : null,
            socialMedia: {
                linkedin: Math.random() > 0.7 ? `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}` : null,
                twitter: Math.random() > 0.8 ? `@${firstName.toLowerCase()}${lastName.toLowerCase()}` : null
            }
        };
    });
};

const CustomersPage = () => {
    let navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [dateRange, setDateRange] = useState([]);
    const [customerDetailsVisible, setCustomerDetailsVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
    });

    // Statistics
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        newCustomers: 0,
        totalRevenue: 0
    });

    // Initialize data
    useEffect(() => {
        loadCustomers();
    }, []);

    // Filter customers based on search and filters
    useEffect(() => {
        let filtered = customers;

        // Text search
        if (searchText) {
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.customerId.toLowerCase().includes(searchText.toLowerCase()) ||
                customer.phone.toLowerCase().includes(searchText.toLowerCase()) ||
                (customer.company && customer.company.toLowerCase().includes(searchText.toLowerCase()))
            );
        }

        // Status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(customer => customer.status === selectedStatus);
        }

        // Type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(customer => customer.customerType === selectedType);
        }

        // Date range filter (join date)
        if (dateRange.length === 2) {
            const [startDate, endDate] = dateRange;
            filtered = filtered.filter(customer => {
                const joinDate = new Date(customer.joinDate);
                return joinDate >= startDate && joinDate <= endDate;
            });
        }

        setFilteredCustomers(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
    }, [searchText, selectedStatus, selectedType, dateRange, customers]);

    const loadCustomers = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateSampleCustomers();
            setCustomers(data);
            setFilteredCustomers(data);

            // Calculate statistics
            const totalRevenue = data.reduce((sum, customer) => sum + customer.totalSpent, 0);
            const activeCustomers = data.filter(customer => customer.status === 'Active').length;
            const newCustomers = data.filter(customer => {
                const joinDate = new Date(customer.joinDate);
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                return joinDate >= thirtyDaysAgo;
            }).length;

            setStats({
                totalCustomers: data.length,
                activeCustomers,
                newCustomers,
                totalRevenue: parseFloat(totalRevenue.toFixed(2))
            });

            setPagination(prev => ({ ...prev, total: data.length }));
            setLoading(false);
        }, 200);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleViewCustomer = (record) => {
        setSelectedCustomer(record);
        setCustomerDetailsVisible(true);
    };

    const handleEditCustomer = (record) => {
        //message.info(`Edit customer: ${record.name}`);
        navigate(`/customers/${record.customerId}`)
    };

    const handleDeleteCustomer = (record) => {
        confirm({
            title: 'Are you sure you want to delete this customer?',
            icon: <ExclamationCircleOutlined />,
            content: `Customer: ${record.name} (${record.customerId})`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                const updatedCustomers = customers.filter(customer => customer.key !== record.key);
                setCustomers(updatedCustomers);
                message.success('Customer deleted successfully');
            },
        });
    };

    const handleEmailCustomer = (record) => {
        message.info(`Send email to: ${record.email}`);
    };

    const handleCreateOrder = (record) => {
        message.info(`Create order for: ${record.name}`);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'green',
            'Inactive': 'orange',
            'Suspended': 'red',
            'Blocked': 'default'
        };
        return colors[status] || 'default';
    };

    const getCustomerTypeColor = (type) => {
        const colors = {
            'Individual': 'blue',
            'Business': 'purple',
            'Wholesale': 'gold',
            'VIP': 'red'
        };
        return colors[type] || 'default';
    };

    const actionMenuItems = (record) => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => handleViewCustomer(record)
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Customer',
            onClick: () => handleEditCustomer(record)
        },
        {
            key: 'order',
            icon: <ShoppingCartOutlined />,
            label: 'Create Order',
            onClick: () => handleCreateOrder(record)
        },
        {
            key: 'email',
            icon: <MailOutlined />,
            label: 'Send Email',
            onClick: () => handleEmailCustomer(record)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Customer',
            danger: true,
            onClick: () => handleDeleteCustomer(record)
        },
    ];

    const columns = [
        {
            title: 'Customer',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            fixed: 'left',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        size={40}
                        style={{
                            backgroundColor: record.customerType === 'VIP' ? '#f56a00' : '#1890ff',
                            marginRight: 12,
                            flexShrink: 0
                        }}
                    >
                        {record.firstName[0]}{record.lastName[0]}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>
                            <Button type="link" onClick={() => handleViewCustomer(record)} style={{ padding: 0, height: 'auto' }}>
                                {text}
                            </Button>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            ID: {record.customerId}
                        </div>
                        {record.company && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                {record.company}
                            </div>
                        )}
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 200,
            render: (_, record) => (
                <div>
                    <div style={{ marginBottom: 4, fontSize: '13px' }}>
                        <MailOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.email}
                    </div>
                    <div style={{ fontSize: '13px' }}>
                        <PhoneOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.phone}
                    </div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'customerType',
            key: 'customerType',
            width: 100,
            render: (type) => (
                <Tag color={getCustomerTypeColor(type)}>{type}</Tag>
            ),
            filters: [
                { text: 'Individual', value: 'Individual' },
                { text: 'Business', value: 'Business' },
                { text: 'Wholesale', value: 'Wholesale' },
                { text: 'VIP', value: 'VIP' },
            ],
            onFilter: (value, record) => record.customerType === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
                { text: 'Suspended', value: 'Suspended' },
                { text: 'Blocked', value: 'Blocked' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Location',
            key: 'location',
            width: 150,
            render: (_, record) => (
                <div style={{ fontSize: '13px' }}>
                    <div>{record.address.city}, {record.address.state}</div>
                    <div style={{ color: '#666' }}>{record.address.country}</div>
                </div>
            ),
        },
        {
            title: 'Orders',
            dataIndex: 'totalOrders',
            key: 'totalOrders',
            width: 80,
            render: (count) => <Badge count={count} color="blue" />,
            sorter: (a, b) => a.totalOrders - b.totalOrders,
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'totalSpent',
            width: 120,
            render: (amount) => (
                <Text strong style={{ color: '#1890ff' }}>
                    ${amount.toFixed(2)}
                </Text>
            ),
            sorter: (a, b) => a.totalSpent - b.totalSpent,
        },
        {
            title: 'Avg Order',
            dataIndex: 'averageOrderValue',
            key: 'averageOrderValue',
            width: 100,
            render: (amount) => `$${amount.toFixed(2)}`,
            sorter: (a, b) => a.averageOrderValue - b.averageOrderValue,
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            width: 110,
            sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
        },
        {
            title: 'Last Order',
            dataIndex: 'lastOrderDate',
            key: 'lastOrderDate',
            width: 110,
            render: (date) => date || <Text type="secondary">Never</Text>,
            sorter: (a, b) => {
                if (!a.lastOrderDate && !b.lastOrderDate) return 0;
                if (!a.lastOrderDate) return 1;
                if (!b.lastOrderDate) return -1;
                return new Date(a.lastOrderDate) - new Date(b.lastOrderDate);
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 100,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewCustomer(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Customer">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditCustomer(record)}
                        />
                    </Tooltip>
                    <Dropdown
                        menu={{ items: actionMenuItems(record) }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <div>
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>Customers</Title>
                    <Text type="secondary">
                        Manage customer information, track orders, and analyze customer behavior
                    </Text>
                </div>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Customers"
                                value={stats.totalCustomers}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Active Customers"
                                value={stats.activeCustomers}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="New This Month"
                                value={stats.newCustomers}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<StarOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Revenue"
                                value={stats.totalRevenue}
                                prefix={<DollarOutlined />}
                                precision={2}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Search
                                placeholder="Search by name, email, ID, phone, or company..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={handleSearch}
                                onChange={(e) => !e.target.value && handleSearch('')}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Select
                                placeholder="Status"
                                style={{ width: '100%' }}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            >
                                <Option value="all">All Status</Option>
                                <Option value="Active">Active</Option>
                                <Option value="Inactive">Inactive</Option>
                                <Option value="Suspended">Suspended</Option>
                                <Option value="Blocked">Blocked</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={3}>
                            <Select
                                placeholder="Type"
                                style={{ width: '100%' }}
                                value={selectedType}
                                onChange={setSelectedType}
                            >
                                <Option value="all">All Types</Option>
                                <Option value="Individual">Individual</Option>
                                <Option value="Business">Business</Option>
                                <Option value="Wholesale">Wholesale</Option>
                                <Option value="VIP">VIP</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={6}>
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={setDateRange}
                                placeholder={['Join Date From', 'Join Date To']}
                            />
                        </Col>
                        <Col xs={24} md={4}>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Tooltip title="Export Customers">
                                    <Button icon={<ExportOutlined />} />
                                </Tooltip>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/customers/new")}
                                >
                                    New Customer
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredCustomers}
                        pagination={{
                            ...pagination,
                            total: filteredCustomers.length,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} customers`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected customers:', selectedRows);
                            },
                        }}
                    />
                </Card>

                <Drawer
                    title={`Customer Details - ${selectedCustomer?.name}`}
                    width={600}
                    open={customerDetailsVisible}
                    onClose={() => setCustomerDetailsVisible(false)}
                    extra={
                        <Space>
                            <Button onClick={() => handleEmailCustomer(selectedCustomer)} icon={<MailOutlined />}>
                                Email
                            </Button>
                            <Button onClick={() => handleCreateOrder(selectedCustomer)} icon={<ShoppingCartOutlined />}>
                                New Order
                            </Button>
                            <Button onClick={() => handleEditCustomer(selectedCustomer)} icon={<EditOutlined />} type="primary">
                                Edit
                            </Button>
                        </Space>
                    }
                >
                    {selectedCustomer && (
                        <div>
                            <Card size="small" style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Text strong>Status: </Text>
                                        <Tag color={getStatusColor(selectedCustomer.status)}>
                                            {selectedCustomer.status}
                                        </Tag>
                                    </Col>
                                    <Col span={12}>
                                        <Text strong>Type: </Text>
                                        <Tag color={getCustomerTypeColor(selectedCustomer.customerType)}>
                                            {selectedCustomer.customerType}
                                        </Tag>
                                    </Col>
                                </Row>
                            </Card>
                            <Card title="Contact Information" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Full Name">{selectedCustomer.name}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
                                    <Descriptions.Item label="Phone">{selectedCustomer.phone}</Descriptions.Item>
                                    {selectedCustomer.secondaryPhone && (
                                        <Descriptions.Item label="Secondary Phone">{selectedCustomer.secondaryPhone}</Descriptions.Item>
                                    )}
                                    {selectedCustomer.company && (
                                        <Descriptions.Item label="Company">{selectedCustomer.company}</Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Customer ID">{selectedCustomer.customerId}</Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card title="Address" size="small" style={{ marginBottom: 16 }}>
                                <div>
                                    {selectedCustomer.address.street}<br />
                                    {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.zipCode}<br />
                                    {selectedCustomer.address.country}
                                </div>
                            </Card>

                            <Card title="Order Statistics" size="small" style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Statistic
                                            title="Total Orders"
                                            value={selectedCustomer.totalOrders}
                                            valueStyle={{ fontSize: '16px' }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Total Spent"
                                            value={selectedCustomer.totalSpent}
                                            prefix="$"
                                            precision={2}
                                            valueStyle={{ fontSize: '16px' }}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Avg Order"
                                            value={selectedCustomer.averageOrderValue}
                                            prefix="$"
                                            precision={2}
                                            valueStyle={{ fontSize: '16px' }}
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Additional Information" size="small">
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Join Date">{selectedCustomer.joinDate}</Descriptions.Item>
                                    <Descriptions.Item label="Last Order">{selectedCustomer.lastOrderDate || 'Never'}</Descriptions.Item>
                                    {selectedCustomer.dateOfBirth && (
                                        <Descriptions.Item label="Date of Birth">{selectedCustomer.dateOfBirth}</Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Gender">{selectedCustomer.gender}</Descriptions.Item>
                                    <Descriptions.Item label="Loyalty Points">{selectedCustomer.loyaltyPoints}</Descriptions.Item>
                                    <Descriptions.Item label="Marketing Opt-in">{selectedCustomer.marketingOptIn ? 'Yes' : 'No'}</Descriptions.Item>
                                    <Descriptions.Item label="Preferred Communication">{selectedCustomer.preferredCommunication}</Descriptions.Item>
                                    {selectedCustomer.referredBy && (
                                        <Descriptions.Item label="Referred By">{selectedCustomer.referredBy}</Descriptions.Item>
                                    )}
                                    {selectedCustomer.tags && (
                                        <Descriptions.Item label="Tags">
                                            <Tag>{selectedCustomer.tags}</Tag>
                                        </Descriptions.Item>
                                    )}
                                    {selectedCustomer.notes && (
                                        <Descriptions.Item label="Notes">{selectedCustomer.notes}</Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Card>
                        </div>
                    )}
                </Drawer>
            </div>
        </AppLayout>
    );
};

export default CustomersPage;