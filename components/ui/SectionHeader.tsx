interface Props {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  center?: boolean;
  dark?: boolean;
}
export default function SectionHeader({ eyebrow, title, sub, center, dark }: Props) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-orange mb-4">
        <span className="w-5 h-px bg-orange" />{eyebrow}
      </span>
      <h2 className={`font-bold text-4xl md:text-5xl leading-tight tracking-tight ${dark ? "text-white" : "text-charcoal"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-lg leading-relaxed ${center ? "max-w-2xl mx-auto" : "max-w-xl"} ${dark ? "text-white/60" : "text-charcoal/55"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
