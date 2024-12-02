//Mostramos una notificación al usuario a través del uso de un toast.
export const Toast = ({ message, setShowToast }) => (
  <div className='toast-container position-fixed top-0 end-0 p-3'>
    <div
      className='toast show primary'
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
    >
      <div className='toast-header'>
        <strong className='me-auto'>Notificación</strong>
        <button
          type='button'
          className='btn-close'
          data-bs-dismiss='toast'
          aria-label='Close'
          onClick={() => setShowToast(false)}
        ></button>
      </div>
      <div className='toast-body'>{message}</div>
    </div>
  </div>
);
