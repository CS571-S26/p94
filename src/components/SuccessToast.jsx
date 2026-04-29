import { Toast, ToastContainer } from 'react-bootstrap';

export default function SuccessToast({ show, message, onClose }) {
    return (
        <ToastContainer position="bottom-end" className="p-3">
            <Toast show={show} onClose={onClose} delay={3000} autohide bg="success">
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}