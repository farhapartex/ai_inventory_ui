import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useParams } from "react-router";
import AppLayout from '../../layouts/AppLayout';
import { ProductForm } from '../../components/product/ProductForm';

const ProductEditPage = () => {
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const [dataLoading, setDataLoading] = useState(true);

    let { pageId } = useParams();

    const sampleProductData = {
        id: 'PRD-0001',
        name: 'Sample Product',
        sku: 'ELE-SAMP-1234',
        category: 'Electronics',
        brand: 'Samsung',
        description: 'This is a sample product description for editing.',
        shortDescription: 'Sample product for demo',
        cost: 100.00,
        price: 150.00,
        compareAtPrice: 200.00,
        quantity: 50,
        lowStockThreshold: 10,
        trackQuantity: true,
        weight: 0.5,
        length: 15,
        width: 10,
        height: 5,
        material: 'Plastic',
        color: ['black', 'white'],
        size: ['m', 'l'],
        model: 'SM-001',
        status: 'active',
        visibility: 'visible',
        featured: false,
        availableOnline: true,
        supplier: 'Supplier A',
        supplierSku: 'SUP-001',
        leadTime: 7,
        minimumOrderQuantity: 5,
        seoTitle: 'Sample Product - Best Electronics',
        seoDescription: 'High quality sample product with amazing features.',
        tags: ['electronics', 'sample', 'demo'],
        barcode: '1234567890123',
        warrantyPeriod: 12,
        origin: 'Made in Korea',
        hsCode: '8517.12.00',
        images: [
            { url: 'https://picsum.photos/200/200?random=1' },
            { url: 'https://picsum.photos/200/200?random=2' }
        ]
    };

    useEffect(() => {
        const loadProductData = async () => {
            setDataLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 100));
                setInitialData(sampleProductData);
            } catch (error) {
                message.error('Failed to load product data');
            } finally {
                setDataLoading(false);
            }
        };

        if (pageId) {
            loadProductData();
        }
    }, [pageId]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            // Simulate API call
            console.log('Updating product:', formData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            message.success('Product updated successfully!');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        message.info('Navigate back to products list');
    };

    if (dataLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading product data...</div>;
    }

    return (
        <AppLayout>
            <ProductForm
                mode="edit"
                initialData={initialData}
                onSubmit={handleSubmit}
                loading={loading}
                onCancel={handleCancel}
            />
        </AppLayout>
    );
};

export default ProductEditPage;