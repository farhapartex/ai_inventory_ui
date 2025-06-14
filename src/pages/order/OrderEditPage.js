import React, { useState, useEffect } from 'react';
import {
    message,
} from 'antd';
import { useParams } from "react-router";
import AppLayout from '../../layouts/AppLayout';
import { OrderForm } from '../../components/order/OrderForm';

const OrderEditPage = () => {
    let { pageId } = useParams();

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    // Sample initial data for edit mode
    const sampleOrderData = {
        id: 'ORD-12345',
        customer: { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1-555-0101' },
        customerName: 'John Doe',
        orderDate: '2024-01-15',
        status: 'Processing',
        paymentStatus: 'Paid',
        paymentMethod: 'Credit Card',
        paymentReference: 'TXN-ABC123',
        priority: 'Normal',
        shippingName: 'John Doe',
        shippingEmail: 'john@example.com',
        shippingPhone: '+1-555-0101',
        shippingCompany: 'Acme Corp',
        shippingAddress: '123 Main Street',
        shippingCity: 'New York',
        shippingState: 'NY',
        shippingZip: '10001',
        shippingCountry: 'United States',
        items: [
            { id: 1, productId: 1, name: 'Wireless Headphones', sku: 'WH-001', price: 99.99, quantity: 2, total: 199.98 },
            { id: 2, productId: 3, name: 'Bluetooth Speaker', sku: 'BS-003', price: 79.99, quantity: 1, total: 79.99 }
        ],
        trackingNumber: 'TRK12345678',
        orderNotes: 'Customer requested expedited shipping',
        customerInstructions: 'Leave package at front door',
        customerNotes: 'VIP customer - priority handling'
    };

    useEffect(() => {
        const loadOrderData = async () => {
            setDataLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setInitialData(sampleOrderData);
            } catch (error) {
                message.error('Failed to load order data');
            } finally {
                setDataLoading(false);
            }
        };

        if (pageId) {
            loadOrderData();
        }
    }, [pageId]);

    const handleSubmit = async (orderData) => {
        setLoading(true);
        try {
            console.log('Updating order:', orderData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Order updated successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to orders list');
    };

    if (dataLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading order data...</div>;
    }

    return (
        <AppLayout>
            <OrderForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default OrderEditPage;
