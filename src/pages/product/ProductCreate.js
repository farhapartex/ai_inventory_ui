import React, { useState } from 'react';
import {
    message,
} from 'antd';
import AppLayout from '../../layouts/AppLayout';
import { ProductForm } from '../../components/product/ProductForm';

const ProductCreatePage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            console.log('Creating product:', formData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Product created successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to products list');
    };

    return (
        <AppLayout>
            <ProductForm
                mode="create"
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default ProductCreatePage;