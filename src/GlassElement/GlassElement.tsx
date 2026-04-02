import { CSSProperties, ReactNode, useEffect, useState } from "react";
import {
  getDisplacementFilter,
  DisplacementOptions,
} from "./getDisplacementFilter";
import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./GlassElement.module.css";

type GlassElementProps = DisplacementOptions & {
  children?: ReactNode | undefined;
  blur?: number;
  debug?: boolean;
};

/** Detect if the browser supports backdrop-filter with SVG url() references.
 *  iOS Safari and Android Chrome do not support this — they only support blur(). */
const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    window.matchMedia("(max-width: 768px)").matches;
};

export const GlassElement = ({
  height,
  width,
  depth: baseDepth,
  radius,
  children,
  strength,
  chromaticAberration,
  blur = 2,
  debug = false,
}: GlassElementProps) => {
  /* Change element depth on click */
  const [clicked, setClicked] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let depth = baseDepth / (clicked ? 0.7 : 1);

  /* Dynamic CSS properties */
  const style: CSSProperties = {
    borderRadius: `${radius}px`,
    // On mobile: fallback to simple glassmorphism (blur only — universally supported)
    // On desktop: full SVG displacement filter effect
    backdropFilter: mobile
      ? `blur(${blur * 3}px) brightness(1.1) saturate(1.4)`
      : `blur(${blur / 2}px) url('${getDisplacementFilter({
          height,
          width,
          radius,
          depth,
          strength,
          chromaticAberration,
        })}') blur(${blur}px) brightness(1.1) saturate(1.5)`,
    // On mobile: let CSS handle sizing responsively
    ...(mobile ? {} : { height: `${height}px`, width: `${width}px` }),
  };

  /* Debug mode: display the displacement map instead of actual effect */
  if (debug === true && !mobile) {
    style.background = `url("${getDisplacementMap({
      height,
      width,
      radius,
      depth,
    })}")`;
    style.boxShadow = "none";
  }

  return (
    <div
      className={`${styles.box} ${mobile ? styles.mobile : ""}`}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onTouchStart={() => setClicked(true)}
      onTouchEnd={() => setClicked(false)}
    >
      {children}
    </div>
  );
};
