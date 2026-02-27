"use client";

type GraphicType = "network" | "cloud" | "chart" | "gears" | "people" | "globe" | "database" | "shield";

function GraphicNetwork() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      {([[60,60],[60,150],[60,240],[160,30],[160,110],[160,190],[160,270],[260,60],[260,150],[260,240],[360,110],[360,190]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="14" fill="#e28100" fillOpacity={0.15} stroke="#e28100" strokeWidth="1.5" strokeOpacity={0.6}/>
      ))}
      {([[60,60,160,30],[60,60,160,110],[60,150,160,110],[60,150,160,190],[60,240,160,190],[60,240,160,270],[160,30,260,60],[160,110,260,60],[160,110,260,150],[160,190,260,150],[160,190,260,240],[160,270,260,240],[260,60,360,110],[260,150,360,110],[260,150,360,190],[260,240,360,190]] as [number,number,number,number][]).map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e28100" strokeWidth="1" strokeOpacity="0.3"/>
      ))}
      {([[160,110],[160,190],[260,150]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="20" fill="#e28100" fillOpacity={0.25} stroke="#e28100" strokeWidth="2"/>
      ))}
      <circle cx="160" cy="150" r="6" fill="#e28100"/>
      <circle cx="260" cy="150" r="6" fill="#e28100"/>
      <text x="200" y="285" textAnchor="middle" fill="#e28100" fillOpacity="0.5" fontSize="10" fontWeight="bold">AI Neural Network</text>
    </svg>
  );
}

function GraphicCloud() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      <ellipse cx="200" cy="100" rx="100" ry="55" fill="#e28100" fillOpacity="0.18" stroke="#e28100" strokeWidth="2"/>
      <ellipse cx="130" cy="115" rx="55" ry="40" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5"/>
      <ellipse cx="270" cy="115" rx="55" ry="40" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5"/>
      <rect x="30" y="180" width="80" height="50" rx="8" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.5"/>
      <rect x="160" y="190" width="80" height="50" rx="8" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.5"/>
      <rect x="290" y="180" width="80" height="50" rx="8" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.5"/>
      <line x1="70" y1="155" x2="70" y2="180" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3"/>
      <line x1="200" y1="155" x2="200" y2="190" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3"/>
      <line x1="330" y1="155" x2="330" y2="180" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 3"/>
      <text x="70" y="210" textAnchor="middle" fill="#e28100" fillOpacity="0.8" fontSize="10" fontWeight="bold">IaaS</text>
      <text x="200" y="220" textAnchor="middle" fill="#e28100" fillOpacity="0.8" fontSize="10" fontWeight="bold">PaaS</text>
      <text x="330" y="210" textAnchor="middle" fill="#e28100" fillOpacity="0.8" fontSize="10" fontWeight="bold">SaaS</text>
      <text x="200" y="105" textAnchor="middle" fill="#e28100" fillOpacity="0.9" fontSize="12" fontWeight="bold">Azure Cloud</text>
    </svg>
  );
}

function GraphicChart() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      <rect x="40" y="40" width="320" height="220" rx="12" fill="#e28100" fillOpacity="0.06" stroke="#e28100" strokeWidth="1" strokeOpacity="0.3"/>
      {([70,130,190,250,310] as number[]).map((x,i) => (
        <rect key={i} x={x} y={240-(i+1)*38} width="40" height={(i+1)*38} rx="4" fill="#e28100" fillOpacity={0.1+i*0.07} stroke="#e28100" strokeWidth="1.5" strokeOpacity={0.4+i*0.1}/>
      ))}
      <polyline points="90,150 150,110 210,80 270,55 330,35" stroke="#e28100" strokeWidth="2.5" strokeOpacity="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {([[90,150],[150,110],[210,80],[270,55],[330,35]] as [number,number][]).map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#e28100" fillOpacity="0.9"/>
      ))}
      {([80,130,180,230] as number[]).map((y,i) => (
        <line key={i} x1="55" y1={y} x2="355" y2={y} stroke="#e28100" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 4"/>
      ))}
      <text x="200" y="278" textAnchor="middle" fill="#e28100" fillOpacity="0.6" fontSize="10" fontWeight="bold">Power BI Dashboard</text>
    </svg>
  );
}

function GraphicGears() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      <circle cx="160" cy="145" r="70" fill="#e28100" fillOpacity="0.08" stroke="#e28100" strokeWidth="2" strokeOpacity="0.4"/>
      <circle cx="160" cy="145" r="25" fill="#e28100" fillOpacity="0.2" stroke="#e28100" strokeWidth="2"/>
      {([0,45,90,135,180,225,270,315] as number[]).map((deg,i) => {
        const rad = deg*Math.PI/180;
        return <line key={i} x1={160+68*Math.cos(rad)} y1={145+68*Math.sin(rad)} x2={160+82*Math.cos(rad)} y2={145+82*Math.sin(rad)} stroke="#e28100" strokeWidth="12" strokeOpacity="0.35" strokeLinecap="round"/>;
      })}
      <circle cx="290" cy="105" r="42" fill="#e28100" fillOpacity="0.08" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.4"/>
      <circle cx="290" cy="105" r="15" fill="#e28100" fillOpacity="0.2" stroke="#e28100" strokeWidth="1.5"/>
      {([0,60,120,180,240,300] as number[]).map((deg,i) => {
        const rad = deg*Math.PI/180;
        return <line key={i} x1={290+40*Math.cos(rad)} y1={105+40*Math.sin(rad)} x2={290+50*Math.cos(rad)} y2={105+50*Math.sin(rad)} stroke="#e28100" strokeWidth="8" strokeOpacity="0.35" strokeLinecap="round"/>;
      })}
      <line x1="50" y1="240" x2="350" y2="240" stroke="#e28100" strokeWidth="2" strokeOpacity="0.5"/>
      <polygon points="355,240 345,235 345,245" fill="#e28100" fillOpacity="0.5"/>
      {([80,160,240,320] as number[]).map((x,i) => (
        <g key={i}>
          <circle cx={x} cy="240" r="5" fill="#e28100" fillOpacity="0.6"/>
          <line x1={x} y1="235" x2={x} y2="220" stroke="#e28100" strokeOpacity="0.3" strokeWidth="1"/>
        </g>
      ))}
      <text x="200" y="278" textAnchor="middle" fill="#e28100" fillOpacity="0.6" fontSize="10" fontWeight="bold">Projekt Timeline</text>
    </svg>
  );
}

function GraphicGlobe() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      <circle cx="180" cy="150" r="110" fill="#e28100" fillOpacity="0.07" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.4"/>
      {([-60,-30,0,30,60] as number[]).map((lat,i) => {
        const y = 150+(lat/90)*110;
        const rx = Math.sqrt(Math.max(0, 110*110-(y-150)*(y-150)));
        return <ellipse key={i} cx="180" cy={y} rx={rx} ry={rx*0.25} stroke="#e28100" strokeWidth="1" strokeOpacity="0.2" fill="none"/>;
      })}
      {([0,60,120] as number[]).map((lng,i) => (
        <ellipse key={i} cx="180" cy="150" rx={110*Math.abs(Math.cos(lng*Math.PI/180))} ry="110" stroke="#e28100" strokeWidth="1" strokeOpacity="0.18" fill="none" transform={`rotate(${lng} 180 150)`}/>
      ))}
      {([[180,75,"DK"],[265,90,"PL"],[275,118,"CZ"],[255,128,"RO"],[310,105,"SE"]] as [number,number,string][]).map(([cx,cy,lbl],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={lbl==="DK"?10:7} fill="#e28100" fillOpacity={lbl==="DK"?0.9:0.55}/>
          <text x={cx+14} y={cy+4} fill="#e28100" fillOpacity="0.8" fontSize="9" fontWeight="bold">{lbl}</text>
          {lbl!=="DK" && <line x1="180" y1="75" x2={cx} y2={cy} stroke="#e28100" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 3"/>}
        </g>
      ))}
      <text x="180" y="278" textAnchor="middle" fill="#e28100" fillOpacity="0.6" fontSize="10" fontWeight="bold">Nearshore Europa</text>
    </svg>
  );
}

function GraphicDatabase() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      {([[60,100],[200,80],[340,100]] as [number,number][]).map(([cx,y],i) => (
        <g key={i}>
          <ellipse cx={cx} cy={y} rx="50" ry="16" fill="#e28100" fillOpacity={0.12+i*0.04} stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.5"/>
          <rect x={cx-50} y={y} width="100" height="60" fill="#e28100" fillOpacity={0.07+i*0.03} stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.35"/>
          <ellipse cx={cx} cy={y+60} rx="50" ry="16" fill="#e28100" fillOpacity={0.15+i*0.04} stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.5"/>
          <text x={cx} y={y+35} textAnchor="middle" fill="#e28100" fillOpacity="0.6" fontSize="9" fontWeight="bold">{["Source","DW","Mart"][i]}</text>
        </g>
      ))}
      <path d="M110,130 Q155,130 155,150 Q155,170 200,170" stroke="#e28100" strokeWidth="2" strokeOpacity="0.5" fill="none" markerEnd="url(#a)"/>
      <path d="M290,130 Q245,130 245,150 Q245,170 200,170" stroke="#e28100" strokeWidth="2" strokeOpacity="0.5" fill="none"/>
      <text x="155" y="148" fill="#e28100" fillOpacity="0.7" fontSize="8" fontWeight="bold">ETL</text>
      <text x="230" y="148" fill="#e28100" fillOpacity="0.7" fontSize="8" fontWeight="bold">ETL</text>
      <rect x="120" y="230" width="160" height="35" rx="8" fill="#e28100" fillOpacity="0.12" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.4"/>
      <text x="200" y="252" textAnchor="middle" fill="#e28100" fillOpacity="0.8" fontSize="10" fontWeight="bold">Power BI / Tableau</text>
      <line x1="200" y1="196" x2="200" y2="230" stroke="#e28100" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3"/>
    </svg>
  );
}

function GraphicSharePoint() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      {([[50,40],[210,40],[50,160],[210,160]] as [number,number][]).map(([x,y],i) => (
        <g key={i}>
          <rect x={x} y={y} width="120" height="90" rx="8" fill="#e28100" fillOpacity="0.09" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.4"/>
          <rect x={x+10} y={y+18} width="100" height="7" rx="3" fill="#e28100" fillOpacity="0.3"/>
          <rect x={x+10} y={y+31} width="70" height="7" rx="3" fill="#e28100" fillOpacity="0.2"/>
          <rect x={x+10} y={y+44} width="85" height="7" rx="3" fill="#e28100" fillOpacity="0.2"/>
        </g>
      ))}
      <circle cx="200" cy="150" r="28" fill="#e28100" fillOpacity="0.22" stroke="#e28100" strokeWidth="2"/>
      <text x="200" y="155" textAnchor="middle" fill="#e28100" fillOpacity="0.9" fontSize="11" fontWeight="bold">SP</text>
      <line x1="170" y1="85" x2="182" y2="133" stroke="#e28100" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="270" y1="85" x2="218" y2="133" stroke="#e28100" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="170" y1="205" x2="182" y2="167" stroke="#e28100" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3"/>
      <line x1="270" y1="205" x2="218" y2="167" stroke="#e28100" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="4 3"/>
      {([[360,95,"Teams"],[360,150,"M365"],[360,205,"Power"]] as [number,number,string][]).map(([cx,cy,lbl]) => (
        <g key={lbl}>
          <circle cx={cx} cy={cy} r="22" fill="#e28100" fillOpacity="0.1" stroke="#e28100" strokeWidth="1.5" strokeOpacity="0.4"/>
          <text x={cx} y={cy+4} textAnchor="middle" fill="#e28100" fillOpacity="0.7" fontSize="8" fontWeight="bold">{lbl}</text>
          <line x1="228" y1={cy} x2={cx-22} y2={cy} stroke="#e28100" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="3 3"/>
        </g>
      ))}
    </svg>
  );
}

function GraphicPeople() {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full opacity-90" fill="none">
      {([[80,100,26,40,45],[200,90,34,50,55],[320,100,26,40,45]] as [number,number,number,number,number][]).map(([cx,headY,headR,bodyRx,bodyRy],i) => (
        <g key={i}>
          <circle cx={cx} cy={headY} r={headR} fill="#e28100" fillOpacity={i===1?0.22:0.12} stroke="#e28100" strokeWidth="1.5" strokeOpacity={i===1?0.7:0.4}/>
          <ellipse cx={cx} cy={headY+headR+bodyRy*0.6} rx={bodyRx} ry={bodyRy} fill="#e28100" fillOpacity={i===1?0.15:0.09} stroke="#e28100" strokeWidth="1.5" strokeOpacity={i===1?0.5:0.35}/>
        </g>
      ))}
      <circle cx="228" cy="68" r="16" fill="#e28100" fillOpacity="0.9"/>
      <path d="M220,68 l6,6 10-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <line x1="106" y1="148" x2="174" y2="155" stroke="#e28100" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="5 3"/>
      <line x1="294" y1="148" x2="226" y2="155" stroke="#e28100" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="5 3"/>
      {([["Azure",55,260],["AI",180,272],["Power BI",295,260],["SharePoint",200,240]] as [string,number,number][]).map(([lbl,x,y]) => (
        <g key={lbl}>
          <rect x={x-lbl.length*3.2} y={y-10} width={lbl.length*6.5} height="18" rx="9" fill="#e28100" fillOpacity="0.18" stroke="#e28100" strokeWidth="1" strokeOpacity="0.4"/>
          <text x={x} y={y+4} textAnchor="middle" fill="#e28100" fillOpacity="0.8" fontSize="9" fontWeight="bold">{lbl}</text>
        </g>
      ))}
    </svg>
  );
}

export default function ConsultantGraphic({ type }: { type: string }) {
  if (type === "cloud")    return <GraphicCloud />;
  if (type === "chart")    return <GraphicChart />;
  if (type === "gears")    return <GraphicGears />;
  if (type === "globe")    return <GraphicGlobe />;
  if (type === "database") return <GraphicDatabase />;
  if (type === "shield")   return <GraphicSharePoint />;
  if (type === "people")   return <GraphicPeople />;
  return <GraphicNetwork />;
}
