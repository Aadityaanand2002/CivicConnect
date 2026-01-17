export default function PageWrapper({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          padding: "24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
