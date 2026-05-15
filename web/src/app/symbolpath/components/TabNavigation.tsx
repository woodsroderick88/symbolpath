export function TabNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 2,
        paddingTop: 16,
        overflowX: "auto",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              borderRadius: "10px 10px 0 0",
              background: active ? "rgba(124,58,237,0.2)" : "transparent",
              color: active ? "#C4B5FD" : "#6B7280",
              border: active
                ? "1px solid rgba(139,92,246,0.3)"
                : "1px solid transparent",
              borderBottom: active ? "1px solid #0A0614" : "none",
              fontSize: 13,
              fontWeight: active ? 700 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              marginBottom: -1,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <Icon size={14} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
}
