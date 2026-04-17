const BoltPath = "M0.530008 4.43966L13.5591 0.442106C13.9327 0.327463 14.2106 0.789407 13.9342 1.06577L7.92691 7.0731C7.73792 7.26208 7.87176 7.58523 8.13904 7.58523H11.1043C11.4395 7.58523 11.6063 7.99129 11.368 8.2269L5.15569 14.3686C4.91884 14.6028 4.51705 14.435 4.51705 14.1019V10.8682C4.51705 10.7025 4.38273 10.5682 4.21705 10.5682H0.75C0.335786 10.5682 0 10.2324 0 9.81818V5.15667C0 4.82719 0.215025 4.5363 0.530008 4.43966Z";

function MiniBolt({ size, fill }: { size: number; fill: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 15 15" fill="none" className="mini-bolt">
      <path d={BoltPath} fill={fill} />
    </svg>
  );
}

export function BankaiLink() {
  return (
    <a
      href="https://bankaiagency.com"
      target="_blank"
      rel="noopener noreferrer"
      className="bankai-link"
    >
      <span className="bankai-icon">
        <span className="mini-bolts">
          <MiniBolt size={10} fill="#ef4444" />
          <MiniBolt size={8} fill="#f87171" />
          <MiniBolt size={7} fill="#fca5a5" />
          <MiniBolt size={9} fill="#ef4444" />
          <MiniBolt size={8} fill="#f87171" />
        </span>
        <svg className="main-bolt" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d={BoltPath} fill="white" fillOpacity="0.6" />
        </svg>
      </span>
      <span className="bankai-text">BANKAI.AGENCY</span>
    </a>
  );
}
