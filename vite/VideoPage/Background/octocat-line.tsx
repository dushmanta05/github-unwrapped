import { noise2D } from "@remotion/noise";
import { serializeInstructions } from "@remotion/paths";
import React, { useEffect } from "react";
import { bodyRef } from "./Octocat-body";

const getBodyTranslation = (time: number) => {
  const offsetX = noise2D("bodyx", time / 800, 0) * 5;
  const offsetY = noise2D("bodyy", time / 800, 1) * 5;
  const offsetRotate = noise2D("rotateY", time / 1400, 1) * 5;
  return {
    x: offsetX,
    y: offsetY,
    rotate: offsetRotate,
  };
};

const OCTOCAT_ANCHOR_X = 1119.44;
const OCTOCAT_ANCHOR_Y = 825.73;

const octocatLinePath = (
  time: number,
  bodyTranslationX: number,
  bodyTranslationY: number
) => {
  const offsetX = noise2D("seed", time / 800, 0) * 10;
  const offsetY = noise2D("seedy", time / 800, 1) * 10;

  return serializeInstructions([
    {
      type: "M",
      x: 1450.75,
      y: 489.02,
    },
    {
      type: "C",
      cp1x: 1417.67 + offsetX,
      cp1y: 488.84 + offsetY,
      cp2x: 1377.46 + offsetX,
      cp2y: 484.17 + offsetY,
      x: 1346.48 + offsetX,
      y: 501.3 + offsetY,
    },
    {
      type: "C",
      cp1x: 1325.05 + offsetX,
      cp1y: 513.15 + offsetY,
      cp2x: 1314.8 + offsetX,
      cp2y: 539.22 + offsetY,
      x: 1314.72 + offsetX,
      y: 563.7 + offsetY,
    },
    {
      type: "C",
      cp1x: 1314.64 + offsetX,
      cp1y: 588.18 + offsetY,
      cp2x: 1322.9 + offsetX,
      cp2y: 611.81 + offsetY,
      x: 1330.34 + offsetX,
      y: 635.13 + offsetY,
    },
    {
      type: "C",
      cp1x: 1343.71 + offsetX,
      cp1y: 677.03 + offsetY,
      cp2x: 1354.71 + offsetX,
      cp2y: 719.69 + offsetY,
      x: 1363.28 + offsetX,
      y: 762.83 + offsetY,
    },
    {
      type: "C",
      cp1x: 1372.38 + offsetX,
      cp1y: 808.63 + offsetY,
      cp2x: 1378.59 + offsetX,
      cp2y: 856.92 + offsetY,
      x: 1364.22 + offsetX,
      y: 901.36 + offsetY,
    },
    {
      type: "C",
      cp1x: 1358.81 + offsetX,
      cp1y: 918.09 + offsetY,
      cp2x: 1349.89 + offsetX,
      cp2y: 934.63 + offsetY,
      x: 1334.99 + offsetX,
      y: 943.97 + offsetY,
    },
    {
      type: "C",
      cp1x: 1317.87 + offsetX,
      cp1y: 954.71 + offsetY,
      cp2x: 1295.63 + offsetX,
      cp2y: 954.04 + offsetY,
      x: 1276.41 + offsetX,
      y: 947.79 + offsetY,
    },
    {
      type: "C",
      cp1x: 1212.86,
      cp1y: 927.11,
      cp2x: 1174.6,
      cp2y: 847.9,
      x: OCTOCAT_ANCHOR_X + bodyTranslationX,
      y: OCTOCAT_ANCHOR_Y + bodyTranslationY,
    },
  ]);
};

export const octocatLineRef = React.createRef<SVGPathElement>();

export const OctocatLine: React.FC = () => {
  useEffect(() => {
    let time = 0;
    let cancel: null | number = null;

    const set = () => {
      time++;
      if (!bodyRef.current) {
        throw new Error("bodyRef.current is null");
      }

      const { x, y, rotate } = getBodyTranslation(time);
      octocatLineRef.current?.setAttribute("d", octocatLinePath(time, x, y));
      bodyRef.current.style.transformOrigin = `${OCTOCAT_ANCHOR_X}px ${OCTOCAT_ANCHOR_Y}px`;
      bodyRef.current.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${
        -rotate - 10
      }deg)`;
      cancel = requestAnimationFrame(set);
    };

    requestAnimationFrame(() => {
      set();
    });

    return () => {
      if (cancel) {
        cancelAnimationFrame(cancel);
      }
    };
  }, []);

  return (
    <path
      ref={octocatLineRef}
      d={octocatLinePath(0, 0, 0)}
      stroke="url(#octocatgradient)"
      strokeWidth="4"
      strokeMiterlimit="10"
    />
  );
};