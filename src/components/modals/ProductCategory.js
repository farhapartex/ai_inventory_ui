import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Table,
    Button,
    Input,
    Form,
    Space,
    Tag,
    Dropdown,
    Tooltip,
    Modal,
    message,
    Typography,
    Row,
    Col,
    Select,
    Card
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    SaveOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const generateSampleData = () => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'];

    return Array.from({ length: categories.length }, (_, index) => ({
        key: index + 1,
        category: categories[index],
        quantity: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
};

const ProductCategoryModal = (props) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const { isModalOpen, setIsModalOpen } = props;
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
    });

    const loadCategories = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateSampleData();
            setCategories(data);
            setFilteredCategories(data);
            setPagination(prev => ({
                ...prev,
                total: data.length
            }));
            setLoading(false);
        }, 1000);
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'In Stock': return 'green';
            case 'Low Stock': return 'orange';
            case 'Out of Stock': return 'red';
            case 'Discontinued': return 'default';
            default: return 'blue';
        }
    };

    const getQuantityStatus = (quantity) => {
        if (quantity === 0) return { color: 'red', text: 'Out of Stock' };
        if (quantity < 10) return { color: 'orange', text: 'Low Stock' };
        return { color: 'green', text: 'In Stock' };
    };

    const handleEdit = (record) => {
        message.info(`Edit product: ${record.name}`);
    };

    const handleView = (record) => {
        message.info(`View product details: ${record.name}`);
    };

    const handleDelete = (record) => {
        // confirm({
        //     title: 'Are you sure you want to delete this product?',
        //     icon: <ExclamationCircleOutlined />,
        //     content: `Product: ${record.name} (${record.sku})`,
        //     okText: 'Yes, Delete',
        //     okType: 'danger',
        //     cancelText: 'Cancel',
        //     onOk() {
        //         // Simulate delete
        //         const updatedProducts = products.filter(product => product.key !== record.key);
        //         setProducts(updatedProducts);
        //         setFilteredProducts(updatedProducts);
        //         setPagination(prev => ({
        //             ...prev,
        //             total: updatedProducts.length
        //         }));
        //         message.success('Product deleted successfully');
        //     },
        // });
    };

    const actionMenuItems = (record) => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => handleView(record)
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Product',
            onClick: () => handleEdit(record)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Product',
            danger: true,
            onClick: () => handleDelete(record)
        },
    ];

    const columns = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 130,
            filters: [
                { text: 'Electronics', value: 'Electronics' },
                { text: 'Clothing', value: 'Clothing' },
                { text: 'Home & Garden', value: 'Home & Garden' },
                { text: 'Sports', value: 'Sports' },
                { text: 'Books', value: 'Books' },
                { text: 'Automotive', value: 'Automotive' },
            ],
            onFilter: (value, record) => record.category === value,
        },
        {
            title: 'Product Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            render: (quantity) => {
                const status = getQuantityStatus(quantity);
                return (
                    <div>
                        <div style={{ fontWeight: 500 }}>{quantity}</div>
                    </div>
                );
            },
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status}</Tag>
            ),
            filters: [
                { text: 'In Stock', value: 'In Stock' },
                { text: 'Low Stock', value: 'Low Stock' },
                { text: 'Out of Stock', value: 'Out of Stock' },
                { text: 'Discontinued', value: 'Discontinued' },
            ],
            onFilter: (value, record) => record.status === value,
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
                            onClick={() => navigate(`/products/${record.id}`)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Product">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => { }}
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

    const onFinish = async (values) => {
        try {
            console.log(values);
        } catch (error) {
            message.error(`Failed to create. Please try again.`);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Please check the form for errors and try again.');
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        loadCategories();
    }, []);


    return (
        <Modal
            title="Product Categories"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            footer={null}
        >

            {showTable &&
                <>
                    <div style={{ marginBottom: 24, float: 'right' }}>
                        <Button
                            type="primary"
                            icon={null}
                            size="medium"
                            onClick={() => setShowTable(false)}
                            style={{ minWidth: 140 }}
                        >
                            New Category
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filteredCategories}
                        pagination={{
                            ...pagination,
                            total: filteredCategories.length,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} products`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected products:', selectedRows);
                            },
                        }}
                        style={{ marginBottom: '30px' }}
                    />
                </>
            }

            {!showTable &&
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    scrollToFirstError
                    initialValues={{
                        status: 'active',
                        visibility: 'visible',
                        trackQuantity: true,
                        availableOnline: true,
                        featured: false
                    }}
                >
                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[
                            { required: true, message: 'Please enter product name' },
                            { min: 2, message: 'Name must be at least 2 characters' },
                            { max: 100, message: 'Name cannot exceed 100 characters' }
                        ]}
                    >
                        <Input
                            placeholder="Enter category name"
                            onChange={() => { }}
                        />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                        <Select
                            placeholder="Select status"
                            options={[
                                { label: 'Red', value: 'red' },
                                { label: 'Blue', value: 'blue' },
                                { label: 'Green', value: 'green' },
                                { label: 'Black', value: 'black' },
                                { label: 'White', value: 'white' },
                                { label: 'Yellow', value: 'yellow' },
                                { label: 'Purple', value: 'purple' },
                                { label: 'Orange', value: 'orange' }
                            ]}
                        />
                    </Form.Item>

                    <Row justify="end">
                        <Col>
                            <Space>
                                <Button size="medium" onClick={() => setShowTable(true)}>
                                    Back
                                </Button>
                                <Button
                                    type="primary"
                                    size="medium"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    Save
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            }
        </Modal>
    )
}

export default ProductCategoryModal;