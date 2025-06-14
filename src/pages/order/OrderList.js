import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router";
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
    DollarOutlined,
    ShoppingCartOutlined,
    CalendarOutlined,
    PrinterOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import AppLayout from '../../layouts/AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Generate sample order data
const generateSampleOrders = () => {
    const statuses = [
        'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
    ];
    const paymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded', 'Partial'];
    const paymentMethods = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash', 'Check'];
    const customers = [
        'John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson',
        'Diana Prince', 'Edward Norton', 'Fiona Apple', 'George Lucas', 'Helen Troy'
    ];
    const products = [
        'Wireless Headphones', 'Smartphone', 'Laptop', 'Gaming Mouse', 'Keyboard',
        'Monitor', 'Tablet', 'Smart Watch', 'Camera', 'Printer'
    ];

    return Array.from({ length: 200 }, (_, index) => {
        const orderDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const orderItems = Array.from({ length: itemCount }, (_, i) => ({
            product: products[Math.floor(Math.random() * products.length)],
            quantity: Math.floor(Math.random() * 3) + 1,
            price: parseFloat((Math.random() * 200 + 20).toFixed(2))
        }));

        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shipping = Math.random() > 0.3 ? parseFloat((Math.random() * 20 + 5).toFixed(2)) : 0;
        const total = subtotal + tax + shipping;

        return {
            key: index + 1,
            orderId: `ORD-${String(index + 1).padStart(5, '0')}`,
            customer: customers[Math.floor(Math.random() * customers.length)],
            customerEmail: `customer${index + 1}@example.com`,
            customerPhone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            orderDate: orderDate.toISOString().split('T')[0],
            items: orderItems,
            itemCount: itemCount,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shipping: shipping,
            total: parseFloat(total.toFixed(2)),
            shippingAddress: {
                street: `${Math.floor(Math.random() * 9999) + 1} Main St`,
                city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
                state: 'NY',
                zipCode: String(Math.floor(Math.random() * 90000) + 10000),
                country: 'USA'
            },
            notes: Math.random() > 0.7 ? 'Customer requested express delivery' : '',
            trackingNumber: Math.random() > 0.5 ? `TRK${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}` : null
        };
    });
};

const OrdersPage = () => {
    let navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
    const [dateRange, setDateRange] = useState([]);
    const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
    });

    // Statistics
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0
    });

    // Initialize data
    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;

        if (searchText) {
            filtered = filtered.filter(order =>
                order.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
                order.customer.toLowerCase().includes(searchText.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        if (selectedPaymentStatus !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === selectedPaymentStatus);
        }

        if (dateRange.length === 2) {
            const [startDate, endDate] = dateRange;
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.orderDate);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        setFilteredOrders(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
    }, [searchText, selectedStatus, selectedPaymentStatus, dateRange, orders]);

    const loadOrders = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateSampleOrders();
            setOrders(data);
            setFilteredOrders(data);

            // Calculate statistics
            const totalRevenue = data.reduce((sum, order) => sum + order.total, 0);
            const pendingOrders = data.filter(order => ['Pending', 'Confirmed', 'Processing'].includes(order.status)).length;
            const completedOrders = data.filter(order => order.status === 'Delivered').length;

            setStats({
                totalOrders: data.length,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                pendingOrders,
                completedOrders
            });

            setPagination(prev => ({ ...prev, total: data.length }));
            setLoading(false);
        }, 1000);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleViewOrder = (record) => {
        setSelectedOrder(record);
        setOrderDetailsVisible(true);
    };

    const handleEditOrder = (record) => {
        message.info(`Edit order: ${record.orderId}`);
    };

    const handleDeleteOrder = (record) => {
        confirm({
            title: 'Are you sure you want to delete this order?',
            icon: <ExclamationCircleOutlined />,
            content: `Order ID: ${record.orderId}`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                const updatedOrders = orders.filter(order => order.key !== record.key);
                setOrders(updatedOrders);
                message.success('Order deleted successfully');
            },
        });
    };

    const handleStatusChange = (record, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.key === record.key ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        message.success(`Order status updated to ${newStatus}`);
    };

    const handlePrintOrder = (record) => {
        message.info(`Print order: ${record.orderId}`);
    };

    const handleEmailCustomer = (record) => {
        message.info(`Send email to: ${record.customerEmail}`);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'orange',
            'Confirmed': 'blue',
            'Processing': 'purple',
            'Shipped': 'cyan',
            'Delivered': 'green',
            'Cancelled': 'red',
            'Refunded': 'default'
        };
        return colors[status] || 'default';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            'Paid': 'green',
            'Pending': 'orange',
            'Failed': 'red',
            'Refunded': 'purple',
            'Partial': 'blue'
        };
        return colors[status] || 'default';
    };

    const statusMenuItems = (record) => [
        { key: 'Pending', label: 'Pending' },
        { key: 'Confirmed', label: 'Confirmed' },
        { key: 'Processing', label: 'Processing' },
        { key: 'Shipped', label: 'Shipped' },
        { key: 'Delivered', label: 'Delivered' },
        { key: 'Cancelled', label: 'Cancelled' }
    ].map(item => ({
        ...item,
        onClick: () => handleStatusChange(record, item.key)
    }));

    const actionMenuItems = (record) => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => handleViewOrder(record)
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Order',
            onClick: () => handleEditOrder(record)
        },
        {
            key: 'print',
            icon: <PrinterOutlined />,
            label: 'Print Order',
            onClick: () => handlePrintOrder(record)
        },
        {
            key: 'email',
            icon: <MailOutlined />,
            label: 'Email Customer',
            onClick: () => handleEmailCustomer(record)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Order',
            danger: true,
            onClick: () => handleDeleteOrder(record)
        },
    ];

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 130,
            fixed: 'left',
            render: (orderId, record) => (
                <Button type="link" onClick={() => handleViewOrder(record)} style={{ padding: 0 }}>
                    {orderId}
                </Button>
            ),
            sorter: (a, b) => a.orderId.localeCompare(b.orderId),
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
            key: 'customer',
            width: 150,
            render: (customer, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar icon={<UserOutlined />} size={32} style={{ marginRight: 8, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500 }}>{customer}</div>
                        <div style={{ fontSize: '12px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {record.customerEmail}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.customer.localeCompare(b.customer),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status, record) => (
                <Dropdown
                    menu={{ items: statusMenuItems(record) }}
                    trigger={['click']}
                >
                    <Tag color={getStatusColor(status)} style={{ cursor: 'pointer' }}>
                        {status}
                    </Tag>
                </Dropdown>
            ),
            filters: [
                { text: 'Pending', value: 'Pending' },
                { text: 'Confirmed', value: 'Confirmed' },
                { text: 'Processing', value: 'Processing' },
                { text: 'Shipped', value: 'Shipped' },
                { text: 'Delivered', value: 'Delivered' },
                { text: 'Cancelled', value: 'Cancelled' },
                { text: 'Refunded', value: 'Refunded' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            width: 130,
            render: (status) => (
                <Tag color={getPaymentStatusColor(status)}>{status}</Tag>
            ),
            filters: [
                { text: 'Paid', value: 'Paid' },
                { text: 'Pending', value: 'Pending' },
                { text: 'Failed', value: 'Failed' },
                { text: 'Refunded', value: 'Refunded' },
                { text: 'Partial', value: 'Partial' },
            ],
            onFilter: (value, record) => record.paymentStatus === value,
        },
        {
            title: 'Items',
            dataIndex: 'itemCount',
            key: 'itemCount',
            width: 80,
            render: (count) => <Badge count={count} color="blue" />,
            sorter: (a, b) => a.itemCount - b.itemCount,
        },
        {
            title: 'Total Amount',
            dataIndex: 'total',
            key: 'total',
            width: 120,
            render: (total) => (
                <Text strong style={{ color: '#1890ff' }}>
                    ${total.toFixed(2)}
                </Text>
            ),
            sorter: (a, b) => a.total - b.total,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 130,
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            width: 120,
            sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
        },
        {
            title: 'Tracking',
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            width: 120,
            render: (tracking) => tracking ? (
                <Button type="link" size="small" onClick={() => message.info(`Track: ${tracking}`)}>
                    {tracking}
                </Button>
            ) : <Text type="secondary">N/A</Text>
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
                            onClick={() => handleViewOrder(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Order">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditOrder(record)}
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
                    <Title level={2} style={{ margin: 0 }}>Orders</Title>
                    <Text type="secondary">
                        Manage customer orders, track status, and process payments
                    </Text>
                </div>

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Orders"
                                value={stats.totalOrders}
                                prefix={<ShoppingCartOutlined />}
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
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Pending Orders"
                                value={stats.pendingOrders}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Completed Orders"
                                value={stats.completedOrders}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Search
                                placeholder="Search by Order ID, Customer, or Email..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={handleSearch}
                                onChange={(e) => !e.target.value && handleSearch('')}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Status"
                                style={{ width: '100%' }}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            >
                                <Option value="all">All Status</Option>
                                <Option value="Pending">Pending</Option>
                                <Option value="Confirmed">Confirmed</Option>
                                <Option value="Processing">Processing</Option>
                                <Option value="Shipped">Shipped</Option>
                                <Option value="Delivered">Delivered</Option>
                                <Option value="Cancelled">Cancelled</Option>
                                <Option value="Refunded">Refunded</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={4}>
                            <Select
                                placeholder="Payment Status"
                                style={{ width: '100%' }}
                                value={selectedPaymentStatus}
                                onChange={setSelectedPaymentStatus}
                            >
                                <Option value="all">All Payments</Option>
                                <Option value="Paid">Paid</Option>
                                <Option value="Pending">Pending</Option>
                                <Option value="Failed">Failed</Option>
                                <Option value="Refunded">Refunded</Option>
                                <Option value="Partial">Partial</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={5}>
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={setDateRange}
                                placeholder={['Start Date', 'End Date']}
                            />
                        </Col>
                        <Col xs={24} md={2}>
                            <Space>
                                <Tooltip title="Export Orders">
                                    <Button icon={<ExportOutlined />} />
                                </Tooltip>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/orders/new")}
                                >
                                    New Order
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Orders Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredOrders}
                        pagination={{
                            ...pagination,
                            total: filteredOrders.length,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} orders`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        // scroll={{ x: 1400, y: 600 }}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected orders:', selectedRows);
                            },
                        }}
                    />
                </Card>

                {/* Order Details Drawer */}
                <Drawer
                    title={`Order Details - ${selectedOrder?.orderId}`}
                    width={600}
                    open={orderDetailsVisible}
                    onClose={() => setOrderDetailsVisible(false)}
                    extra={
                        <Space>
                            <Button onClick={() => handlePrintOrder(selectedOrder)} icon={<PrinterOutlined />}>
                                Print
                            </Button>
                            <Button onClick={() => handleEmailCustomer(selectedOrder)} icon={<MailOutlined />}>
                                Email
                            </Button>
                        </Space>
                    }
                >
                    {selectedOrder && (
                        <div>
                            {/* Order Status */}
                            <Card size="small" style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Text strong>Status: </Text>
                                        <Tag color={getStatusColor(selectedOrder.status)}>
                                            {selectedOrder.status}
                                        </Tag>
                                    </Col>
                                    <Col span={8}>
                                        <Text strong>Payment: </Text>
                                        <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                                            {selectedOrder.paymentStatus}
                                        </Tag>
                                    </Col>
                                    <Col span={8}>
                                        <Link to={`/orders/${selectedOrder.orderId}`}>Click for details</Link>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Customer Information */}
                            <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Name">{selectedOrder.customer}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{selectedOrder.customerEmail}</Descriptions.Item>
                                    <Descriptions.Item label="Phone">{selectedOrder.customerPhone}</Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Shipping Address */}
                            <Card title="Shipping Address" size="small" style={{ marginBottom: 16 }}>
                                <div>
                                    {selectedOrder.shippingAddress.street}<br />
                                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                                    {selectedOrder.shippingAddress.country}
                                </div>
                            </Card>

                            {/* Order Items */}
                            <Card title="Order Items" size="small" style={{ marginBottom: 16 }}>
                                <div style={{ marginBottom: 16 }}>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: '8px 0',
                                            borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #f0f0f0' : 'none'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{item.product}</div>
                                                <div style={{ fontSize: '12px', color: '#666' }}>
                                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 500 }}>
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ marginBottom: 4 }}>
                                        <Text>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ marginBottom: 4 }}>
                                        <Text>Tax: ${selectedOrder.tax.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>Shipping: ${selectedOrder.shipping.toFixed(2)}</Text>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                        Total: ${selectedOrder.total.toFixed(2)}
                                    </div>
                                </div>
                            </Card>

                            {/* Payment & Tracking */}
                            <Card title="Additional Information" size="small">
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Payment Method">
                                        {selectedOrder.paymentMethod}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Order Date">
                                        {selectedOrder.orderDate}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Tracking Number">
                                        {selectedOrder.trackingNumber || 'Not assigned'}
                                    </Descriptions.Item>
                                    {selectedOrder.notes && (
                                        <Descriptions.Item label="Notes">
                                            {selectedOrder.notes}
                                        </Descriptions.Item>
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

export default OrdersPage;