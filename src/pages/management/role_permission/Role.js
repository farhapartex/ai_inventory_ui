import React, { useState, useEffect } from 'react';
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
    Modal,
    Form,
    Select,
    Switch,
    Checkbox,
    Tree,
    Divider,
    Alert,
    Tooltip,
    Badge,
    Statistic,
    message,
    Drawer,
    Descriptions,
    Collapse
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CopyOutlined,
    CrownOutlined,
    SecurityScanOutlined,
    TeamOutlined,
    SettingOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import AppLayout from '../../../layouts/AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { confirm } = Modal;

const systemModules = {
    dashboard: {
        name: 'Dashboard',
        icon: '📊',
        permissions: ['view_dashboard', 'view_analytics', 'export_reports']
    },
    products: {
        name: 'Products',
        icon: '📦',
        permissions: ['view_products', 'create_products', 'edit_products', 'delete_products', 'manage_inventory', 'view_stock_alerts']
    },
    orders: {
        name: 'Orders',
        icon: '🛒',
        permissions: ['view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'process_orders', 'manage_shipping', 'view_order_analytics']
    },
    customers: {
        name: 'Customers',
        icon: '👥',
        permissions: ['view_customers', 'create_customers', 'edit_customers', 'delete_customers', 'view_customer_analytics', 'manage_customer_groups']
    },
    users: {
        name: 'User Management',
        icon: '👤',
        permissions: ['view_users', 'create_users', 'edit_users', 'delete_users', 'manage_roles', 'assign_permissions']
    },
    reports: {
        name: 'Reports & Analytics',
        icon: '📈',
        permissions: ['view_reports', 'create_reports', 'export_data', 'view_financial_reports', 'view_inventory_reports']
    },
    settings: {
        name: 'System Settings',
        icon: '⚙️',
        permissions: ['view_settings', 'edit_settings', 'manage_integrations', 'system_backup', 'audit_logs']
    }
};

// Generate sample roles data
const generateRoles = () => [
    {
        key: 1,
        id: 'role-001',
        name: 'Super Administrator',
        description: 'Full system access with all permissions',
        level: 5,
        color: 'red',
        isDefault: false,
        isSystem: true,
        userCount: 2,
        permissions: Object.values(systemModules).flatMap(module => module.permissions),
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        createdBy: 'System',
        status: 'Active'
    },
    {
        key: 2,
        id: 'role-002',
        name: 'Administrator',
        description: 'Administrative access excluding user management',
        level: 4,
        color: 'purple',
        isDefault: false,
        isSystem: true,
        userCount: 5,
        permissions: [
            'view_dashboard', 'view_analytics', 'export_reports',
            'view_products', 'create_products', 'edit_products', 'delete_products', 'manage_inventory', 'view_stock_alerts',
            'view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'process_orders', 'manage_shipping', 'view_order_analytics',
            'view_customers', 'create_customers', 'edit_customers', 'delete_customers', 'view_customer_analytics', 'manage_customer_groups',
            'view_reports', 'create_reports', 'export_data', 'view_financial_reports', 'view_inventory_reports',
            'view_settings', 'edit_settings'
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
        createdBy: 'System',
        status: 'Active'
    },
    {
        key: 3,
        id: 'role-003',
        name: 'Manager',
        description: 'Management level access to products, orders, and customers',
        level: 3,
        color: 'blue',
        isDefault: true,
        isSystem: false,
        userCount: 12,
        permissions: [
            'view_dashboard', 'view_analytics',
            'view_products', 'create_products', 'edit_products', 'manage_inventory', 'view_stock_alerts',
            'view_orders', 'create_orders', 'edit_orders', 'process_orders', 'view_order_analytics',
            'view_customers', 'create_customers', 'edit_customers', 'view_customer_analytics',
            'view_reports', 'view_financial_reports', 'view_inventory_reports'
        ],
        createdAt: '2024-01-05',
        updatedAt: '2024-02-10',
        createdBy: 'role-001',
        status: 'Active'
    },
    {
        key: 4,
        id: 'role-004',
        name: 'Warehouse Staff',
        description: 'Access to inventory and order processing',
        level: 2,
        color: 'green',
        isDefault: false,
        isSystem: false,
        userCount: 18,
        permissions: [
            'view_dashboard',
            'view_products', 'edit_products', 'manage_inventory', 'view_stock_alerts',
            'view_orders', 'edit_orders', 'process_orders'
        ],
        createdAt: '2024-01-10',
        updatedAt: '2024-02-05',
        createdBy: 'role-001',
        status: 'Active'
    },
    {
        key: 5,
        id: 'role-005',
        name: 'Sales Representative',
        description: 'Customer and order management access',
        level: 1,
        color: 'orange',
        isDefault: false,
        isSystem: false,
        userCount: 25,
        permissions: [
            'view_dashboard',
            'view_products',
            'view_orders', 'create_orders', 'edit_orders',
            'view_customers', 'create_customers', 'edit_customers'
        ],
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'role-002',
        status: 'Active'
    },
    {
        key: 6,
        id: 'role-006',
        name: 'Read Only User',
        description: 'View-only access to all modules',
        level: 0,
        color: 'default',
        isDefault: false,
        isSystem: false,
        userCount: 8,
        permissions: [
            'view_dashboard',
            'view_products',
            'view_orders',
            'view_customers',
            'view_reports'
        ],
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01',
        createdBy: 'role-001',
        status: 'Active'
    }
];

const RolesPermissionsPage = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [roleDetailsVisible, setRoleDetailsVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [form] = Form.useForm();

    const [stats, setStats] = useState({
        totalRoles: 0,
        activeRoles: 0,
        totalUsers: 0,
        systemRoles: 0
    });

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateRoles();
            setRoles(data);

            // Calculate statistics
            const totalUsers = data.reduce((sum, role) => sum + role.userCount, 0);
            const activeRoles = data.filter(role => role.status === 'Active').length;
            const systemRoles = data.filter(role => role.isSystem).length;

            setStats({
                totalRoles: data.length,
                activeRoles,
                totalUsers,
                systemRoles
            });

            setLoading(false);
        }, 1000);
    };

    const handleCreateRole = () => {
        setEditingRole(null);
        form.resetFields();
        form.setFieldsValue({
            status: 'Active',
            level: 1,
            permissions: []
        });
        setRoleModalVisible(true);
    };

    const handleEditRole = (role) => {
        setEditingRole(role);
        form.setFieldsValue({
            name: role.name,
            description: role.description,
            level: role.level,
            color: role.color,
            permissions: role.permissions,
            status: role.status,
            isDefault: role.isDefault
        });
        setRoleModalVisible(true);
    };

    const handleDuplicateRole = (role) => {
        setEditingRole(null);
        form.setFieldsValue({
            name: `${role.name} (Copy)`,
            description: `Copy of ${role.description}`,
            level: role.level,
            color: role.color,
            permissions: role.permissions,
            status: 'Active',
            isDefault: false
        });
        setRoleModalVisible(true);
    };

    const handleDeleteRole = (role) => {
        if (role.isSystem) {
            message.error('System roles cannot be deleted');
            return;
        }

        if (role.userCount > 0) {
            message.error(`Cannot delete role. ${role.userCount} users are assigned to this role.`);
            return;
        }

        confirm({
            title: 'Are you sure you want to delete this role?',
            icon: <ExclamationCircleOutlined />,
            content: `Role: ${role.name}`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                const updatedRoles = roles.filter(r => r.key !== role.key);
                setRoles(updatedRoles);
                message.success('Role deleted successfully');
            },
        });
    };

    const handleSaveRole = async (values) => {
        try {
            if (editingRole) {
                const updatedRoles = roles.map(role =>
                    role.key === editingRole.key
                        ? {
                            ...role,
                            ...values,
                            updatedAt: new Date().toISOString().split('T')[0]
                        }
                        : role
                );
                setRoles(updatedRoles);
                message.success('Role updated successfully');
            } else {
                const newRole = {
                    key: Math.max(...roles.map(r => r.key)) + 1,
                    id: `role-${String(Math.max(...roles.map(r => r.key)) + 1).padStart(3, '0')}`,
                    ...values,
                    userCount: 0,
                    isSystem: false,
                    createdAt: new Date().toISOString().split('T')[0],
                    updatedAt: new Date().toISOString().split('T')[0],
                    createdBy: 'current-user'
                };
                setRoles([...roles, newRole]);
                message.success('Role created successfully');
            }

            setRoleModalVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Failed to save role');
        }
    };

    const handleViewRole = (role) => {
        setSelectedRole(role);
        setRoleDetailsVisible(true);
    };

    const getPermissionsByModule = (permissions) => {
        const result = {};
        Object.entries(systemModules).forEach(([moduleKey, module]) => {
            result[moduleKey] = {
                ...module,
                userPermissions: permissions.filter(p => module.permissions.includes(p)),
                hasAccess: permissions.some(p => module.permissions.includes(p))
            };
        });
        return result;
    };

    const renderPermissionTree = () => {
        const treeData = Object.entries(systemModules).map(([moduleKey, module]) => ({
            title: `${module.icon} ${module.name}`,
            key: moduleKey,
            children: module.permissions.map(permission => ({
                title: permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                key: permission
            }))
        }));

        return (
            <Form.Item
                name="permissions"
                label="Permissions"
                rules={[{ required: true, message: 'Please select at least one permission' }]}
            >
                <Tree
                    checkable
                    treeData={treeData}
                    style={{ border: '1px solid #d9d9d9', borderRadius: '6px', padding: '8px', maxHeight: '300px', overflow: 'auto' }}
                />
            </Form.Item>
        );
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchText.toLowerCase()) ||
        role.description.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Role Information',
            key: 'roleInfo',
            width: 300,
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: record.color === 'default' ? '#d9d9d9' :
                            record.color === 'red' ? '#ff4d4f' :
                                record.color === 'purple' ? '#722ed1' :
                                    record.color === 'blue' ? '#1890ff' :
                                        record.color === 'green' ? '#52c41a' :
                                            record.color === 'orange' ? '#fa8c16' : '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        {record.level}
                    </div>
                    <div>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>
                            <Button type="link" onClick={() => handleViewRole(record)} style={{ padding: 0, height: 'auto' }}>
                                {record.name}
                            </Button>
                            {record.isSystem && (
                                <Tag color="red" size="small" style={{ marginLeft: 8 }}>System</Tag>
                            )}
                            {record.isDefault && (
                                <Tag color="blue" size="small" style={{ marginLeft: 4 }}>Default</Tag>
                            )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.description}
                        </div>
                        <div style={{ fontSize: '11px', color: '#999', marginTop: 2 }}>
                            ID: {record.id}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            width: 80,
            render: (level) => (
                <Badge count={level} color="blue" />
            ),
            sorter: (a, b) => a.level - b.level,
        },
        {
            title: 'Users',
            dataIndex: 'userCount',
            key: 'userCount',
            width: 80,
            render: (count) => (
                <Badge count={count} color="green" />
            ),
            sorter: (a, b) => a.userCount - b.userCount,
        },
        {
            title: 'Permissions',
            key: 'permissions',
            width: 200,
            render: (_, record) => {
                const moduleAccess = getPermissionsByModule(record.permissions);
                const accessCount = Object.values(moduleAccess).filter(m => m.hasAccess).length;

                return (
                    <div>
                        <div style={{ marginBottom: 4 }}>
                            <Text strong>{accessCount}/{Object.keys(systemModules).length} Modules</Text>
                        </div>
                        <div>
                            {Object.entries(moduleAccess).slice(0, 3).map(([key, module]) => (
                                module.hasAccess && (
                                    <Tag key={key} color="blue" size="small" style={{ marginBottom: 2 }}>
                                        {module.name}
                                    </Tag>
                                )
                            ))}
                            {accessCount > 3 && (
                                <Tag color="default" size="small">+{accessCount - 3} more</Tag>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => (
                <Tag color={status === 'Active' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 100,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewRole(record)} />
                    </Tooltip>
                    <Tooltip title="Edit Role">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditRole(record)}
                            disabled={record.isSystem}
                        />
                    </Tooltip>
                    <Tooltip title="Duplicate Role">
                        <Button type="text" icon={<CopyOutlined />} onClick={() => handleDuplicateRole(record)} />
                    </Tooltip>
                    <Tooltip title="Delete Role">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteRole(record)}
                            disabled={record.isSystem || record.userCount > 0}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout>
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>Roles & Permissions</Title>
                    <Text type="secondary">
                        Define user roles and manage system access permissions
                    </Text>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Roles"
                                value={stats.totalRoles}
                                prefix={<CrownOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Active Roles"
                                value={stats.activeRoles}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Total Users"
                                value={stats.totalUsers}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="System Roles"
                                value={stats.systemRoles}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<SecurityScanOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Actions Bar */}
                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]} justify="space-between" align="middle">
                        <Col xs={24} md={12}>
                            <Search
                                placeholder="Search roles by name or description..."
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                            <Space>
                                <Button icon={<SettingOutlined />}>
                                    Permission Templates
                                </Button>
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRole}>
                                    Create Role
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredRoles}
                        loading={loading}
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} roles`,
                        }}
                        scroll={{ x: 1200 }}
                    />
                </Card>

                <Modal
                    title={editingRole ? 'Edit Role' : 'Create New Role'}
                    open={roleModalVisible}
                    onCancel={() => setRoleModalVisible(false)}
                    footer={null}
                    width={800}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSaveRole}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Role Name"
                                    rules={[{ required: true, message: 'Please enter role name' }]}
                                >
                                    <Input placeholder="Enter role name" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="level"
                                    label="Role Level"
                                    rules={[{ required: true, message: 'Please select role level' }]}
                                >
                                    <Select placeholder="Select level">
                                        <Option value={0}>Level 0 - Read Only</Option>
                                        <Option value={1}>Level 1 - Basic User</Option>
                                        <Option value={2}>Level 2 - Staff</Option>
                                        <Option value={3}>Level 3 - Manager</Option>
                                        <Option value={4}>Level 4 - Administrator</Option>
                                        <Option value={5}>Level 5 - Super Admin</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter role description' }]}
                        >
                            <Input.TextArea
                                placeholder="Describe this role's purpose and responsibilities"
                                rows={3}
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="color"
                                    label="Role Color"
                                    rules={[{ required: true, message: 'Please select a color' }]}
                                >
                                    <Select placeholder="Select color">
                                        <Option value="red">Red</Option>
                                        <Option value="purple">Purple</Option>
                                        <Option value="blue">Blue</Option>
                                        <Option value="green">Green</Option>
                                        <Option value="orange">Orange</Option>
                                        <Option value="default">Gray</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select placeholder="Select status">
                                        <Option value="Active">Active</Option>
                                        <Option value="Inactive">Inactive</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {!editingRole?.isSystem && (
                            <Form.Item name="isDefault" valuePropName="checked">
                                <Checkbox>Set as default role for new users</Checkbox>
                            </Form.Item>
                        )}

                        <Divider />

                        {renderPermissionTree()}

                        <div style={{ textAlign: 'right', marginTop: 24 }}>
                            <Space>
                                <Button onClick={() => setRoleModalVisible(false)}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {editingRole ? 'Update Role' : 'Create Role'}
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Modal>

                <Drawer
                    title={`Role Details - ${selectedRole?.name}`}
                    width={600}
                    open={roleDetailsVisible}
                    onClose={() => setRoleDetailsVisible(false)}
                    extra={
                        <Space>
                            <Button onClick={() => handleDuplicateRole(selectedRole)} icon={<CopyOutlined />}>
                                Duplicate
                            </Button>
                            {!selectedRole?.isSystem && (
                                <Button onClick={() => handleEditRole(selectedRole)} icon={<EditOutlined />} type="primary">
                                    Edit Role
                                </Button>
                            )}
                        </Space>
                    }
                >
                    {selectedRole && (
                        <div>
                            <Card size="small" style={{ marginBottom: 16 }}>
                                <Row align="middle">
                                    <Col>
                                        <div style={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            backgroundColor: selectedRole.color === 'default' ? '#d9d9d9' :
                                                selectedRole.color === 'red' ? '#ff4d4f' :
                                                    selectedRole.color === 'purple' ? '#722ed1' :
                                                        selectedRole.color === 'blue' ? '#1890ff' :
                                                            selectedRole.color === 'green' ? '#52c41a' :
                                                                selectedRole.color === 'orange' ? '#fa8c16' : '#d9d9d9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            marginRight: 16
                                        }}>
                                            {selectedRole.level}
                                        </div>
                                    </Col>
                                    <Col flex={1}>
                                        <Title level={4} style={{ margin: 0 }}>{selectedRole.name}</Title>
                                        <Text type="secondary">{selectedRole.description}</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Tag color={selectedRole.status === 'Active' ? 'green' : 'red'}>
                                                {selectedRole.status}
                                            </Tag>
                                            {selectedRole.isSystem && <Tag color="red">System Role</Tag>}
                                            {selectedRole.isDefault && <Tag color="blue">Default Role</Tag>}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            <Card title="Role Information" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Role ID">{selectedRole.id}</Descriptions.Item>
                                    <Descriptions.Item label="Level">Level {selectedRole.level}</Descriptions.Item>
                                    <Descriptions.Item label="Users Assigned">{selectedRole.userCount}</Descriptions.Item>
                                    <Descriptions.Item label="Created Date">{selectedRole.createdAt}</Descriptions.Item>
                                    <Descriptions.Item label="Last Updated">{selectedRole.updatedAt}</Descriptions.Item>
                                    <Descriptions.Item label="Created By">{selectedRole.createdBy}</Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card title="Permissions Breakdown" size="small">
                                <Collapse size="small">
                                    {Object.entries(getPermissionsByModule(selectedRole.permissions)).map(([moduleKey, module]) => (
                                        <Panel
                                            header={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{module.icon} {module.name}</span>
                                                    <Tag color={module.hasAccess ? 'green' : 'red'} size="small">
                                                        {module.userPermissions.length}/{module.permissions.length}
                                                    </Tag>
                                                </div>
                                            }
                                            key={moduleKey}
                                        >
                                            <div>
                                                {module.permissions.map(permission => (
                                                    <div key={permission} style={{ marginBottom: 4 }}>
                                                        {module.userPermissions.includes(permission) ? (
                                                            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                                        ) : (
                                                            <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                                                        )}
                                                        <Text type={module.userPermissions.includes(permission) ? 'default' : 'secondary'}>
                                                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </Text>
                                                    </div>
                                                ))}
                                            </div>
                                        </Panel>
                                    ))}
                                </Collapse>
                            </Card>

                            <Card title="Security Information" size="small" style={{ marginTop: 16 }}>
                                <Alert
                                    message="Role Security Level"
                                    description={`This role has Level ${selectedRole.level} access. ${selectedRole.level >= 4 ? 'High-level administrative privileges.' :
                                        selectedRole.level >= 2 ? 'Standard operational access.' :
                                            'Limited access permissions.'
                                        }`}
                                    type={selectedRole.level >= 4 ? 'warning' : selectedRole.level >= 2 ? 'info' : 'success'}
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />

                                {selectedRole.isSystem && (
                                    <Alert
                                        message="System Role"
                                        description="This is a system-defined role and cannot be modified or deleted."
                                        type="info"
                                        showIcon
                                        style={{ marginBottom: 16 }}
                                    />
                                )}

                                {selectedRole.userCount > 0 && (
                                    <Alert
                                        message={`${selectedRole.userCount} Users Assigned`}
                                        description="Changes to this role will affect all assigned users immediately."
                                        type="warning"
                                        showIcon
                                    />
                                )}
                            </Card>
                        </div>
                    )}
                </Drawer>
            </div>
        </AppLayout>
    );
};

export default RolesPermissionsPage;