import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    Table,
    Divider,
    Tag,
    Alert,
    message
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    PrinterOutlined,
    MailOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router";
import { ReadOnlyField, ReadOnlyTextArea } from '../../components/form/ReadOnlyField';

const { Title, Text } = Typography;

const OrderViewPage = ({ orderData, onBack, onEdit }) => {
    let navigate = useNavigate();

    const isCompleted = orderData?.status === 'Delivered' || orderData?.status === 'Cancelled';
    const canEdit = !isCompleted;

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

    const handlePrint = () => {
        message.info('Print order functionality');
    };

    const handleEmail = () => {
        message.info('Email customer functionality');
    };

    // Order items for read-only table
    const itemColumns = [
        {
            title: 'Product',
            key: 'product',
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: '500' }}>{record.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>SKU: {record.sku}</div>
                </div>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => `$${record.price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Total',
            key: 'total',
            render: (_, record) => (
                <Text strong>${record.total.toFixed(2)}</Text>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/orders")}
                    style={{ marginBottom: 16 }}
                >
                    Back to Orders
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            Order #{orderData?.orderId || 'N/A'}
                        </Title>
                        <Text type="secondary">
                            {isCompleted ? 'Order completed - Read-only view' : 'Order details view'}
                        </Text>
                    </div>
                    <Space>
                        <Button icon={<PrinterOutlined />} onClick={handlePrint}>
                            Print
                        </Button>
                        <Button icon={<MailOutlined />} onClick={handleEmail}>
                            Email Customer
                        </Button>
                        {canEdit && (
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={onEdit}
                            >
                                Edit Order
                            </Button>
                        )}
                    </Space>
                </div>
            </div>

            {/* Status Alert */}
            {isCompleted && (
                <Alert
                    message={`Order is ${orderData.status.toLowerCase()}`}
                    description="This order cannot be edited. Contact administrator if changes are required."
                    type={orderData.status === 'Delivered' ? 'success' : 'warning'}
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            <Row gutter={24}>
                {/* Left Column */}
                <Col xs={24} lg={16}>
                    {/* Order Status */}
                    <Card title="Order Status" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <ReadOnlyField
                                label="Order Status"
                                value={
                                    <Tag color={getStatusColor(orderData?.status)}>
                                        {orderData?.status}
                                    </Tag>
                                }
                                span={8}
                            />
                            <ReadOnlyField
                                label="Payment Status"
                                value={
                                    <Tag color={getPaymentStatusColor(orderData?.paymentStatus)}>
                                        {orderData?.paymentStatus}
                                    </Tag>
                                }
                                span={8}
                            />
                            <ReadOnlyField
                                label="Priority"
                                value={orderData?.priority}
                                span={8}
                            />
                        </Row>
                    </Card>

                    {/* Customer Information */}
                    <Card title="Customer Information" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <ReadOnlyField
                                label="Customer Name"
                                value={orderData?.customer?.name || orderData?.customerName}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Email"
                                value={orderData?.customer?.email || orderData?.customerEmail}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Phone"
                                value={orderData?.customer?.phone || orderData?.customerPhone}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Customer ID"
                                value={orderData?.customer?.id}
                                span={12}
                            />
                        </Row>
                        {orderData?.customerNotes && (
                            <Row>
                                <ReadOnlyTextArea
                                    label="Customer Notes"
                                    value={orderData.customerNotes}
                                    span={24}
                                />
                            </Row>
                        )}
                    </Card>

                    {/* Shipping Information */}
                    <Card title="Shipping Information" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <ReadOnlyField
                                label="Recipient Name"
                                value={orderData?.shippingName}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Email"
                                value={orderData?.shippingEmail}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Phone"
                                value={orderData?.shippingPhone}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Company"
                                value={orderData?.shippingCompany}
                                span={12}
                            />
                            <ReadOnlyField
                                label="Street Address"
                                value={orderData?.shippingAddress}
                                span={24}
                            />
                            <ReadOnlyField
                                label="City"
                                value={orderData?.shippingCity}
                                span={8}
                            />
                            <ReadOnlyField
                                label="State/Province"
                                value={orderData?.shippingState}
                                span={8}
                            />
                            <ReadOnlyField
                                label="ZIP/Postal Code"
                                value={orderData?.shippingZip}
                                span={8}
                            />
                            <ReadOnlyField
                                label="Country"
                                value={orderData?.shippingCountry}
                                span={12}
                            />
                        </Row>
                        {orderData?.customerInstructions && (
                            <Row>
                                <ReadOnlyTextArea
                                    label="Customer Instructions"
                                    value={orderData.customerInstructions}
                                    span={24}
                                />
                            </Row>
                        )}
                    </Card>

                    {/* Order Items */}
                    <Card title="Order Items" style={{ marginBottom: 24 }}>
                        <Table
                            dataSource={orderData?.items || []}
                            columns={itemColumns}
                            pagination={false}
                            rowKey="id"
                            size="middle"
                            style={{
                                '.ant-table-thead > tr > th': {
                                    background: '#fafafa'
                                }
                            }}
                        />

                        <Divider />

                        {/* Order Totals */}
                        <div style={{
                            background: '#fafafa',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '16px'
                        }}>
                            <Row justify="end">
                                <Col span={8}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Subtotal:</Text>
                                            <Text>${orderData?.totals?.subtotal?.toFixed(2) || '0.00'}</Text>
                                        </div>
                                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Tax:</Text>
                                            <Text>${orderData?.totals?.tax?.toFixed(2) || '0.00'}</Text>
                                        </div>
                                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                            <Text>Shipping:</Text>
                                            <Text>${orderData?.totals?.shipping?.toFixed(2) || '0.00'}</Text>
                                        </div>
                                        {orderData?.totals?.discount > 0 && (
                                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                                                <Text>Discount:</Text>
                                                <Text>-${orderData.totals.discount.toFixed(2)}</Text>
                                            </div>
                                        )}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong style={{ fontSize: '16px' }}>Total:</Text>
                                            <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                                ${orderData?.totals?.total?.toFixed(2) || '0.00'}
                                            </Text>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={8}>
                    {/* Order Details */}
                    <Card title="Order Details" style={{ marginBottom: 24 }}>
                        <Row>
                            <ReadOnlyField
                                label="Order ID"
                                value={orderData?.orderId}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Order Date"
                                value={orderData?.orderDate}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Created Date"
                                value={orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : '-'}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Last Updated"
                                value={orderData?.updatedAt ? new Date(orderData.updatedAt).toLocaleDateString() : '-'}
                                span={24}
                            />
                        </Row>
                    </Card>

                    {/* Payment Information */}
                    <Card title="Payment Information" style={{ marginBottom: 24 }}>
                        <Row>
                            <ReadOnlyField
                                label="Payment Method"
                                value={orderData?.paymentMethod}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Payment Reference"
                                value={orderData?.paymentReference}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Payment Status"
                                value={
                                    <Tag color={getPaymentStatusColor(orderData?.paymentStatus)}>
                                        {orderData?.paymentStatus}
                                    </Tag>
                                }
                                span={24}
                            />
                        </Row>
                    </Card>

                    {/* Shipping & Tracking */}
                    <Card title="Shipping & Tracking" style={{ marginBottom: 24 }}>
                        <Row>
                            <ReadOnlyField
                                label="Tracking Number"
                                value={orderData?.trackingNumber}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Shipping Method"
                                value={orderData?.shippingMethod || 'Standard Shipping'}
                                span={24}
                            />
                            <ReadOnlyField
                                label="Estimated Delivery"
                                value={orderData?.estimatedDelivery}
                                span={24}
                            />
                        </Row>
                    </Card>

                    {/* Additional Information */}
                    <Card title="Additional Information" style={{ marginBottom: 24 }}>
                        <Row>
                            {orderData?.orderNotes && (
                                <ReadOnlyTextArea
                                    label="Order Notes"
                                    value={orderData.orderNotes}
                                    span={24}
                                />
                            )}
                            {orderData?.internalNotes && (
                                <ReadOnlyTextArea
                                    label="Internal Notes"
                                    value={orderData.internalNotes}
                                    span={24}
                                />
                            )}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OrderViewPage;