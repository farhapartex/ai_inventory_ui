import React, { useState } from 'react';
import {
    Layout,
    Menu,
    Dropdown,
    Avatar,
    Button,
    Typography
} from 'antd';
import {
    DashboardOutlined,
    ShoppingCartOutlined,
    InboxOutlined,
    TeamOutlined,
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { RootLeftBar } from '../components/layout/RootLeftbar';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const AppLayout = (props) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Menu items for sidebar
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => setCurrentPage('dashboard')
        },
        {
            key: 'products',
            icon: <InboxOutlined />,
            label: 'Products',
            onClick: () => setCurrentPage('products')
        },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
            onClick: () => setCurrentPage('orders')
        },
        {
            key: 'customers',
            icon: <TeamOutlined />,
            label: 'Customers',
            onClick: () => setCurrentPage('customers')
        },
        {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: 'Reports',
            onClick: () => setCurrentPage('reports')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => setCurrentPage('settings')
        }
    ];

    // Header dropdown menu
    const userMenuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            onClick: () => console.log('Profile clicked')
        },
        {
            key: 'account-settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => console.log('User settings clicked')
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: () => console.log('Logout clicked')
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <RootLeftBar collapsed={collapsed} currentPage={currentPage} menuItems={menuItems} />

            <Layout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />

                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                        </div>
                    </Dropdown>
                </Header>

                {/* Content */}
                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'auto'
                }}>
                    {children}

                </Content>
            </Layout>
        </Layout>
    );
};

export default AppLayout;