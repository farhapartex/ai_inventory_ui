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
    Switch,
    Alert,
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
    TeamOutlined,
    CrownOutlined,
    SafetyCertificateOutlined,
    KeyOutlined,
    LockOutlined,
    UnlockOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    StopOutlined
} from '@ant-design/icons';
import AppLayout from '../../../layouts/AppLayout';

const { Title, Text } = Typography;
const { Search } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

const generateSystemUsers = () => {
    const roles = [
        { name: 'Super Admin', level: 5, color: 'red', permissions: ['all'] },
        { name: 'Admin', level: 4, color: 'purple', permissions: ['users', 'products', 'orders', 'customers', 'reports'] },
        { name: 'Manager', level: 3, color: 'blue', permissions: ['products', 'orders', 'customers', 'reports'] },
        { name: 'Warehouse Staff', level: 2, color: 'green', permissions: ['products', 'orders'] },
        { name: 'Sales Rep', level: 1, color: 'orange', permissions: ['customers', 'orders'] }
    ];

    const departments = ['Administration', 'Sales', 'Warehouse', 'Customer Service', 'IT', 'Finance'];
    const statuses = ['Active', 'Inactive', 'Suspended', 'Pending'];

    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jennifer', 'James', 'Mary', 'Christopher', 'Patricia', 'Daniel', 'Linda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson'];

    return Array.from({ length: 85 }, (_, index) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const joinDate = new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000); // Last 3 years
        const lastLogin = Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;

        return {
            key: index + 1,
            userId: `USR-${String(index + 1).padStart(4, '0')}`,
            employeeId: `EMP-${String(index + 1001).padStart(4, '0')}`,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
            phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
            role: role.name,
            roleLevel: role.level,
            roleColor: role.color,
            permissions: role.permissions,
            department,
            status,
            joinDate: joinDate.toISOString().split('T')[0],
            lastLogin: lastLogin ? lastLogin.toISOString().split('T')[0] : null,
            lastLoginTime: lastLogin ? lastLogin.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
            loginCount: Math.floor(Math.random() * 500) + 10,
            avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${index + 1}.jpg`,
            isOnline: Math.random() > 0.7,
            twoFactorEnabled: Math.random() > 0.4,
            passwordLastChanged: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            accountLocked: Math.random() > 0.95,
            failedLoginAttempts: Math.floor(Math.random() * 3),
            notes: Math.random() > 0.8 ? 'Special access requirements' : '',
            createdBy: index === 0 ? 'System' : `USR-${String(Math.floor(Math.random() * index) + 1).padStart(4, '0')}`,
            manager: index > 5 ? `USR-${String(Math.floor(Math.random() * 5) + 1).padStart(4, '0')}` : null,
            workLocation: ['Main Office', 'Warehouse', 'Remote', 'Branch Office'][Math.floor(Math.random() * 4)],
            contractType: ['Full-time', 'Part-time', 'Contract', 'Intern'][Math.floor(Math.random() * 4)]
        };
    });
};

const SystemUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [dateRange, setDateRange] = useState([]);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
    });

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        onlineUsers: 0,
        suspendedUsers: 0
    });

    useEffect(() => {
        loadSystemUsers();
    }, []);

    useEffect(() => {
        let filtered = users;

        // Text search
        if (searchText) {
            filtered = filtered.filter(user =>
                user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                user.userId.toLowerCase().includes(searchText.toLowerCase()) ||
                user.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
                user.department.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Role filter
        if (selectedRole !== 'all') {
            filtered = filtered.filter(user => user.role === selectedRole);
        }

        // Status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(user => user.status === selectedStatus);
        }

        // Department filter
        if (selectedDepartment !== 'all') {
            filtered = filtered.filter(user => user.department === selectedDepartment);
        }

        // Date range filter (join date)
        if (dateRange.length === 2) {
            const [startDate, endDate] = dateRange;
            filtered = filtered.filter(user => {
                const joinDate = new Date(user.joinDate);
                return joinDate >= startDate && joinDate <= endDate;
            });
        }

        setFilteredUsers(filtered);
        setPagination(prev => ({ ...prev, total: filtered.length, current: 1 }));
    }, [searchText, selectedRole, selectedStatus, selectedDepartment, dateRange, users]);

    const loadSystemUsers = () => {
        setLoading(true);
        setTimeout(() => {
            const data = generateSystemUsers();
            setUsers(data);
            setFilteredUsers(data);

            // Calculate statistics
            const activeUsers = data.filter(user => user.status === 'Active').length;
            const onlineUsers = data.filter(user => user.isOnline).length;
            const suspendedUsers = data.filter(user => user.status === 'Suspended').length;

            setStats({
                totalUsers: data.length,
                activeUsers,
                onlineUsers,
                suspendedUsers
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

    const handleViewUser = (record) => {
        setSelectedUser(record);
        setUserDetailsVisible(true);
    };

    const handleEditUser = (record) => {
        message.info(`Edit user: ${record.fullName}`);
    };

    const handleDeleteUser = (record) => {
        confirm({
            title: 'Are you sure you want to delete this user?',
            icon: <ExclamationCircleOutlined />,
            content: `User: ${record.fullName} (${record.userId})`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                const updatedUsers = users.filter(user => user.key !== record.key);
                setUsers(updatedUsers);
                message.success('User deleted successfully');
            },
        });
    };

    const handleToggleStatus = (record) => {
        const newStatus = record.status === 'Active' ? 'Inactive' : 'Active';
        const updatedUsers = users.map(user =>
            user.key === record.key ? { ...user, status: newStatus } : user
        );
        setUsers(updatedUsers);
        message.success(`User ${newStatus.toLowerCase()} successfully`);
    };

    const handleLockUnlockAccount = (record) => {
        const newLockStatus = !record.accountLocked;
        const updatedUsers = users.map(user =>
            user.key === record.key ? { ...user, accountLocked: newLockStatus } : user
        );
        setUsers(updatedUsers);
        message.success(`Account ${newLockStatus ? 'locked' : 'unlocked'} successfully`);
    };

    const handleResetPassword = (record) => {
        message.info(`Password reset email sent to: ${record.email}`);
    };

    const getRoleColor = (role) => {
        const roleColors = {
            'Super Admin': 'red',
            'Admin': 'purple',
            'Manager': 'blue',
            'Warehouse Staff': 'green',
            'Sales Rep': 'orange'
        };
        return roleColors[role] || 'default';
    };

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'green',
            'Inactive': 'orange',
            'Suspended': 'red',
            'Pending': 'blue'
        };
        return colors[status] || 'default';
    };

    const actionMenuItems = (record) => [
        {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => handleViewUser(record)
        },
        {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit User',
            onClick: () => handleEditUser(record)
        },
        {
            key: 'toggle-status',
            icon: record.status === 'Active' ? <StopOutlined /> : <CheckCircleOutlined />,
            label: record.status === 'Active' ? 'Deactivate' : 'Activate',
            onClick: () => handleToggleStatus(record)
        },
        {
            key: 'lock-unlock',
            icon: record.accountLocked ? <UnlockOutlined /> : <LockOutlined />,
            label: record.accountLocked ? 'Unlock Account' : 'Lock Account',
            onClick: () => handleLockUnlockAccount(record)
        },
        {
            key: 'reset-password',
            icon: <KeyOutlined />,
            label: 'Reset Password',
            onClick: () => handleResetPassword(record)
        },
        {
            type: 'divider',
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete User',
            danger: true,
            onClick: () => handleDeleteUser(record)
        },
    ];

    const columns = [
        {
            title: 'User',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            fixed: 'left',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge dot={record.isOnline} color="green" offset={[-5, 5]}>
                        <Avatar
                            src={record.avatar}
                            size={40}
                            style={{ marginRight: 12, flexShrink: 0 }}
                        />
                    </Badge>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 500, marginBottom: 2 }}>
                            <Button type="link" onClick={() => handleViewUser(record)} style={{ padding: 0, height: 'auto' }}>
                                {text}
                            </Button>
                            {record.accountLocked && (
                                <LockOutlined style={{ marginLeft: 4, color: '#ff4d4f' }} />
                            )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.userId} • {record.employeeId}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {record.email}
                        </div>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: 140,
            render: (role, record) => (
                <div>
                    <Tag color={getRoleColor(role)} icon={<CrownOutlined />}>
                        {role}
                    </Tag>
                    {record.twoFactorEnabled && (
                        <div style={{ marginTop: 4 }}>
                            <Tag color="cyan" size="small" icon={<SafetyCertificateOutlined />}>
                                2FA
                            </Tag>
                        </div>
                    )}
                </div>
            ),
            filters: [
                { text: 'Super Admin', value: 'Super Admin' },
                { text: 'Admin', value: 'Admin' },
                { text: 'Manager', value: 'Manager' },
                { text: 'Warehouse Staff', value: 'Warehouse Staff' },
                { text: 'Sales Rep', value: 'Sales Rep' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            width: 120,
            filters: [
                { text: 'Administration', value: 'Administration' },
                { text: 'Sales', value: 'Sales' },
                { text: 'Warehouse', value: 'Warehouse' },
                { text: 'Customer Service', value: 'Customer Service' },
                { text: 'IT', value: 'IT' },
                { text: 'Finance', value: 'Finance' },
            ],
            onFilter: (value, record) => record.department === value,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status, record) => (
                <div>
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                    {record.isOnline && (
                        <div style={{ fontSize: '11px', color: '#52c41a', marginTop: 2 }}>
                            • Online
                        </div>
                    )}
                </div>
            ),
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Inactive', value: 'Inactive' },
                { text: 'Suspended', value: 'Suspended' },
                { text: 'Pending', value: 'Pending' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 180,
            render: (_, record) => (
                <div style={{ fontSize: '12px' }}>
                    <div style={{ marginBottom: 2 }}>
                        <MailOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.email}
                    </div>
                    <div>
                        <PhoneOutlined style={{ marginRight: 4, color: '#666' }} />
                        {record.phone}
                    </div>
                </div>
            ),
        },
        {
            title: 'Join Date',
            dataIndex: 'joinDate',
            key: 'joinDate',
            width: 110,
            sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
        },
        {
            title: 'Last Login',
            key: 'lastLogin',
            width: 120,
            render: (_, record) => {
                if (!record.lastLogin) return <Text type="secondary">Never</Text>;

                const daysSinceLogin = Math.floor((new Date() - new Date(record.lastLogin)) / (1000 * 60 * 60 * 24));
                return (
                    <div style={{ fontSize: '12px' }}>
                        <div>{record.lastLogin}</div>
                        <div style={{ color: daysSinceLogin > 7 ? '#ff4d4f' : '#666' }}>
                            {daysSinceLogin === 0 ? 'Today' : `${daysSinceLogin}d ago`}
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => {
                if (!a.lastLogin && !b.lastLogin) return 0;
                if (!a.lastLogin) return 1;
                if (!b.lastLogin) return -1;
                return new Date(a.lastLogin) - new Date(b.lastLogin);
            },
        },
        {
            title: 'Login Count',
            dataIndex: 'loginCount',
            key: 'loginCount',
            width: 100,
            render: (count) => <Badge count={count} color="blue" />,
            sorter: (a, b) => a.loginCount - b.loginCount,
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
                            onClick={() => handleViewUser(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit User">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditUser(record)}
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
                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={2} style={{ margin: 0 }}>System Users</Title>
                    <Text type="secondary">
                        Manage system access, roles, and permissions for inventory system users
                    </Text>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
                                title="Active Users"
                                value={stats.activeUsers}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Online Now"
                                value={stats.onlineUsers}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card>
                            <Statistic
                                title="Suspended"
                                value={stats.suspendedUsers}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<StopOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Filters and Actions */}
                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                            <Search
                                placeholder="Search by name, email, ID, or department..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                onSearch={handleSearch}
                                onChange={(e) => !e.target.value && handleSearch('')}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Select
                                placeholder="Role"
                                style={{ width: '100%' }}
                                value={selectedRole}
                                onChange={setSelectedRole}
                            >
                                <Option value="all">All Roles</Option>
                                <Option value="Super Admin">Super Admin</Option>
                                <Option value="Admin">Admin</Option>
                                <Option value="Manager">Manager</Option>
                                <Option value="Warehouse Staff">Warehouse Staff</Option>
                                <Option value="Sales Rep">Sales Rep</Option>
                            </Select>
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
                                <Option value="Pending">Pending</Option>
                            </Select>
                        </Col>
                        <Col xs={12} md={3}>
                            <Select
                                placeholder="Department"
                                style={{ width: '100%' }}
                                value={selectedDepartment}
                                onChange={setSelectedDepartment}
                            >
                                <Option value="all">All Departments</Option>
                                <Option value="Administration">Administration</Option>
                                <Option value="Sales">Sales</Option>
                                <Option value="Warehouse">Warehouse</Option>
                                <Option value="Customer Service">Customer Service</Option>
                                <Option value="IT">IT</Option>
                                <Option value="Finance">Finance</Option>
                            </Select>
                        </Col>
                        <Col xs={24} md={5}>
                            <RangePicker
                                style={{ width: '100%' }}
                                onChange={setDateRange}
                                placeholder={['Join Date From', 'Join Date To']}
                            />
                        </Col>
                        <Col xs={24} md={4}>
                            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                                <Tooltip title="Export Users">
                                    <Button icon={<ExportOutlined />} />
                                </Tooltip>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => message.info('Navigate to Add User page')}
                                >
                                    Add User
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Users Table */}
                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredUsers}
                        pagination={{
                            ...pagination,
                            total: filteredUsers.length,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `Showing ${range[0]}-${range[1]} of ${total} users`,
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        size="middle"
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log('Selected users:', selectedRows);
                            },
                        }}
                    />
                </Card>

                <Drawer
                    title={`User Details - ${selectedUser?.fullName}`}
                    width={600}
                    open={userDetailsVisible}
                    onClose={() => setUserDetailsVisible(false)}
                    extra={
                        <Space>
                            <Button onClick={() => handleResetPassword(selectedUser)} icon={<KeyOutlined />}>
                                Reset Password
                            </Button>
                            <Button onClick={() => handleEditUser(selectedUser)} icon={<EditOutlined />} type="primary">
                                Edit User
                            </Button>
                        </Space>
                    }
                >
                    {selectedUser && (
                        <div>
                            {/* User Status Alert */}
                            {selectedUser.accountLocked && (
                                <Alert
                                    message="Account Locked"
                                    description="This account has been locked due to security reasons."
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                    action={
                                        <Button size="small" onClick={() => handleLockUnlockAccount(selectedUser)}>
                                            Unlock
                                        </Button>
                                    }
                                />
                            )}

                            {/* User Overview */}
                            <Card size="small" style={{ marginBottom: 16 }}>
                                <Row gutter={16} align="middle">
                                    <Col>
                                        <Badge dot={selectedUser.isOnline} color="green">
                                            <Avatar src={selectedUser.avatar} size={64} />
                                        </Badge>
                                    </Col>
                                    <Col flex={1}>
                                        <Title level={4} style={{ margin: 0 }}>{selectedUser.fullName}</Title>
                                        <Text type="secondary">{selectedUser.email}</Text>
                                        <div style={{ marginTop: 8 }}>
                                            <Tag color={getRoleColor(selectedUser.role)}>{selectedUser.role}</Tag>
                                            <Tag color={getStatusColor(selectedUser.status)}>{selectedUser.status}</Tag>
                                            {selectedUser.isOnline && <Tag color="green">Online</Tag>}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Basic Information */}
                            <Card title="Basic Information" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="User ID">{selectedUser.userId}</Descriptions.Item>
                                    <Descriptions.Item label="Employee ID">{selectedUser.employeeId}</Descriptions.Item>
                                    <Descriptions.Item label="Department">{selectedUser.department}</Descriptions.Item>
                                    <Descriptions.Item label="Work Location">{selectedUser.workLocation}</Descriptions.Item>
                                    <Descriptions.Item label="Contract Type">{selectedUser.contractType}</Descriptions.Item>
                                    <Descriptions.Item label="Phone">{selectedUser.phone}</Descriptions.Item>
                                    <Descriptions.Item label="Join Date">{selectedUser.joinDate}</Descriptions.Item>
                                    {selectedUser.manager && (
                                        <Descriptions.Item label="Manager">{selectedUser.manager}</Descriptions.Item>
                                    )}
                                </Descriptions>
                            </Card>

                            {/* Access Information */}
                            <Card title="Access Information" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Role Level">Level {selectedUser.roleLevel}</Descriptions.Item>
                                    <Descriptions.Item label="Permissions">
                                        <div>
                                            {selectedUser.permissions.map(permission => (
                                                <Tag key={permission} color="blue" style={{ marginBottom: 4 }}>
                                                    {permission}
                                                </Tag>
                                            ))}
                                        </div>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Two-Factor Auth">
                                        <Switch checked={selectedUser.twoFactorEnabled} disabled />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Account Locked">
                                        <Switch checked={selectedUser.accountLocked} disabled />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Failed Login Attempts">{selectedUser.failedLoginAttempts}</Descriptions.Item>
                                    <Descriptions.Item label="Password Last Changed">{selectedUser.passwordLastChanged}</Descriptions.Item>
                                </Descriptions>
                            </Card>

                            {/* Login Statistics */}
                            <Card title="Login Statistics" size="small" style={{ marginBottom: 16 }}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Total Logins"
                                            value={selectedUser.loginCount}
                                            valueStyle={{ fontSize: '16px' }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Last Login"
                                            value={selectedUser.lastLogin || 'Never'}
                                            valueStyle={{ fontSize: '16px' }}
                                        />
                                    </Col>
                                </Row>
                                <div style={{ marginTop: 16 }}>
                                    <Text strong>Login Activity: </Text>
                                    <Progress
                                        percent={Math.min((selectedUser.loginCount / 500) * 100, 100)}
                                        strokeColor="#52c41a"
                                        showInfo={false}
                                    />
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Activity level based on login frequency
                                    </Text>
                                </div>
                            </Card>

                            {/* Account Management */}
                            <Card title="Account Management" size="small" style={{ marginBottom: 16 }}>
                                <Descriptions size="small" column={1}>
                                    <Descriptions.Item label="Created By">{selectedUser.createdBy}</Descriptions.Item>
                                    <Descriptions.Item label="Account Status">
                                        <Tag color={getStatusColor(selectedUser.status)}>{selectedUser.status}</Tag>
                                    </Descriptions.Item>
                                    {selectedUser.notes && (
                                        <Descriptions.Item label="Notes">{selectedUser.notes}</Descriptions.Item>
                                    )}
                                </Descriptions>

                                <Divider />

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button
                                        block
                                        onClick={() => handleToggleStatus(selectedUser)}
                                        type={selectedUser.status === 'Active' ? 'default' : 'primary'}
                                        icon={selectedUser.status === 'Active' ? <StopOutlined /> : <CheckCircleOutlined />}
                                    >
                                        {selectedUser.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                                    </Button>

                                    <Button
                                        block
                                        onClick={() => handleLockUnlockAccount(selectedUser)}
                                        danger={!selectedUser.accountLocked}
                                        icon={selectedUser.accountLocked ? <UnlockOutlined /> : <LockOutlined />}
                                    >
                                        {selectedUser.accountLocked ? 'Unlock Account' : 'Lock Account'}
                                    </Button>

                                    <Button
                                        block
                                        onClick={() => handleResetPassword(selectedUser)}
                                        icon={<KeyOutlined />}
                                    >
                                        Send Password Reset
                                    </Button>
                                </Space>
                            </Card>

                            {/* Permission Details */}
                            <Card title="Detailed Permissions" size="small">
                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Role: </Text>
                                    <Tag color={getRoleColor(selectedUser.role)} icon={<CrownOutlined />}>
                                        {selectedUser.role}
                                    </Tag>
                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                        (Level {selectedUser.roleLevel})
                                    </Text>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <Text strong>Access Permissions:</Text>
                                </div>

                                <div>
                                    {selectedUser.permissions.includes('all') ? (
                                        <Tag color="red" icon={<CrownOutlined />} style={{ marginBottom: 4 }}>
                                            Full System Access
                                        </Tag>
                                    ) : (
                                        selectedUser.permissions.map(permission => (
                                            <Tag key={permission} color="blue" style={{ marginBottom: 4 }}>
                                                {permission.charAt(0).toUpperCase() + permission.slice(1)} Access
                                            </Tag>
                                        ))
                                    )}
                                </div>

                                <Divider />

                                <div>
                                    <Text strong>Security Features:</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ marginBottom: 4 }}>
                                            <SafetyCertificateOutlined style={{ marginRight: 8, color: selectedUser.twoFactorEnabled ? '#52c41a' : '#d9d9d9' }} />
                                            <Text type={selectedUser.twoFactorEnabled ? 'default' : 'secondary'}>
                                                Two-Factor Authentication
                                            </Text>
                                            <Tag color={selectedUser.twoFactorEnabled ? 'green' : 'default'} size="small" style={{ marginLeft: 8 }}>
                                                {selectedUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                            </Tag>
                                        </div>

                                        <div style={{ marginBottom: 4 }}>
                                            <LockOutlined style={{ marginRight: 8, color: selectedUser.accountLocked ? '#ff4d4f' : '#52c41a' }} />
                                            <Text type={selectedUser.accountLocked ? 'danger' : 'default'}>
                                                Account Lock Status
                                            </Text>
                                            <Tag color={selectedUser.accountLocked ? 'red' : 'green'} size="small" style={{ marginLeft: 8 }}>
                                                {selectedUser.accountLocked ? 'Locked' : 'Unlocked'}
                                            </Tag>
                                        </div>

                                        <div>
                                            <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                            <Text>Password Last Changed: </Text>
                                            <Text type="secondary">{selectedUser.passwordLastChanged}</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </Drawer>
            </div>
        </AppLayout>
    );
};

export default SystemUsersPage;