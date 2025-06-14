import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import dayjs from 'dayjs';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Card,
    Row,
    Col,
    Typography,
    Space,
    DatePicker,
    Radio,
    Switch,
    Upload,
    Avatar,
    message,
    Tag
} from 'antd';
import {
    SaveOutlined,
    ArrowLeftOutlined,
    UserOutlined,
    UploadOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const CustomerForm = ({
    mode = 'create',
    initialData = null,
    onSubmit,
    loading = false,
    onCancel
}) => {
    const [form] = Form.useForm();
    const [avatar, setAvatar] = useState(null);
    const [customTags, setCustomTags] = useState([]);
    const [newTag, setNewTag] = useState('');

    let navigate = useNavigate();

    const isEditMode = mode === 'edit';
    const pageTitle = isEditMode ? 'Edit Customer' : 'Add New Customer';
    const submitButtonText = isEditMode ? 'Update Customer' : 'Create Customer';

    useEffect(() => {
        if (isEditMode && initialData) {
            const formData = {
                ...initialData,
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : null,
                joinDate: initialData.joinDate ? new Date(initialData.joinDate) : null,
                // Flatten address object for form
                street: initialData.address?.street,
                city: initialData.address?.city,
                state: initialData.address?.state,
                zipCode: initialData.address?.zipCode,
                country: initialData.address?.country,
                // Handle social media
                linkedin: initialData.socialMedia?.linkedin,
                twitter: initialData.socialMedia?.twitter
            };

            form.setFieldsValue(formData);

            // Set avatar if exists
            if (initialData.avatar) {
                setAvatar(initialData.avatar);
            }

            // Set custom tags
            if (initialData.customTags) {
                setCustomTags(initialData.customTags);
            }
        } else {
            // Set default values for create mode
            form.setFieldsValue({
                status: 'Active',
                customerType: 'Individual',
                gender: 'Male',
                country: 'United States',
                marketingOptIn: true,
                preferredCommunication: 'Email',
                joinDate: new Date()
            });
        }
    }, [initialData, isEditMode, form]);

    const onFinish = async (values) => {
        try {
            // Restructure data for submission
            const customerData = {
                ...values,
                // Combine address fields
                address: {
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    zipCode: values.zipCode,
                    country: values.country
                },
                // Combine social media fields
                socialMedia: {
                    linkedin: values.linkedin,
                    twitter: values.twitter
                },
                // Add custom tags
                customTags: customTags,
                // Add avatar
                avatar: avatar,
                // Generate customer ID for new customers
                ...(isEditMode && initialData ? { id: initialData.id } : { customerId: generateCustomerId() }),
                updatedAt: new Date().toISOString(),
                ...(mode === 'create' ? { createdAt: new Date().toISOString() } : {})
            };

            // Remove flattened address fields
            delete customerData.street;
            delete customerData.city;
            delete customerData.state;
            delete customerData.zipCode;
            delete customerData.country;
            delete customerData.linkedin;
            delete customerData.twitter;

            await onSubmit(customerData);
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'create'} customer. Please try again.`);
        }
    };

    const generateCustomerId = () => {
        const timestamp = Date.now().toString().slice(-5);
        return `CUS-${timestamp}`;
    };

    // Avatar upload handling
    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setAvatar(url);
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return false; // Prevent auto upload
    };

    // Custom tags management
    const handleAddTag = () => {
        if (newTag && !customTags.includes(newTag)) {
            setCustomTags([...customTags, newTag]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tag) => {
        setCustomTags(customTags.filter(t => t !== tag));
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            {/* Page Header */}
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/customers")}
                    style={{ marginBottom: 16 }}
                >
                    Back to Customers
                </Button>
                <Title level={2} style={{ margin: 0 }}>{pageTitle}</Title>
                <Text type="secondary">
                    {isEditMode
                        ? 'Update customer information and manage customer details'
                        : 'Create a new customer profile with contact and business information'
                    }
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Row gutter={24}>
                    {/* Left Column */}
                    <Col xs={24} lg={16}>
                        {/* Basic Information */}
                        <Card title="Basic Information" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="firstName"
                                        label="First Name"
                                        rules={[
                                            { required: true, message: 'Please enter first name' },
                                            { min: 2, message: 'First name must be at least 2 characters' }
                                        ]}
                                    >
                                        <Input placeholder="Enter first name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="lastName"
                                        label="Last Name"
                                        rules={[
                                            { required: true, message: 'Please enter last name' },
                                            { min: 2, message: 'Last name must be at least 2 characters' }
                                        ]}
                                    >
                                        <Input placeholder="Enter last name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email Address"
                                        rules={[
                                            { required: true, message: 'Please enter email address' },
                                            { type: 'email', message: 'Please enter a valid email address' }
                                        ]}
                                    >
                                        <Input placeholder="Enter email address" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="phone"
                                        label="Primary Phone"
                                        rules={[
                                            { required: true, message: 'Please enter phone number' }
                                        ]}
                                    >
                                        <Input placeholder="Enter phone number" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="secondaryPhone"
                                        label="Secondary Phone (Optional)"
                                    >
                                        <Input placeholder="Enter secondary phone" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="company"
                                        label="Company (Optional)"
                                    >
                                        <Input placeholder="Enter company name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="dateOfBirth"
                                        label="Date of Birth (Optional)"
                                        getValueProps={(value) => ({
                                            value: value ? dayjs(value) : undefined
                                        })}
                                        normalize={(value) => value ? value.format('YYYY-MM-DD') : undefined}
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="gender"
                                        label="Gender"
                                    >
                                        <Select placeholder="Select gender">
                                            <Option value="Male">Male</Option>
                                            <Option value="Female">Female</Option>
                                            <Option value="Other">Other</Option>
                                            <Option value="Prefer not to say">Prefer not to say</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="joinDate"
                                        label="Join Date"
                                        rules={[{ required: true, message: 'Please select join date' }]}
                                        getValueProps={(value) => ({
                                            value: value ? dayjs(value) : undefined
                                        })}
                                        normalize={(value) => value ? value.format('YYYY-MM-DD') : undefined}
                                    >
                                        <DatePicker style={{ width: '100%' }} placeholder="Select join date" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Address Information */}
                        <Card title="Address Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="street"
                                label="Street Address"
                                rules={[{ required: true, message: 'Please enter street address' }]}
                            >
                                <Input placeholder="Enter street address" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="city"
                                        label="City"
                                        rules={[{ required: true, message: 'Please enter city' }]}
                                    >
                                        <Input placeholder="Enter city" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="state"
                                        label="State/Province"
                                        rules={[{ required: true, message: 'Please enter state' }]}
                                    >
                                        <Input placeholder="Enter state" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="zipCode"
                                        label="ZIP/Postal Code"
                                        rules={[{ required: true, message: 'Please enter ZIP code' }]}
                                    >
                                        <Input placeholder="Enter ZIP code" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="country"
                                label="Country"
                                rules={[{ required: true, message: 'Please select country' }]}
                            >
                                <Select placeholder="Select country" showSearch>
                                    <Option value="United States">United States</Option>
                                    <Option value="Canada">Canada</Option>
                                    <Option value="United Kingdom">United Kingdom</Option>
                                    <Option value="Australia">Australia</Option>
                                    <Option value="Germany">Germany</Option>
                                    <Option value="France">France</Option>
                                    <Option value="Japan">Japan</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        {/* Social Media & Additional Contact */}
                        <Card title="Social Media & Additional Contact" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="linkedin"
                                        label="LinkedIn Profile"
                                    >
                                        <Input placeholder="linkedin.com/in/username" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="twitter"
                                        label="Twitter Handle"
                                    >
                                        <Input placeholder="@username" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="website"
                                label="Website (Optional)"
                            >
                                <Input placeholder="https://example.com" />
                            </Form.Item>
                        </Card>

                        {/* Notes & Custom Tags */}
                        <Card title="Notes & Tags" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="notes"
                                label="Customer Notes"
                            >
                                <TextArea
                                    placeholder="Internal notes about this customer"
                                    rows={4}
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item label="Custom Tags">
                                <div style={{ marginBottom: 12 }}>
                                    {customTags.map(tag => (
                                        <Tag
                                            key={tag}
                                            closable
                                            onClose={() => handleRemoveTag(tag)}
                                            style={{ marginBottom: 8 }}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                </div>
                                <Input.Group compact>
                                    <Input
                                        style={{ width: 'calc(100% - 80px)' }}
                                        placeholder="Add custom tag"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onPressEnter={handleAddTag}
                                    />
                                    <Button type="primary" onClick={handleAddTag}>Add</Button>
                                </Input.Group>
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={8}>
                        {/* Profile Picture */}
                        <Card title="Profile Picture" style={{ marginBottom: 24 }}>
                            <div style={{ textAlign: 'center' }}>
                                <Avatar
                                    size={100}
                                    src={avatar}
                                    icon={<UserOutlined />}
                                    style={{ marginBottom: 16 }}
                                />
                                <div>
                                    <Upload
                                        name="avatar"
                                        listType="picture"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        onChange={handleAvatarChange}
                                    >
                                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                    </Upload>
                                </div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    JPG or PNG, max 2MB
                                </Text>
                            </div>
                        </Card>

                        {/* Customer Status */}
                        <Card title="Customer Status" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Select placeholder="Select status">
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                    <Option value="Suspended">Suspended</Option>
                                    <Option value="Blocked">Blocked</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="customerType"
                                label="Customer Type"
                                rules={[{ required: true, message: 'Please select customer type' }]}
                            >
                                <Select placeholder="Select type">
                                    <Option value="Individual">Individual</Option>
                                    <Option value="Business">Business</Option>
                                    <Option value="Wholesale">Wholesale</Option>
                                    <Option value="VIP">VIP</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="priority"
                                label="Priority Level"
                                initialValue="Normal"
                            >
                                <Select>
                                    <Option value="Low">Low</Option>
                                    <Option value="Normal">Normal</Option>
                                    <Option value="High">High</Option>
                                    <Option value="VIP">VIP</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        {/* Communication Preferences */}
                        <Card title="Communication Preferences" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="preferredCommunication"
                                label="Preferred Communication"
                                rules={[{ required: true, message: 'Please select preferred communication' }]}
                            >
                                <Radio.Group>
                                    <Radio value="Email">Email</Radio>
                                    <Radio value="Phone">Phone</Radio>
                                    <Radio value="SMS">SMS</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item
                                name="marketingOptIn"
                                label="Marketing Communications"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Opt-in" unCheckedChildren="Opt-out" />
                            </Form.Item>

                            <Form.Item
                                name="newsletterSubscription"
                                label="Newsletter Subscription"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                            </Form.Item>
                        </Card>

                        {/* Business Information */}
                        <Card title="Business Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="taxId"
                                label="Tax ID (Optional)"
                            >
                                <Input placeholder="Enter tax ID" />
                            </Form.Item>

                            <Form.Item
                                name="creditLimit"
                                label="Credit Limit"
                                tooltip="Maximum credit amount for this customer"
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    style={{ width: '100%' }}
                                    precision={2}
                                    min={0}
                                    prefix="$"
                                />
                            </Form.Item>

                            <Form.Item
                                name="paymentTerms"
                                label="Payment Terms"
                                initialValue="Net 30"
                            >
                                <Select>
                                    <Option value="Immediate">Immediate</Option>
                                    <Option value="Net 15">Net 15</Option>
                                    <Option value="Net 30">Net 30</Option>
                                    <Option value="Net 60">Net 60</Option>
                                    <Option value="Custom">Custom</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="discount"
                                label="Customer Discount (%)"
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={100}
                                    precision={2}
                                />
                            </Form.Item>
                        </Card>

                        {/* Additional Information */}
                        <Card title="Additional Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="referredBy"
                                label="Referred By (Optional)"
                            >
                                <Input placeholder="Customer ID or name" />
                            </Form.Item>

                            <Form.Item
                                name="source"
                                label="Lead Source"
                            >
                                <Select placeholder="How did they find us?">
                                    <Option value="Website">Website</Option>
                                    <Option value="Social Media">Social Media</Option>
                                    <Option value="Referral">Referral</Option>
                                    <Option value="Advertisement">Advertisement</Option>
                                    <Option value="Trade Show">Trade Show</Option>
                                    <Option value="Cold Call">Cold Call</Option>
                                    <Option value="Other">Other</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="loyaltyPoints"
                                label="Initial Loyalty Points"
                                initialValue={0}
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    min={0}
                                />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                {/* Action Buttons */}
                <Card>
                    <Row justify="end">
                        <Col>
                            <Space>
                                <Button size="large" onClick={() => form.resetFields()}>
                                    Reset
                                </Button>
                                <Button
                                    size="large"
                                    onClick={() => message.info('Save as draft')}
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                >
                                    {submitButtonText}
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </div>
    );
};
