/** Phones only (under 768px): the name and the line between the two panels, so a phone visitor still sees who this is. */
export function SeamBar() {
  return (
    <div className="seam-bar" data-testid="seam-bar">
      <span className="name">Dan Diggas</span>
      <span className="line">Keys open doors</span>
    </div>
  );
}
