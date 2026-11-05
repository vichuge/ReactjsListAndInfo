export default function StateMessage({ title, children, action, image, tone = 'neutral' }) {
  return (
    <div className={`state state--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {image}
      <h2 className="state__title">{title}</h2>
      {children && <p className="state__text">{children}</p>}
      {action}
    </div>
  )
}
