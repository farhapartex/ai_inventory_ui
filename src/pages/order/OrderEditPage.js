import React, { useState, useEffect } from 'react';
import {
    message,
} from 'antd';
import { useParams } from "react-router";
import { OrderForm } from '../../components/order/OrderForm';

const OrderEditPage = (props) => {
    const { orderData } = props;
    let { pageId } = useParams();

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const loadOrderData = async () => {
            setDataLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setInitialData(orderData);
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
        <OrderForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleSubmit}
            loading={loading}
            onCancel={handleCancel}
        />
    );
};

export default OrderEditPage;
