import { useState } from 'react';
import {
    Layout,
    Dropdown,
    Avatar,
    Button
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
    MenuUnfoldOutlined,
    UsergroupAddOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { NavLink, useNavigate } from "react-router";
import { RootLeftBar } from '../components/layout/RootLeftbar';
import { useAppDispatch } from '../store/hooks';
import { logoutUser } from '../store/slices/authSlice';

const { Header, Content } = Layout;

const AppLayout = (props) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [currentPage, setCurrentPage] = useState('dashboard');

    const dispatch = useAppDispatch();
    let navigate = useNavigate();

    const logout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            navigate('/login', { replace: true });
        }
    }

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <NavLink to="/">Dashboard</NavLink>
        },
        {
            key: 'products',
            icon: <InboxOutlined />,
            label: <NavLink to="/products">Products</NavLink>
        },
        {
            key: 'orders',
            icon: <ShoppingCartOutlined />,
            label: <NavLink to="/orders">Orders</NavLink>
        },
        {
            key: 'customers',
            icon: <TeamOutlined />,
            label: <NavLink to="/customers">Customers</NavLink>
        },
        {
            key: 'reports',
            icon: <BarChartOutlined />,
            label: <NavLink to="/reports">Reports</NavLink>
        },
        {
            key: 'userManagement',
            icon: <UsergroupAddOutlined />,
            label: <NavLink to="/manage-users">User Management</NavLink>
        },
        {
            key: 'rolePermission',
            icon: <SafetyOutlined />,
            label: <NavLink to="/role-permission-management">Role Permission</NavLink>
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => setCurrentPage('settings')
        }
    ];

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
            onClick: () => logout()
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