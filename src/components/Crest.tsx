/** The Regia et Ars crest (museum-app/public/branding/regia-et-ars-crest.png), at most 168 px. */
export function Crest({ size, className = "" }: { size: 28 | 56 | 112 | 168; className?: string }) {
  const src = (px: number) => `/branding/crest-${px <= 56 ? 56 : px <= 112 ? 112 : 336}.webp`;
  return (
    <img
      src={src(size)}
      srcSet={`${src(size)} 1x, ${src(size * 2)} 2x`}
      width={size}
      height={size}
      alt=""
      decoding="async"
      className={className}
    />
  );
}
