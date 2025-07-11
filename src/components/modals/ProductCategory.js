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
    Card,
    InputNumber,
    Switch,
    Divider,
    TreeSelect
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    MoreOutlined,
    SaveOutlined,
    PlusOutlined,
    FolderOutlined,
    TagOutlined
} from '@ant-design/icons';
import { useAppDispatch } from "../../store/hooks";
import { productCategory } from "../../store/slices/product";

const { Title, Text } = Typography;
const { TextArea } = Input;

const generateSampleData = () => {
    const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive'];
    const statuses = ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'];

    return Array.from({ length: categories.length }, (_, index) => ({
        key: index + 1,
        id: index + 1,
        name: categories[index],
        code: categories[index].toUpperCase().replace(/\s+/g, '_'),
        description: `${categories[index]} category description`,
        parent_id: index > 2 ? Math.floor(Math.random() * 3) + 1 : null,
        sort_order: index * 10,
        is_active: Math.random() > 0.2,
        category: categories[index],
        quantity: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
};


const generateParentCategoryOptions = (categories) => {
    return categories
        .filter(cat => !cat.parent_id)
        .map(cat => ({
            title: cat.name,
            value: cat.id,
            key: cat.id,
            icon: <FolderOutlined />
        }));
};

const ProductCategoryModal = (props) => {
    let navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const { isModalOpen, setIsModalOpen } = props;
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [categories, setCategories] = useState([]);
    const [parentCategoryOptions, setParentCategoryOptions] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} categories`,
    });

    const loadCategories = async () => {
        // setLoading(true);
        // setTimeout(() => {
        //     const data = generateSampleData();
        //     setCategories(data);
        //     setFilteredCategories(data);
        //     setParentCategoryOptions(generateParentCategoryOptions(data));
        //     setPagination(prev => ({
        //         ...prev,
        //         total: data.length
        //     }));
        //     setLoading(false);
        // }, 1000);

        const result = await dispatch(productCategory());
        if (productCategory.fulfilled.match(result)) {
            let response = result.payload.data;
            console.log(response);
            setCategories(response.data);
            setFilteredCategories(response.data);
            setParentCategoryOptions(generateParentCategoryOptions(response.data));
            setPagination(prev => ({
                ...prev,
                total: response.total
            }));
        } else if (productCategory.rejected.match(result)) {
            console.log(result);
        }
    };

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setShowTable(true);
        form.resetFields();
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
        message.info(`Edit category: ${record.name}`);
        console.log(record.is_active === true ? "True" : "False");
        form.setFieldsValue({
            name: record.name,
            code: record.code,
            description: record.description,
            parent_id: record.parent_id,
            sort_order: record.sort_order,
            is_active: record.is_active === true || record.is_active === 1 || record.is_active === "true"
        });
        setShowTable(false);
    };

    const handleView = (record) => {
        message.info(`View category details: ${record.name}`);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            content: `Category: ${record.name} (${record.code})`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                const updatedCategories = categories.filter(category => category.key !== record.key);
                setCategories(updatedCategories);
                setFilteredCategories(updatedCategories);
                setPagination(prev => ({
                    ...prev,
                    total: updatedCategories.length
                }));
                message.success('Category deleted successfully');
            },
        });
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
            label: 'Edit Category',
            onClick: () => handleEdit(record)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Category',
            danger: true,
            onClick: () => handleDelete(record)
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            render: (name, record) => (
                <div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TagOutlined />
                        {name}
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Code: {record.code}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            render: (description) => (
                <Tooltip title={description}>
                    <div style={{
                        maxWidth: 180,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {description || '-'}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Parent Category',
            dataIndex: 'parent_id',
            key: 'parent_id',
            width: 130,
            render: (parentId) => {
                const parent = categories.find(cat => cat.id === parentId);
                return parent ? (
                    <Tag icon={<FolderOutlined />} color="blue">
                        {parent.name}
                    </Tag>
                ) : (
                    <Text type="secondary">Root Category</Text>
                );
            },
        },
        {
            title: 'Sort Order',
            dataIndex: 'sort_order',
            key: 'sort_order',
            width: 100,
            sorter: (a, b) => a.sort_order - b.sort_order,
            render: (order) => (
                <Tag color="purple">{order}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit Category">
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

    const onFinish = async (values) => {
        try {
            setLoading(true);
            setTimeout(() => {
                console.log('Form values:', values);
                message.success('Category saved successfully!');
                setLoading(false);
                form.resetFields();
                setShowTable(true);
                loadCategories();
            }, 1000);
        } catch (error) {
            setLoading(false);
            message.error(`Failed to save category. Please try again.`);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Please check the form for errors and try again.');
        console.log('Failed:', errorInfo);
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const code = name.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_');
        form.setFieldValue('code', code);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TagOutlined />
                    <span>Product Categories</span>
                </div>
            }
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={null}
            styles={{
                body: { padding: '24px' }
            }}
        >
            {showTable && (
                <>
                    <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Title level={4} style={{ margin: 0 }}>Category Management</Title>
                            <Text type="secondary">Manage your product categories and hierarchy</Text>
                        </div>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="medium"
                            onClick={() => {
                                form.resetFields();
                                setShowTable(false);
                            }}
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
                                `Showing ${range[0]}-${range[1]} of ${total} categories`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected categories:', selectedRows);
                            },
                        }}
                        scroll={{ x: 800 }}
                        style={{ marginBottom: '30px' }}
                    />
                </>
            )}

            {!showTable && (
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <PlusOutlined />
                            Create New Category
                        </Title>
                        <Text type="secondary">Add a new product category to organize your products</Text>
                    </div>

                    <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            scrollToFirstError
                            initialValues={{
                                is_active: true,
                                sort_order: 0
                            }}
                        >
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="name"
                                        label={
                                            <span style={{ fontWeight: 500 }}>
                                                Category Name <span style={{ color: '#ff4d4f' }}>*</span>
                                            </span>
                                        }
                                        rules={[
                                            { required: true, message: 'Please enter category name' },
                                            { min: 2, message: 'Name must be at least 2 characters' },
                                            { max: 100, message: 'Name cannot exceed 100 characters' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter category name (e.g., Electronics)"
                                            onChange={handleNameChange}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="code"
                                        label={
                                            <span style={{ fontWeight: 500 }}>
                                                Category Code <span style={{ color: '#ff4d4f' }}>*</span>
                                            </span>
                                        }
                                        rules={[
                                            { required: true, message: 'Please enter category code' },
                                            { min: 2, message: 'Code must be at least 2 characters' },
                                            { max: 20, message: 'Code cannot exceed 20 characters' },
                                            { pattern: /^[A-Z0-9_]+$/, message: 'Code must contain only uppercase letters, numbers, and underscores' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Category code (auto-generated)"
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label={<span style={{ fontWeight: 500 }}>Description</span>}
                                rules={[
                                    { max: 500, message: 'Description cannot exceed 500 characters' }
                                ]}
                            >
                                <TextArea
                                    placeholder="Enter category description (optional)"
                                    rows={3}
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="parent_id"
                                        label={<span style={{ fontWeight: 500 }}>Parent Category</span>}
                                    >
                                        <TreeSelect
                                            placeholder="Select parent category (optional)"
                                            allowClear
                                            treeData={parentCategoryOptions}
                                            size="large"
                                            dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="sort_order"
                                        label={<span style={{ fontWeight: 500 }}>Sort Order</span>}
                                        tooltip="Higher numbers appear later in the list"
                                    >
                                        <InputNumber
                                            placeholder="0"
                                            min={0}
                                            max={9999}
                                            style={{ width: '100%' }}
                                            size="large"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row gutter={[16, 0]} align="middle">
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="is_active"
                                        label={<span style={{ fontWeight: 500 }}>Status</span>}
                                        valuePropName="checked"
                                        normalize={(value) => Boolean(value)}
                                    >
                                        <Switch
                                            size="default"
                                            checkedChildren="Active"
                                            unCheckedChildren="Inactive"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Row justify="end">
                                <Col>
                                    <Space size="middle">
                                        <Button
                                            size="large"
                                            onClick={() => {
                                                setShowTable(true);
                                                form.resetFields();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="primary"
                                            size="large"
                                            htmlType="submit"
                                            loading={loading}
                                            icon={<SaveOutlined />}
                                            style={{ minWidth: 120 }}
                                        >
                                            Save Category
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            )}
        </Modal>
    );
};

export default ProductCategoryModal;