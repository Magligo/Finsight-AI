const iconPaths = {
  activity: "M5 12h3l2-6 4 12 2-6h3",
  alert: "M12 3 3 20h18L12 3Zm0 6v5m0 3h.01",
  chart: "M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-9",
  dashboard: "M4 5h7v7H4V5Zm9 0h7v4h-7V5ZM4 14h7v5H4v-5Zm9-3h7v8h-7v-8Z",
  insights: "M9 18h6m-5 3h4m-6-8a6 6 0 1 1 8 0c-1 1-2 2-2 4h-4c0-2-1-3-2-4Z",
  plus: "M12 5v14M5 12h14",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0",
  receipt: "M7 3h10v18l-2-1.2L13 21l-2-1.2L9 21l-2-1.2V3Zm3 5h4m-4 4h4m-4 4h2",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 4 4",
  shield: "M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z",
  sparkle: "M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Zm6 10 .8 2.2L21 16l-2.2.8L18 19l-.8-2.2L15 16l2.2-.8L18 13Z",
  wallet: "M4 7h14a2 2 0 0 1 2 2v9H6a2 2 0 0 1-2-2V7Zm0 0a2 2 0 0 1 2-2h11v2m0 5h3",
};


function Icon({ name, className = "" }) {
  return (
    <svg
      className={`icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={iconPaths[name]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default Icon;
