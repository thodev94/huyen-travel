import { getDisplacementMap } from "./getDisplacementMap";

export type DisplacementOptions = {
  height: number;
  width: number;
  radius: number;
  depth: number;
  strength?: number;
  chromaticAberration?: number;
};

/**
 * Creating the displacement filter.
 * The file complexity is due to the experimental "chromatic aberration" effect;
 * filters from first `feColorMatrix` to last `feBlend` can be removed if the effect is not needed.
 */
export const getDisplacementFilter = ({
  height,
  width,
  radius,
  depth,
  strength = 100,
  chromaticAberration = 0,
}: DisplacementOptions) => {
  const filterId = `displace-${width}-${height}-${radius}-${depth}-${strength}-${chromaticAberration}`;
  const mapUrl = getDisplacementMap({ height, width, radius, depth });

  const filterContent = chromaticAberration === 0 
    ? `<filter id="${filterId}" color-interpolation-filters="sRGB">
          <feImage x="0" y="0" height="${height}" width="${width}" href="${mapUrl}" result="displacementMap" />
          <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength}"
              xChannelSelector="R"
              yChannelSelector="G"
          />
       </filter>`
    : `<filter id="${filterId}" color-interpolation-filters="sRGB">
          <feImage x="0" y="0" height="${height}" width="${width}" href="${mapUrl}" result="displacementMap" />
          <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength + chromaticAberration * 2}"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedR_raw"
          />
          <feColorMatrix in="displacedR_raw" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="displacedR" />
          
          <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength + chromaticAberration}"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedG_raw"
          />
          <feColorMatrix in="displacedG_raw" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="displacedG" />
          
          <feDisplacementMap
              in="SourceGraphic"
              in2="displacementMap"
              scale="${strength}"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedB_raw"
          />
          <feColorMatrix in="displacedB_raw" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="displacedB" />
          
          <feBlend in="displacedR" in2="displacedG" mode="screen" result="blendRG"/>
          <feBlend in="blendRG" in2="displacedB" mode="screen"/>
       </filter>`;

  return "data:image/svg+xml;utf8," + 
         encodeURIComponent(`<svg height="${height}" width="${width}" xmlns="http://www.w3.org/2000/svg">${filterContent}</svg>`) + 
         `#${filterId}`;
};
