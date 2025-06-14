import React, { useState, useEffect } from 'react';
import {
    message,
} from 'antd';
import { CustomerForm } from '../../components/customer/CustomerForm';
import AppLayout from '../../layouts/AppLayout';

const CustomerCreatePage = () => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (customerData) => {
        setLoading(true);
        try {
            console.log('Creating customer:', customerData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Customer created successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to customers list');
    };

    return (
        <AppLayout>
            <CustomerForm
                mode="create"
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default CustomerCreatePage;