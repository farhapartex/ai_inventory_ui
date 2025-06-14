import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import {
    message,
} from 'antd';
import { CustomerForm } from '../../components/customer/CustomerForm';
import AppLayout from '../../layouts/AppLayout';

const CustomerEditPage = () => {
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    const { pageId } = useParams();

    // Sample initial data for edit mode
    const sampleCustomerData = {
        id: 'CUS-12345',
        customerId: 'CUS-12345',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0101',
        secondaryPhone: '+1-555-0102',
        company: 'Acme Corporation',
        dateOfBirth: '1985-06-15',
        gender: 'Male',
        joinDate: '2023-01-15',
        status: 'Active',
        customerType: 'Business',
        priority: 'High',
        address: {
            street: '123 Business Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
        },
        socialMedia: {
            linkedin: 'linkedin.com/in/johndoe',
            twitter: '@johndoe'
        },
        website: 'https://johndoe.com',
        notes: 'Important VIP customer with special requirements',
        customTags: ['VIP', 'Frequent Buyer', 'B2B'],
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        preferredCommunication: 'Email',
        marketingOptIn: true,
        newsletterSubscription: true,
        taxId: 'TAX123456789',
        creditLimit: 50000,
        paymentTerms: 'Net 30',
        discount: 10,
        referredBy: 'CUS-00001',
        source: 'Referral',
        loyaltyPoints: 1500
    };

    useEffect(() => {
        const loadCustomerData = async () => {
            setDataLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 200));
                setInitialData(sampleCustomerData);
            } catch (error) {
                message.error('Failed to load customer data');
            } finally {
                setDataLoading(false);
            }
        };

        if (pageId) {
            loadCustomerData();
        }
    }, [pageId]);

    const handleSubmit = async (customerData) => {
        setLoading(true);
        try {
            console.log('Updating customer:', customerData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Customer updated successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to customers list');
    };

    if (dataLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading customer data...</div>;
    }

    return (
        <AppLayout>
            <CustomerForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default CustomerEditPage;

