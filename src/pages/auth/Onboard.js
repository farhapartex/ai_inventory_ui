import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Typography, notification, Row, Col, Spin } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useAppDispatch, useAuth, useUser } from '../../store/hooks';
import { clearError, loginUser, logoutUser } from '../../store/slices/authSlice';
import { userService } from '../../api/user';
import { userMe } from '../../store/slices/userSlice';

const { Link, Title } = Typography;

const OnboardPage = () => {
    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();

    const { isLoading, error, isAuthenticated } = useAuth();
    const { user, isUserLoading } = useUser();
    console.log("user: ", user);

    const openNotificationWithIcon = (type, message) => {
        api[type]({
            message: message,
            description: null,
            duration: 2
        });
    };

    const logout = async () => {
        const result = await dispatch(logoutUser());
        if (logoutUser.fulfilled.match(result)) {
            navigate('/login', { replace: true });
        } else {
            openNotificationWithIcon('error', "Logout failed! Please try again.");
        }
    }

    const onFinish = async (values) => {
        setLoading(true);
        const response = await userService.onboard(values);
        if (response.success) {
            const result = await dispatch(userMe());
            setLoading(false);
            form.resetFields();
            navigate('/');
        } else {
            setLoading(false);
            openNotificationWithIcon('error', response.error || 'Failed to update organization details. Please try again.');
        }

    };

    const onFinishFailed = (errorInfo) => {
        openNotificationWithIcon('error', 'Failed to update organization details. Please try again.');
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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
            <Spin spinning={loading} delay={500}>
                <Card
                    style={{
                        width: '100%',
                        maxWidth: '1000px',
                        border: '2px solid rgba(0, 0, 0, 0.15)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        background: 'white'
                    }}
                    bodyStyle={{ padding: '40px 30px' }}
                >
                    <div style={{
                        textAlign: 'right',
                        marginBottom: '20px'
                    }}>
                        <p
                            style={{ color: '#6366f1', padding: 0, margin: 0, cursor: 'pointer' }}
                            onClick={() => logout()}
                        >
                            Logout
                        </p>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                            Welcome to the Onboarding Page
                        </Title>
                        <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '16px' }}>
                            Add your organization details to get started
                        </p>
                    </div>

                    <Form
                        form={form}
                        name="onboard"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        size="large"
                        initialValues={{
                            firstName: user?.first_name || '',
                            lastName: user?.last_name || '',
                            organizationName: '',
                            address: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: 'United States'
                        }}
                    >
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your first name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                                        placeholder="Enter your first name"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your last name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                                        placeholder="Enter your last name"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="organizationName"
                                    label="Organization Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your organization name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                                        placeholder="Enter your last name"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="address"
                                    label="Address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your address!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<HomeOutlined style={{ color: '#9ca3af' }} />}
                                        placeholder="Enter your address"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="city"
                                    label="City"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your city!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your city"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="state"
                                    label="State"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your state!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your state"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="zipCode"
                                    label="Zip Code"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your zip code!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your zip code"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    label="Country"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your country!',
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your country"
                                        style={{
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>


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
                                    fontWeight: '500',
                                    marginTop: '30px'
                                }}
                            >
                                Update Your Organization
                            </Button>
                        </Form.Item>
                    </Form>

                </Card>
            </Spin>
        </div>
    );
};

export default OnboardPage;