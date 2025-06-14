import React, { useState, useEffect } from 'react';
import {
    message,
} from 'antd';
import AppLayout from '../../layouts/AppLayout';
import { OrderForm } from '../../components/order/OrderForm';



// Create Order Page Component
const OrderCreatePage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (orderData) => {
        setLoading(true);
        try {
            console.log('Creating order:', orderData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Order created successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to orders list');
    };

    return (
        <AppLayout>
            <OrderForm
                mode="create"
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default OrderCreatePage;
