import React, { useState, useEffect } from 'react';
import {
    message
} from 'antd';
import { useParams } from "react-router";
import AppLayout from '../../layouts/AppLayout';
import OrderViewPage from './OrderViewPage';
import OrderEditPage from './OrderEditPage';

// Demo Component with Logic to Show Edit vs View
const OrderDetailsController = () => {
    let { pageId } = useParams();

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('view'); // 'view' or 'edit'

    // Sample order data
    const sampleReadViewOrderData = {
        orderId: 'ORD-12345',
        status: 'Delivered', // Change this to test different behaviors
        paymentStatus: 'Paid',
        priority: 'Normal',
        customer: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1-555-0101'
        },
        customerNotes: 'VIP customer - handle with care',
        orderDate: '2024-01-15',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z',
        paymentMethod: 'Credit Card',
        paymentReference: 'TXN-ABC123',
        shippingName: 'John Doe',
        shippingEmail: 'john@example.com',
        shippingPhone: '+1-555-0101',
        shippingCompany: 'Acme Corp',
        shippingAddress: '123 Main Street',
        shippingCity: 'New York',
        shippingState: 'NY',
        shippingZip: '10001',
        shippingCountry: 'United States',
        customerInstructions: 'Leave package at front door if no one is home',
        trackingNumber: 'TRK12345678',
        shippingMethod: 'Express Shipping',
        estimatedDelivery: '2024-01-18',
        items: [
            { id: 1, name: 'Wireless Headphones', sku: 'WH-001', price: 99.99, quantity: 2, total: 199.98 },
            { id: 2, name: 'Bluetooth Speaker', sku: 'BS-003', price: 79.99, quantity: 1, total: 79.99 }
        ],
        totals: {
            subtotal: 279.97,
            tax: 22.40,
            shipping: 15.00,
            discount: 10.00,
            total: 307.37
        },
        orderNotes: 'Customer requested expedited processing',
        internalNotes: 'Processed by warehouse team on 2024-01-16'
    };
    const sampleEditOrderData = {
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

    const isPageIdEven = (id) => {
        const numberPart = parseInt(pageId.split('-')[1], 10);
        return numberPart % 2 === 0;
    }

    useEffect(() => {
        setTimeout(() => {
            //const orderData = isPageIdEven(pageId) ? sampleReadViewOrderData : sampleEditOrderData;
            setOrderData(isPageIdEven(pageId) ? sampleReadViewOrderData : sampleEditOrderData);
            setLoading(false);
        }, 200);
    }, [pageId]);

    const handleBack = () => {
        message.info('Navigate back to orders list');
    };

    const handleEdit = () => {
        const canEdit = orderData.status !== 'Delivered' && orderData.status !== 'Cancelled';
        if (canEdit) {
            setCurrentView('edit');
            message.info('Navigate to edit page');
        } else {
            message.warning('This order cannot be edited');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading order data...</div>;
    }

    // Determine if order can be edited
    const isCompleted = orderData?.status === 'Delivered' || orderData?.status === 'Cancelled';

    return (
        <AppLayout>
            <div>
                {
                    isPageIdEven(pageId) ? <OrderViewPage
                        orderData={orderData}
                        onBack={handleBack}
                        onEdit={handleEdit}
                    /> : <OrderEditPage
                        orderData={orderData}
                    />
                }
            </div>
        </AppLayout>
    );
};

export default OrderDetailsController;