import Header from '~/Header';
import ScrollToTop from '~/component/scrollToTop';

function DefaultLayout({ Page, setShow, showCart, setShowCart, setUid }) {
    return (
        <>
            <Header setShow={setShow} showCart={showCart} setShowCart={setShowCart} setUid={setUid} />
            <section style={{ height: 150 }}></section>
            <ScrollToTop />
            {Page}
        </>
    );
}

export default DefaultLayout;
