import {
    Layout,
    Menu
} from 'antd';

const { Sider } = Layout;

export const RootLeftBar = (props) => {
    const { collapsed, currentPage, menuItems } = props;

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                background: '#001529',
            }}
        >
            <div style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                borderBottom: '1px solid #303030'
            }}>
                {collapsed ? 'IS' : 'AI Inventory'}
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[currentPage]}
                items={menuItems}
                style={{ borderRight: 0 }}
            />
        </Sider>
    )
}