import * as React from "react";

export function Icon({ d, size = 16, stroke = 1.6, className }: { d: React.ReactNode; size?: number; stroke?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d}
    </svg>
  );
}

export const I = {
  home: <Icon d={<><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></>} />,
  doc: <Icon d={<><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 12h6M10 16h6M10 8h2"/></>} />,
  briefcase: <Icon d={<><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></>} />,
  cal: <Icon d={<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>} />,
  user: <Icon d={<><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>} />,
  bell: <Icon d={<><path d="M6 9a6 6 0 0 1 12 0v4l1.5 3h-15L6 13z"/><path d="M10 19a2 2 0 0 0 4 0"/></>} />,
  search: <Icon d={<><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>} />,
  arrow: <Icon d={<><path d="M5 12h14M13 5l7 7-7 7"/></>} />,
  alert: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16v.5"/></>} />,
  download: <Icon d={<><path d="M12 4v12M6 12l6 6 6-6"/><path d="M4 20h16"/></>} />,
  save: <Icon d={<><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v6h7V4"/><path d="M8 14h8v6H8z"/></>} />,
  send: <Icon d={<><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></>} />,
  paper: <Icon d={<><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h5"/></>} />,
  upload: <Icon d={<><path d="M12 20V8M6 14l6-6 6 6"/><path d="M4 4h16"/></>} />,
  x: <Icon d={<><path d="M6 6l12 12M18 6 6 18"/></>} size={14} />,
  sun: <Icon d={<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></>} />,
  moon: <Icon d={<><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></>} />,
};
