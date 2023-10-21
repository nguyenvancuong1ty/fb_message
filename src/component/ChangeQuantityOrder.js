import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
function ChangeQuantityOrder({ data, quantityAddToCart, setQuantityAddToCart }) {
    const decreaseQuantityError = () =>
        toast.warn('Ít nhất 1 sản phẩm', {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });

    const increaseQuantityError = (max) =>
        toast.warn(`Tối đa ${max}`, {
            position: 'bottom-left',
            autoClose: 2000,
            theme: 'light',
        });
    return (
        <>
            <Button
                variant="light"
                className="detail__info--number--btn"
                onClick={() => {
                    quantityAddToCart <= 1 ? decreaseQuantityError() : setQuantityAddToCart((prev) => prev - 1);
                }}
            >
                -
            </Button>
            <input
                value={quantityAddToCart}
                className="detail__info--number--input"
                onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        setQuantityAddToCart(e.target.value * 1);
                    } else {
                        toast.warn(`Chi được phép nhập số`, {
                            position: 'bottom-left',
                            autoClose: 2000,
                            theme: 'light',
                        });
                    }
                }}
            />
            <Button
                variant="light"
                className="detail__info--number--btn"
                onClick={() => {
                    quantityAddToCart >= data[0].data.metadata.quantity - data[0].data.metadata.sold
                        ? increaseQuantityError(data[0].data.metadata.quantity - data[0].data.metadata.sold)
                        : setQuantityAddToCart((prev) => prev + 1);
                }}
            >
                +
            </Button>
        </>
    );
}

export default ChangeQuantityOrder;
