function toArabicNumber(num: number) {
  return num
    .toString()
    .replace(/\d/g, (d) => String.fromCharCode(0x0660 + Number(d)));
}

export default function AyahSymbol({ number }: { number: number }) {
  return (
    <span className="relative inline-flex items-center justify-center w-8 h-8 text-primary text-lg font-[Amiri,Quran,serif]">
      {/* Symbol */}
      <span className="text-3xl">۝</span>

      {/* Number inside */}
      <span className="absolute text-base font-bold text-foreground">
        {toArabicNumber(number)}
      </span>
    </span>
  );
}
