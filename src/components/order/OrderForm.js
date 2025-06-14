import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import dayjs from 'dayjs';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Table,
    Divider,
    AutoComplete,
    DatePicker,
    message,
    Alert
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    PlusOutlined,
    DeleteOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Sample data
const sampleCustomers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0101' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0102' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1-555-0103' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1-555-0104' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1-555-0105' }
];

const sampleProducts = [
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', price: 99.99, stock: 50 },
    { id: 2, name: 'Smartphone Case', sku: 'SC-002', price: 29.99, stock: 100 },
    { id: 3, name: 'Bluetooth Speaker', sku: 'BS-003', price: 79.99, stock: 25 },
    { id: 4, name: 'USB Cable', sku: 'UC-004', price: 14.99, stock: 200 },
    { id: 5, name: 'Power Bank', sku: 'PB-005', price: 49.99, stock: 75 }
];

export const OrderForm = ({
    mode = 'create',
    initialData = null,
    onSubmit,
    loading = false,
    onCancel
}) => {
    let navigate = useNavigate();

    const [form] = Form.useForm();
    const [orderItems, setOrderItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearchValue, setCustomerSearchValue] = useState('');
    const [productSearchValue, setProductSearchValue] = useState('');
    const [totals, setTotals] = useState({
        subtotal: 0,
        taxRate: 8, // 8% tax
        tax: 0,
        shipping: 0,
        discount: 0,
        total: 0
    });

    const isEditMode = mode === 'edit';
    const pageTitle = isEditMode ? 'Edit Order' : 'Create New Order';
    const submitButtonText = isEditMode ? 'Update Order' : 'Create Order';

    // Initialize form with existing data for edit mode
    useEffect(() => {
        if (isEditMode && initialData) {
            form.setFieldsValue({
                ...initialData,
                orderDate: initialData.orderDate ? new Date(initialData.orderDate) : new Date()
            });

            if (initialData.customer) {
                setSelectedCustomer(initialData.customer);
                setCustomerSearchValue(initialData.customer.name || initialData.customerName);
            }

            if (initialData.items) {
                setOrderItems(initialData.items);
            }
        } else {
            // Set default values for create mode
            form.setFieldsValue({
                orderDate: new Date(),
                status: 'Pending',
                paymentStatus: 'Pending',
                paymentMethod: 'Credit Card'
            });
        }
    }, [initialData, isEditMode, form]);

    // Calculate totals whenever order items or rates change
    useEffect(() => {
        calculateTotals();
    }, [orderItems, totals.taxRate, totals.shipping, totals.discount]);

    const calculateTotals = () => {
        const subtotal = orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const tax = (subtotal * totals.taxRate) / 100;
        const total = subtotal + tax + totals.shipping - totals.discount;

        setTotals(prev => ({
            ...prev,
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            total: parseFloat(total.toFixed(2))
        }));
    };

    const onFinish = async (values) => {
        if (orderItems.length === 0) {
            message.error('Please add at least one item to the order');
            return;
        }

        if (!selectedCustomer) {
            message.error('Please select a customer');
            return;
        }

        try {
            const orderData = {
                ...values,
                customer: selectedCustomer,
                items: orderItems,
                totals: totals,
                ...(isEditMode && initialData ? { id: initialData.id } : { orderId: generateOrderId() }),
                updatedAt: new Date().toISOString(),
                ...(mode === 'create' ? { createdAt: new Date().toISOString() } : {})
            };

            await onSubmit(orderData);
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'create'} order. Please try again.`);
        }
    };

    const generateOrderId = () => {
        const timestamp = Date.now().toString().slice(-6);
        return `ORD-${timestamp}`;
    };

    // Customer search and selection
    const handleCustomerSearch = (value) => {
        setCustomerSearchValue(value);
    };

    const handleCustomerSelect = (value, option) => {
        const customer = sampleCustomers.find(c => c.id === option.key);
        setSelectedCustomer(customer);
        setCustomerSearchValue(customer.name);

        // Auto-fill shipping address if available
        form.setFieldsValue({
            shippingName: customer.name,
            shippingEmail: customer.email,
            shippingPhone: customer.phone
        });
    };

    const getCustomerOptions = () => {
        return sampleCustomers
            .filter(customer =>
                customer.name.toLowerCase().includes(customerSearchValue.toLowerCase()) ||
                customer.email.toLowerCase().includes(customerSearchValue.toLowerCase())
            )
            .map(customer => ({
                value: customer.name,
                key: customer.id,
                label: (
                    <div>
                        <div style={{ fontWeight: 500 }}>{customer.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{customer.email}</div>
                    </div>
                )
            }));
    };

    // Product search and selection
    const handleAddProduct = () => {
        const newItem = {
            id: Date.now(),
            productId: null,
            name: '',
            sku: '',
            price: 0,
            quantity: 1,
            total: 0
        };
        setOrderItems([...orderItems, newItem]);
    };

    const handleRemoveItem = (id) => {
        setOrderItems(orderItems.filter(item => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        setOrderItems(orderItems.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };

                // If product is selected, auto-fill details
                if (field === 'productId' && value) {
                    const product = sampleProducts.find(p => p.id === value);
                    if (product) {
                        updatedItem.name = product.name;
                        updatedItem.sku = product.sku;
                        updatedItem.price = product.price;
                    }
                }

                // Calculate item total
                updatedItem.total = updatedItem.quantity * updatedItem.price;
                return updatedItem;
            }
            return item;
        }));
    };

    const getProductOptions = () => {
        return sampleProducts.map(product => ({
            value: product.id,
            label: `${product.name} (${product.sku}) - $${product.price}`
        }));
    };

    // Order items table columns
    const itemColumns = [
        {
            title: 'Product',
            key: 'product',
            width: 300,
            render: (_, record, index) => (
                <Select
                    placeholder="Select product"
                    style={{ width: '100%' }}
                    value={record.productId}
                    onChange={(value) => handleItemChange(record.id, 'productId', value)}
                    showSearch
                    filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={getProductOptions()}
                />
            ),
        },
        {
            title: 'SKU',
            key: 'sku',
            width: 120,
            render: (_, record) => (
                <Text type="secondary">{record.sku}</Text>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            width: 100,
            render: (_, record) => (
                <InputNumber
                    value={record.price}
                    onChange={(value) => handleItemChange(record.id, 'price', value || 0)}
                    precision={2}
                    min={0}
                    prefix="$"
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Quantity',
            key: 'quantity',
            width: 100,
            render: (_, record) => (
                <InputNumber
                    value={record.quantity}
                    onChange={(value) => handleItemChange(record.id, 'quantity', value || 1)}
                    min={1}
                    style={{ width: '100%' }}
                />
            ),
        },
        {
            title: 'Total',
            key: 'total',
            width: 100,
            render: (_, record) => (
                <Text strong>${record.total.toFixed(2)}</Text>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            width: 60,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.id)}
                />
            ),
        },
    ];

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/orders")}
                    style={{ marginBottom: 16 }}
                >
                    Back to Orders
                </Button>
                <Title level={2} style={{ margin: 0 }}>{pageTitle}</Title>
                <Text type="secondary">
                    {isEditMode
                        ? 'Update order information and manage order items'
                        : 'Create a new order with customer details and products'
                    }
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Row gutter={24}>
                    {/* Left Column */}
                    <Col xs={24} lg={16}>
                        {/* Customer Information */}
                        <Card title="Customer Information" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Select Customer"
                                        required
                                    >
                                        <AutoComplete
                                            value={customerSearchValue}
                                            options={getCustomerOptions()}
                                            onSearch={handleCustomerSearch}
                                            onSelect={handleCustomerSelect}
                                            placeholder="Search customer by name or email"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>

                                    {selectedCustomer && (
                                        <Alert
                                            message={`Selected: ${selectedCustomer.name}`}
                                            description={`${selectedCustomer.email} • ${selectedCustomer.phone}`}
                                            type="info"
                                            showIcon
                                            style={{ marginTop: 8 }}
                                        />
                                    )}
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="customerNotes"
                                        label="Customer Notes"
                                    >
                                        <TextArea
                                            placeholder="Special instructions or notes about customer"
                                            rows={3}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Shipping Information */}
                        <Card title="Shipping Information" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="shippingName"
                                        label="Full Name"
                                        rules={[{ required: true, message: 'Please enter shipping name' }]}
                                    >
                                        <Input placeholder="Enter full name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="shippingEmail"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Please enter email' },
                                            { type: 'email', message: 'Please enter valid email' }
                                        ]}
                                    >
                                        <Input placeholder="Enter email address" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="shippingPhone"
                                        label="Phone Number"
                                        rules={[{ required: true, message: 'Please enter phone number' }]}
                                    >
                                        <Input placeholder="Enter phone number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="shippingCompany"
                                        label="Company (Optional)"
                                    >
                                        <Input placeholder="Enter company name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="shippingAddress"
                                label="Street Address"
                                rules={[{ required: true, message: 'Please enter address' }]}
                            >
                                <Input placeholder="Enter street address" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="shippingCity"
                                        label="City"
                                        rules={[{ required: true, message: 'Please enter city' }]}
                                    >
                                        <Input placeholder="Enter city" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="shippingState"
                                        label="State/Province"
                                        rules={[{ required: true, message: 'Please enter state' }]}
                                    >
                                        <Input placeholder="Enter state" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="shippingZip"
                                        label="ZIP/Postal Code"
                                        rules={[{ required: true, message: 'Please enter ZIP code' }]}
                                    >
                                        <Input placeholder="Enter ZIP code" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="shippingCountry"
                                label="Country"
                                rules={[{ required: true, message: 'Please select country' }]}
                                initialValue="United States"
                            >
                                <Select placeholder="Select country">
                                    <Option value="United States">United States</Option>
                                    <Option value="Canada">Canada</Option>
                                    <Option value="United Kingdom">United Kingdom</Option>
                                    <Option value="Australia">Australia</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        {/* Order Items */}
                        <Card
                            title="Order Items"
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddProduct}
                                >
                                    Add Product
                                </Button>
                            }
                            style={{ marginBottom: 24 }}
                        >
                            {orderItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                                    <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                                    <div>No items added yet</div>
                                    <div>Click "Add Product" to start building the order</div>
                                </div>
                            ) : (
                                <Table
                                    dataSource={orderItems}
                                    columns={itemColumns}
                                    pagination={false}
                                    rowKey="id"
                                    size="middle"
                                />
                            )}
                        </Card>
                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={8}>
                        {/* Order Details */}
                        <Card title="Order Details" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="orderDate"
                                label="Order Date"
                                rules={[{ required: true, message: 'Please select order date' }]}
                                getValueProps={(value) => ({
                                    value: value ? dayjs(value) : undefined
                                })}
                                normalize={(value) => value ? value.format('YYYY-MM-DD') : undefined}
                            >
                                <DatePicker style={{ width: '100%' }} format={'DD-MM-YYYY'} onChange={() => { }} />
                            </Form.Item>

                            <Form.Item
                                name="status"
                                label="Order Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Select placeholder="Select status">
                                    <Option value="Pending">Pending</Option>
                                    <Option value="Confirmed">Confirmed</Option>
                                    <Option value="Processing">Processing</Option>
                                    <Option value="Shipped">Shipped</Option>
                                    <Option value="Delivered">Delivered</Option>
                                    <Option value="Cancelled">Cancelled</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="priority"
                                label="Priority"
                                initialValue="Normal"
                            >
                                <Select>
                                    <Option value="Low">Low</Option>
                                    <Option value="Normal">Normal</Option>
                                    <Option value="High">High</Option>
                                    <Option value="Urgent">Urgent</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        {/* Payment Information */}
                        <Card title="Payment Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="paymentStatus"
                                label="Payment Status"
                                rules={[{ required: true, message: 'Please select payment status' }]}
                            >
                                <Select placeholder="Select payment status">
                                    <Option value="Pending">Pending</Option>
                                    <Option value="Paid">Paid</Option>
                                    <Option value="Failed">Failed</Option>
                                    <Option value="Refunded">Refunded</Option>
                                    <Option value="Partial">Partial</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="paymentMethod"
                                label="Payment Method"
                                rules={[{ required: true, message: 'Please select payment method' }]}
                            >
                                <Select placeholder="Select payment method">
                                    <Option value="Credit Card">Credit Card</Option>
                                    <Option value="PayPal">PayPal</Option>
                                    <Option value="Bank Transfer">Bank Transfer</Option>
                                    <Option value="Cash">Cash</Option>
                                    <Option value="Check">Check</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="paymentReference"
                                label="Payment Reference"
                            >
                                <Input placeholder="Transaction ID or reference" />
                            </Form.Item>
                        </Card>

                        {/* Order Totals */}
                        <Card title="Order Totals" style={{ marginBottom: 24 }}>
                            <div style={{ marginBottom: 16 }}>
                                <Row justify="space-between" style={{ marginBottom: 8 }}>
                                    <Col><Text>Subtotal:</Text></Col>
                                    <Col><Text>${totals.subtotal.toFixed(2)}</Text></Col>
                                </Row>

                                <Row justify="space-between" style={{ marginBottom: 8 }}>
                                    <Col>
                                        <Text>Tax ({totals.taxRate}%):</Text>
                                    </Col>
                                    <Col><Text>${totals.tax.toFixed(2)}</Text></Col>
                                </Row>

                                <Row justify="space-between" style={{ marginBottom: 8 }}>
                                    <Col><Text>Shipping:</Text></Col>
                                    <Col>
                                        <InputNumber
                                            value={totals.shipping}
                                            onChange={(value) => setTotals(prev => ({ ...prev, shipping: value || 0 }))}
                                            precision={2}
                                            min={0}
                                            prefix="$"
                                            size="small"
                                            style={{ width: 80 }}
                                        />
                                    </Col>
                                </Row>

                                <Row justify="space-between" style={{ marginBottom: 8 }}>
                                    <Col><Text>Discount:</Text></Col>
                                    <Col>
                                        <InputNumber
                                            value={totals.discount}
                                            onChange={(value) => setTotals(prev => ({ ...prev, discount: value || 0 }))}
                                            precision={2}
                                            min={0}
                                            prefix="$"
                                            size="small"
                                            style={{ width: 80 }}
                                        />
                                    </Col>
                                </Row>

                                <Divider style={{ margin: '12px 0' }} />

                                <Row justify="space-between">
                                    <Col><Text strong style={{ fontSize: '16px' }}>Total:</Text></Col>
                                    <Col><Text strong style={{ fontSize: '16px', color: '#1890ff' }}>${totals.total.toFixed(2)}</Text></Col>
                                </Row>
                            </div>
                        </Card>

                        {/* Additional Information */}
                        <Card title="Additional Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="trackingNumber"
                                label="Tracking Number"
                            >
                                <Input placeholder="Enter tracking number" />
                            </Form.Item>

                            <Form.Item
                                name="orderNotes"
                                label="Order Notes"
                            >
                                <TextArea
                                    placeholder="Internal notes about this order"
                                    rows={3}
                                />
                            </Form.Item>

                            <Form.Item
                                name="customerInstructions"
                                label="Customer Instructions"
                            >
                                <TextArea
                                    placeholder="Special delivery instructions"
                                    rows={2}
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                {/* Action Buttons */}
                <Card>
                    <Row justify="end">
                        <Col>
                            <Space>
                                <Button size="large" onClick={() => form.resetFields()}>
                                    Reset
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => message.info('Save as draft')}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    {submitButtonText}
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div >
    );
};

