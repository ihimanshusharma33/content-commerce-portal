
const WhatsAppButton = () => {
  const phoneNumber = "1234567890"; 

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="Chat on WhatsApp"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      />
    </a>
  );
};

export default WhatsAppButton;
