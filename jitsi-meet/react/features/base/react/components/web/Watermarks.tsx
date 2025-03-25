import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IReduxState } from '../../../../app/types';

interface IProps {
    _showJitsiWatermark: boolean;
}

/**
 * A Web Component which renders a watermark with inline CSS and hover effect.
 */
const Watermarks: React.FC<IProps> = ({ _showJitsiWatermark }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false); // State để theo dõi hover

    const handleWatermarkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate('/'); // Chuyển hướng về "/"
    };

    if (!_showJitsiWatermark) {
        return null;
    }

    const watermarkStyle = {
        position: 'absolute' as const,
        top: '20px',
        left: '20px',
        cursor: 'pointer', // Con trỏ tay khi hover
    };

    const textStyle = {
        fontSize: isHovered ? 'xx-large' : 'x-large', // Thay đổi fontSize khi hover
        color: 'white', // Màu chữ trắng
        transition: 'font-size 0.3s ease', // Hiệu ứng chuyển đổi mượt mà
    };

    return (
        <a
            href="/"
            style={watermarkStyle}
            onClick={handleWatermarkClick}
            target="_self"
            onMouseEnter={() => setIsHovered(true)} // Khi hover
            onMouseLeave={() => setIsHovered(false)} // Khi rời hover
        >
            <h5 style={textStyle}>Moonice</h5>
        </a>
    );
};

/**
 * Maps parts of Redux store to component prop types.
 */
function _mapStateToProps(state: IReduxState) {
    const { customizationReady, customizationFailed } = state['features/dynamic-branding'];
    const isValidRoom = state['features/base/conference'].room;
    const { SHOW_JITSI_WATERMARK } = interfaceConfig;

    const _showJitsiWatermark =
        (customizationReady && !customizationFailed && SHOW_JITSI_WATERMARK) || !isValidRoom;

    return {
        _showJitsiWatermark,
    };
}

export default connect(_mapStateToProps)(Watermarks);