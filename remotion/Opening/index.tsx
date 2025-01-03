import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { z } from "zod";
import type { Rocket } from "../../src/config";
import { Gradient } from "../Gradients/NativeGradient";
import { Noise } from "../Noise";
import { BACKGROUND_MOUNTAINS_IMAGE, BackgroundMountains } from "./Background";
import { FOREGROUND_IMAGE, Foreground } from "./Foreground";
import { TakeOff, getTakeOffAssetToPrefetch } from "./TakeOff";
import { OpeningTitle } from "./Title";
import { accentColorToGradient, type openingTitleSchema } from "./TitleImage";
import { isMobileDevice } from "./devices";

export const OPENING_SCENE_LENGTH = 130;
export const OPENING_SCENE_OUT_OVERLAP = 10;

const LAUNCH_SOUND = staticFile("rocket-launch.mp3");

export const getOpeningAssetsToPrefetch = (rocket: Rocket) => {
  return [
    LAUNCH_SOUND,
    ...getTakeOffAssetToPrefetch(rocket),
    FOREGROUND_IMAGE,
    BACKGROUND_MOUNTAINS_IMAGE,
  ];
};

const OpeningSceneFull: React.FC<z.infer<typeof openingTitleSchema>> = ({
  login,
  startAngle,
  rocket,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const exitProgress = spring({
    fps,
    frame,
    config: {
      damping: 200,
    },
    delay: durationInFrames - 20,
    durationInFrames: 60,
  });

  const distance = interpolate(exitProgress, [0, 1], [1, 0.000005], {});
  const scaleDivided = 1 / distance;
  const translateX = (scaleDivided - 1) * 200;

  const bottomTranslateY = interpolate(exitProgress, [0, 0.7], [0, 500]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isMobileDevice() ? null : (
        <Sequence from={-20}>
          <Audio startFrom={0} src={LAUNCH_SOUND} />
        </Sequence>
      )}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontSize: 60,
          width: "100%",
          height: "100%",
        }}
      >
        <AbsoluteFill
          style={{
            opacity: interpolate(exitProgress, [0, 1], [1, 0]),
          }}
        >
          <Gradient gradient={accentColorToGradient()} />
          <Noise translateX={100} translateY={30} />
        </AbsoluteFill>
        <AbsoluteFill>
          <OpeningTitle
            startAngle={startAngle}
            exitProgress={exitProgress}
            login={login}
            rocket={rocket}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transform: `translateY(${bottomTranslateY}px)`,
          }}
        >
          <BackgroundMountains />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transformOrigin: "bottom",
            transform: `scale(${scaleDivided}) translateY(${translateX}px)`,
          }}
        >
          <Foreground />
        </AbsoluteFill>
        <TakeOff rocket={rocket} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const OpeningScene: React.FC<z.infer<typeof openingTitleSchema>> = ({
  login,
  startAngle,
  rocket,
}) => {
  const { width, fps, durationInFrames: actualDuration } = useVideoConfig();
  const frame = useCurrentFrame();
  const delay = 10;
  const durationInFrames = 60;

  const zoomOut =
    spring({
      fps,
      frame,
      config: {
        damping: 200,
      },
      durationInFrames,
      delay,
    }) *
      0.9 +
    interpolate(frame, [0, delay + durationInFrames], [-0.1, 0.1], {
      extrapolateRight: "clamp",
    });

  const scale = interpolate(zoomOut, [0, 1], [2.5, 1]);
  const offset = interpolate(
    zoomOut,
    [0, 1],
    [startAngle === "left" ? width / 2 - 300 : -width / 2, 0],
  );
  const x = offset / scale;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateX(${x}px) translateY(0px)`,
      }}
    >
      <OpeningSceneFull startAngle={startAngle} login={login} rocket={rocket} />
      {isMobileDevice() ? null : (
        <Sequence from={actualDuration - 60}>
          <Audio src={staticFile("first-whoosh.mp3")} volume={0.5} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
