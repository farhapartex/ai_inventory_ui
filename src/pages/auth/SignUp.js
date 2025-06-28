import React, { useEffect } from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useAppDispatch, useAuth } from '../../store/hooks';
import { clearError, loginUser } from '../../store/slices/authSlice';

const { Link, Title } = Typography;

const SignUpPage = () => {
    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();

    const { isLoading, error, isAuthenticated } = useAuth();

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            description: null,
            duration: 2
        });
    };

    const onFinish = async (values) => {
        const result = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(result)) {
            navigate('/');
        } else {
            const errorMessage = result.payload || 'Login failed';
            openNotificationWithIcon('error', errorMessage);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f2f2f2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            {contextHolder}
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
                        Sign up to your account
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
                        name="firstName"
                        label="First Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Enter your first name"
                            style={{
                                borderRadius: '8px',
                                padding: '8px'
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="lasttName"
                        label="Last Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                            placeholder="Enter your last name"
                            style={{
                                borderRadius: '8px',
                                padding: '8px'
                            }}
                        />
                    </Form.Item>
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
                                padding: '8px'
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
                                padding: '8px'
                            }}
                        />
                    </Form.Item>

                    <div style={{
                        textAlign: 'right',
                        marginBottom: '20px'
                    }}>
                        <Link href="/login" style={{ color: '#6366f1', marginLeft: '10px' }}>
                            Already have account?  Sign In
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
                            Sign Up
                        </Button>
                        <p>By clicking 'Sign Up', you are agree with our <Link style={{ color: '#6366f1' }}>terms & conditions</Link></p>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SignUpPage;