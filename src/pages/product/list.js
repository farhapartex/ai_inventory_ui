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
    message
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
    ExportOutlined
} from '@ant-design/icons';
import AppLayout from '../../layouts/AppLayout';
import ProductCategoryModal from '../../components/modals/ProductCategory';

const { Title } = Typography;
const { Search } = Input;
const { confirm } = Modal;

// Sample product data
const generateSampleData = () => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'];
    const brands = ['Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'Canon', 'Dell'];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'];

    return Array.from({ length: 150 }, (_, index) => ({
        key: index + 1,
        id: `PRD-${String(index + 1).padStart(4, '0')}`,
        name: `Product ${index + 1}`,
        sku: `SKU${String(index + 1).padStart(6, '0')}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        brand: brands[Math.floor(Math.random() * brands.length)],
        price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
        cost: parseFloat((Math.random() * 500 + 5).toFixed(2)),
        quantity: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: `This is a sample description for Product ${index + 1}. It includes key features and specifications.`,
        image: `https://picsum.photos/100/100?random=${index + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        supplier: `Supplier ${Math.floor(Math.random() * 20) + 1}`,
        weight: parseFloat((Math.random() * 10 + 0.1).toFixed(2)),
        dimensions: `${Math.floor(Math.random() * 50 + 10)} x ${Math.floor(Math.random() * 50 + 10)} x ${Math.floor(Math.random() * 50 + 10)} cm`
    }));
};

const ProductListPage = () => {
    let navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} products`,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        if (!searchText) {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
                product.category.toLowerCase().includes(searchText.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchText.toLowerCase()) ||
                product.id.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchText, products]);

    const loadProducts = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const data = generateSampleData();
            setProducts(data);
            setFilteredProducts(data);
            setPagination(prev => ({
                ...prev,
                total: data.length
            }));
            setLoading(false);
        }, 1000);
    };

    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({
            ...prev,
            current: 1 // Reset to first page when searching
        }));
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleEdit = (record) => {
        message.info(`Edit product: ${record.name}`);
    };

    const handleView = (record) => {
        message.info(`View product details: ${record.name}`);
        // Navigate to product details page
    };

    const handleDelete = (record) => {
        confirm({
            title: 'Are you sure you want to delete this product?',
            icon: <ExclamationCircleOutlined />,
            content: `Product: ${record.name} (${record.sku})`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                // Simulate delete
                const updatedProducts = products.filter(product => product.key !== record.key);
                setProducts(updatedProducts);
                setFilteredProducts(updatedProducts);
                setPagination(prev => ({
                    ...prev,
                    total: updatedProducts.length
                }));
                message.success('Product deleted successfully');
            },
        });
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
            title: 'Product',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            fixed: 'left',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={record.image}
                        size={40}
                        style={{ marginRight: 12, flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>{text}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>SKU: {record.sku}</div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
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
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            width: 120,
            sorter: (a, b) => a.brand.localeCompare(b.brand),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            render: (price) => `$${price.toFixed(2)}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            width: 100,
            render: (cost) => `$${cost.toFixed(2)}`,
            sorter: (a, b) => a.cost - b.cost,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            render: (quantity) => {
                const status = getQuantityStatus(quantity);
                return (
                    <div>
                        <div style={{ fontWeight: 500 }}>{quantity}</div>
                        <Tag color={status.color} size="small">{status.text}</Tag>
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
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            width: 130,
            sorter: (a, b) => a.supplier.localeCompare(b.supplier),
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
                            onClick={() => handleEdit(record)}
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
                <div style={{ marginBottom: 24, float: 'right' }}>
                    <Button
                        type="primary"
                        icon={null}
                        size="large"
                        onClick={() => setIsModalOpen(true)}
                        style={{ minWidth: 140 }}
                    >
                        Product Category
                    </Button>
                    <Button
                        type="primary"
                        icon={null}
                        size="large"
                        onClick={() => navigate("/products/new")}
                        style={{ minWidth: 140, marginLeft: '10px' }}
                    >
                        Suppliers
                    </Button>
                </div>
                <div style={{ marginBottom: 24, }}>
                    <Title level={2} style={{ margin: 0 }}>Products</Title>
                    <p style={{ color: '#666', marginTop: 8 }}>
                        Manage your product inventory and track stock levels
                    </p>
                </div>

                <ProductCategoryModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={16} lg={18} xl={20}>
                        <Search
                            placeholder="Search products by name, SKU, category, brand, or ID..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="large"
                            onSearch={handleSearch}
                            onChange={(e) => !e.target.value && handleSearch('')}
                            style={{ width: '100%' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Tooltip title="Export Products">
                                <Button icon={<ExportOutlined />} />
                            </Tooltip>
                            <Tooltip title="Filter Products">
                                <Button icon={<FilterOutlined />} />
                            </Tooltip>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={() => navigate("/products/new")}
                                style={{ minWidth: 140 }}
                            >
                                New Product
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        pagination={{
                            ...pagination,
                            total: filteredProducts.length,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} products`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        // scroll={{ x: 1500, y: 650 }}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected products:', selectedRows);
                            },
                        }}
                    />
                </Card>
            </div>
        </AppLayout>

    );
};

export default ProductListPage;