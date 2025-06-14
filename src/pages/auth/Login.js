import React from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Link, Title } = Typography;

const LoginPage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Login form values:', values);
        // Handle login logic here
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f2f2f2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>

            {/* Login Card */}
            <Card
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    border: '2px solid rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    background: 'white'
                }}
                bodyStyle={{ padding: '40px 30px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                        AI Inventory
                    </Title>
                    <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '16px' }}>
                        Sign in to your account
                    </p>
                </div>

                <Form
                    form={form}
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email address!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Enter your email"
                            style={{
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters!',
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Enter your password"
                            style={{
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        />
                    </Form.Item>

                    <div style={{
                        textAlign: 'right',
                        marginBottom: '20px'
                    }}>
                        <Link href="/" style={{ color: '#6366f1' }}>
                            Forgot password?
                        </Link>
                        <Link href="/" style={{ color: '#6366f1', marginLeft: '10px' }}>
                            Sign Up
                        </Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{
                                height: '48px',
                                borderRadius: '8px',
                                background: '#4f46e5',
                                borderColor: '#4f46e5',
                                fontSize: '16px',
                                fontWeight: '500'
                            }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;