import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAuth } from '../store/hooks';
import { userMe } from '../store/slices/userSlice';

const AuthGuard = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [shouldRedirectToOnboard, setShouldRedirectToOnboard] = useState(false);

    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const { isLoading, error, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);



    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <Spin size="large" />
                <p style={{ marginTop: '16px', color: '#666' }}>Loading...</p>
            </div>
        );
    }

    return children;
}

export default AuthGuard;