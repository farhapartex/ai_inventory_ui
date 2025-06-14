
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import {
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Button,
    Card,
    Row,
    Col,
    Typography,
    Switch,
    Radio,
    Modal,
    Space,
    message
} from 'antd';
import {
    PlusOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    UploadOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const ProductForm = ({
    mode = 'create',
    initialData = null,
    onSubmit,
    loading = false,
    onCancel
}) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageList, setImageList] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const [categories] = useState([
        'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Automotive', 'Beauty', 'Toys'
    ]);
    const [suppliers] = useState([
        'Supplier A', 'Supplier B', 'Supplier C', 'Supplier D', 'Global Electronics Inc.', 'Tech Solutions Ltd.'
    ]);

    const isEditMode = mode === 'edit';
    const pageTitle = isEditMode ? 'Edit Product' : 'Add New Product';
    const submitButtonText = isEditMode ? 'Update Product' : 'Create Product';

    useEffect(() => {
        if (isEditMode && initialData) {
            form.setFieldsValue(initialData);

            // Set existing images for edit mode
            if (initialData.images) {
                const existingImages = initialData.images.map((img, index) => ({
                    uid: `existing-${index}`,
                    name: `image-${index}.jpg`,
                    status: 'done',
                    url: img.url || img,
                    thumbUrl: img.thumbUrl || img.url || img
                }));
                setImageList(existingImages);
            }
        }
    }, [initialData, isEditMode, form]);

    const onFinish = async (values) => {
        try {
            const formData = {
                ...values,
                images: imageList,
                ...(isEditMode && initialData ? { id: initialData.id } : {}),
                updatedAt: new Date().toISOString(),
                ...(mode === 'create' ? { createdAt: new Date().toISOString() } : {})
            };

            await onSubmit(formData);
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'create'} product. Please try again.`);
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('Please check the form for errors and try again.');
        console.log('Failed:', errorInfo);
    };

    // Image upload handlers
    const handleImageChange = ({ fileList }) => {
        setImageList(fileList);
    };

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const generateSKU = () => {
        const category = form.getFieldValue('category');
        const name = form.getFieldValue('name');
        if (category && name) {
            const categoryCode = category.substring(0, 3).toUpperCase();
            const nameCode = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const sku = `${categoryCode}-${nameCode}-${randomNum}`;
            form.setFieldsValue({ sku });
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const backToProduct = () => {
        navigate("/products");
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={backToProduct}
                    style={{ marginBottom: 16 }}
                >
                    Back to Products
                </Button>
                <Title level={2} style={{ margin: 0 }}>{pageTitle}</Title>
                <Text type="secondary">
                    {isEditMode
                        ? 'Update product information and inventory details'
                        : 'Create a new product with detailed information and inventory tracking'
                    }
                </Text>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                scrollToFirstError
                initialValues={{
                    status: 'active',
                    visibility: 'visible',
                    trackQuantity: true,
                    availableOnline: true,
                    featured: false
                }}
            >
                <Row gutter={24}>
                    {/* Left Column */}
                    <Col xs={24} lg={16}>
                        {/* Basic Information */}
                        <Card title="Basic Information" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[
                                            { required: true, message: 'Please enter product name' },
                                            { min: 2, message: 'Name must be at least 2 characters' },
                                            { max: 100, message: 'Name cannot exceed 100 characters' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter product name"
                                            onChange={generateSKU}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="sku"
                                        label={
                                            <Space>
                                                SKU (Stock Keeping Unit)
                                                {!isEditMode && (
                                                    <Button
                                                        type="link"
                                                        size="small"
                                                        onClick={generateSKU}
                                                        style={{ padding: 0, height: 'auto' }}
                                                    >
                                                        Generate
                                                    </Button>
                                                )}
                                            </Space>
                                        }
                                        rules={[
                                            { required: true, message: 'Please enter SKU' },
                                            { pattern: /^[A-Z0-9-]+$/, message: 'SKU should contain only uppercase letters, numbers and hyphens' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="e.g., ELE-PHON-1234"
                                            disabled={isEditMode} // Usually SKU shouldn't be changed in edit mode
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="category"
                                        label="Category"
                                        rules={[{ required: true, message: 'Please select a category' }]}
                                    >
                                        <Select
                                            placeholder="Select category"
                                            onChange={generateSKU}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {categories.map(category => (
                                                <Option key={category} value={category}>{category}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="brand"
                                        label="Brand"
                                        rules={[{ required: true, message: 'Please enter brand name' }]}
                                    >
                                        <Input placeholder="Enter brand name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    { required: true, message: 'Please enter product description' },
                                    { min: 10, message: 'Description must be at least 10 characters' }
                                ]}
                            >
                                <TextArea
                                    placeholder="Enter detailed product description"
                                    rows={4}
                                    maxLength={1000}
                                    showCount
                                />
                            </Form.Item>

                            <Form.Item
                                name="shortDescription"
                                label="Short Description"
                            >
                                <TextArea
                                    placeholder="Brief description for listings"
                                    rows={2}
                                    maxLength={200}
                                    showCount
                                />
                            </Form.Item>
                        </Card>

                        {/* Pricing & Inventory */}
                        <Card title="Pricing & Inventory" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="cost"
                                        label="Cost Price"
                                        rules={[
                                            { required: true, message: 'Please enter cost price' },
                                            { type: 'number', min: 0, message: 'Cost must be positive' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="0.00"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                            prefix="$"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="price"
                                        label="Selling Price"
                                        rules={[
                                            { required: true, message: 'Please enter selling price' },
                                            { type: 'number', min: 0, message: 'Price must be positive' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="0.00"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                            prefix="$"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="compareAtPrice"
                                        label="Compare at Price"
                                        tooltip="Original price for showing discounts"
                                    >
                                        <InputNumber
                                            placeholder="0.00"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                            prefix="$"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="quantity"
                                        label={isEditMode ? "Current Quantity" : "Initial Quantity"}
                                        rules={[
                                            { required: true, message: 'Please enter quantity' },
                                            { type: 'number', min: 0, message: 'Quantity must be non-negative' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="0"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="lowStockThreshold"
                                        label="Low Stock Alert"
                                        tooltip="Alert when quantity falls below this number"
                                    >
                                        <InputNumber
                                            placeholder="10"
                                            style={{ width: '100%' }}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="trackQuantity"
                                        label="Track Quantity"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="Yes" unCheckedChildren="No" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Physical Properties */}
                        <Card title="Physical Properties" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col xs={24} md={6}>
                                    <Form.Item name="weight" label="Weight (kg)">
                                        <InputNumber
                                            placeholder="0.0"
                                            style={{ width: '100%' }}
                                            precision={3}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item name="length" label="Length (cm)">
                                        <InputNumber
                                            placeholder="0.0"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item name="width" label="Width (cm)">
                                        <InputNumber
                                            placeholder="0.0"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={6}>
                                    <Form.Item name="height" label="Height (cm)">
                                        <InputNumber
                                            placeholder="0.0"
                                            style={{ width: '100%' }}
                                            precision={2}
                                            min={0}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="material" label="Material">
                                        <Input placeholder="e.g., Cotton, Plastic, Metal" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="color" label="Color">
                                        <Select
                                            mode="multiple"
                                            placeholder="Select colors"
                                            options={[
                                                { label: 'Red', value: 'red' },
                                                { label: 'Blue', value: 'blue' },
                                                { label: 'Green', value: 'green' },
                                                { label: 'Black', value: 'black' },
                                                { label: 'White', value: 'white' },
                                                { label: 'Yellow', value: 'yellow' },
                                                { label: 'Purple', value: 'purple' },
                                                { label: 'Orange', value: 'orange' }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="size" label="Size">
                                        <Select
                                            mode="multiple"
                                            placeholder="Select sizes"
                                            options={[
                                                { label: 'XS', value: 'xs' },
                                                { label: 'S', value: 's' },
                                                { label: 'M', value: 'm' },
                                                { label: 'L', value: 'l' },
                                                { label: 'XL', value: 'xl' },
                                                { label: 'XXL', value: 'xxl' }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="model" label="Model Number">
                                        <Input placeholder="Enter model number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Product Images */}
                        <Card title="Product Images" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="images"
                                label="Upload Images"
                                extra="Upload multiple product images. First image will be the main image."
                            >
                                <Upload
                                    listType="picture-card"
                                    fileList={imageList}
                                    onChange={handleImageChange}
                                    onPreview={handlePreview}
                                    beforeUpload={() => false}
                                    multiple
                                >
                                    {imageList.length >= 8 ? null : uploadButton}
                                </Upload>
                            </Form.Item>

                            <Modal
                                open={previewVisible}
                                title="Image Preview"
                                footer={null}
                                onCancel={() => setPreviewVisible(false)}
                            >
                                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Card>
                    </Col>

                    {/* Right Column */}
                    <Col xs={24} lg={8}>
                        {/* Status & Visibility */}
                        <Card title="Status & Visibility" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="status"
                                label="Product Status"
                                rules={[{ required: true, message: 'Please select status' }]}
                            >
                                <Radio.Group>
                                    <Radio value="active">Active</Radio>
                                    <Radio value="draft">Draft</Radio>
                                    <Radio value="archived">Archived</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="visibility" label="Visibility">
                                <Radio.Group>
                                    <Radio value="visible">Visible</Radio>
                                    <Radio value="hidden">Hidden</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="featured" label="Featured Product" valuePropName="checked">
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                            </Form.Item>

                            <Form.Item name="availableOnline" label="Available Online" valuePropName="checked">
                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                            </Form.Item>
                        </Card>

                        {/* Supplier Information */}
                        <Card title="Supplier Information" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="supplier"
                                label="Primary Supplier"
                                rules={[{ required: true, message: 'Please select a supplier' }]}
                            >
                                <Select
                                    placeholder="Select supplier"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {suppliers.map(supplier => (
                                        <Option key={supplier} value={supplier}>{supplier}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="supplierSku" label="Supplier SKU">
                                <Input placeholder="Supplier's product code" />
                            </Form.Item>

                            <Form.Item
                                name="leadTime"
                                label="Lead Time (days)"
                                tooltip="Time needed to restock from supplier"
                            >
                                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
                            </Form.Item>

                            <Form.Item name="minimumOrderQuantity" label="Minimum Order Qty">
                                <InputNumber placeholder="1" style={{ width: '100%' }} min={1} />
                            </Form.Item>
                        </Card>

                        {/* SEO & Marketing */}
                        <Card title="SEO & Marketing" style={{ marginBottom: 24 }}>
                            <Form.Item
                                name="seoTitle"
                                label="SEO Title"
                                extra="Optimize for search engines (50-60 characters)"
                            >
                                <Input placeholder="SEO optimized title" maxLength={60} showCount />
                            </Form.Item>

                            <Form.Item
                                name="seoDescription"
                                label="SEO Description"
                                extra="Meta description for search results (150-160 characters)"
                            >
                                <TextArea
                                    placeholder="SEO meta description"
                                    maxLength={160}
                                    showCount
                                    rows={3}
                                />
                            </Form.Item>

                            <Form.Item name="tags" label="Tags">
                                <Select
                                    mode="tags"
                                    placeholder="Add tags for better categorization"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Card>

                        {/* Additional Information */}
                        <Card title="Additional Information" style={{ marginBottom: 24 }}>
                            <Form.Item name="barcode" label="Barcode/UPC">
                                <Input placeholder="Product barcode" />
                            </Form.Item>

                            <Form.Item name="warrantyPeriod" label="Warranty (months)">
                                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
                            </Form.Item>

                            <Form.Item name="origin" label="Country of Origin">
                                <Input placeholder="e.g., Made in USA" />
                            </Form.Item>

                            <Form.Item
                                name="hsCode"
                                label="HS Code"
                                tooltip="Harmonized System code for customs"
                            >
                                <Input placeholder="Customs classification code" />
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

// Create Page Component
