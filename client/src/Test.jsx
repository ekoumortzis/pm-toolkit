// Simple test component
export default function Test() {
  return (
    <div style={{ padding: '50px', background: '#102542', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        ✅ React is Working!
      </h1>
      <p style={{ fontSize: '24px' }}>
        If you see this, React is loading correctly.
      </p>
      <p style={{ fontSize: '18px', marginTop: '20px' }}>
        The blank page was caused by an error in one of the components.
      </p>
    </div>
  )
}
