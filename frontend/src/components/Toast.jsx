export function Toast({ mensaje }) {
  return (
    <div className={`toast ${mensaje ? 'show' : ''}`}>
      {mensaje}
    </div>
  );
}