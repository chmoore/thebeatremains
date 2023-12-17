import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useRef } from 'react';

const Modal = forwardRef(function Modal({ children }, ref) {
  const dialogRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialogRef.current.showModal();
      },
      close() {
        dialogRef.current.close();
      },
    };
  });

  return createPortal(
    <>
      <dialog
        className="p-5 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full lg:m-0 md:w-4/12 backdrop:bg-slate-800 backdrop:bg-opacity-70 bg-slate-200 shadow-md rounded-lg"
        ref={dialogRef}
      >
        {children}
      </dialog>
    </>,
    document.getElementById('overlay')
  );
});

Modal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.any,
};

export default Modal;
