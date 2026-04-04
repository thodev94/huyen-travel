import React, { CSSProperties, ReactNode, useState, useMemo } from "react";
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

export const GlassElement = React.memo(({
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
  const depth = baseDepth / (clicked ? 0.7 : 1);

  /* Dynamic CSS properties */
  const style: CSSProperties = useMemo(() => {
    const filter = getDisplacementFilter({
      height,
      width,
      radius,
      depth,
      strength,
      chromaticAberration,
    });

    const s: CSSProperties = {
      height: `${height}px`,
      width: `${width}px`,
      borderRadius: `${radius}px`,
      backdropFilter: `blur(${blur / 2}px) url('${filter}') blur(${blur}px) brightness(1.1) saturate(1.5)`,
      transform: 'translateZ(0)', // Promote to its own layer
      willChange: 'backdrop-filter',
    };

    if (debug === true) {
      s.background = `url("${getDisplacementMap({
        height,
        width,
        radius,
        depth,
      })}")`;
      s.boxShadow = "none";
    }

    return s;
  }, [height, width, radius, depth, strength, chromaticAberration, blur, debug]);

  return (
    <div
      className={styles.box}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onMouseLeave={() => setClicked(false)}
    >
      {children}
    </div>
  );
});
