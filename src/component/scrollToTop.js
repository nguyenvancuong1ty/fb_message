// ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Cuộn lên đầu trang mỗi khi đường dẫn thay đổi
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // Không cần render bất cứ thứ gì
};

export default ScrollToTop;
