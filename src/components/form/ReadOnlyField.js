import {
    Col
} from 'antd';

export const ReadOnlyField = ({ label, value, span = 24, style = {} }) => {
    return (
        <Col span={span} style={style}>
            <div style={{ marginBottom: '16px' }}>
                <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '4px',
                    fontWeight: '500'
                }}>
                    {label}
                </div>
                <div style={{
                    padding: '8px 12px',
                    background: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    color: '#333'
                }}>
                    {value || '-'}
                </div>
            </div>
        </Col>
    );
};

export const ReadOnlyTextArea = ({ label, value, span = 24, rows = 3 }) => {
    return (
        <Col span={span}>
            <div style={{ marginBottom: '16px' }}>
                <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '4px',
                    fontWeight: '500'
                }}>
                    {label}
                </div>
                <div style={{
                    padding: '8px 12px',
                    background: '#fff',
                    border: '1px solid #e8e8e8',
                    borderRadius: '8px',
                    minHeight: rows * 20 + 16,
                    fontSize: '14px',
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                }}>
                    {value || '-'}
                </div>
            </div>
        </Col>
    );
};