export function MensajeAviso({ mensaje }) {
  return (
    <div className={`mensaje-aviso ${mensaje ? 'show' : ''}`}>
      {mensaje}
    </div>
  );
}