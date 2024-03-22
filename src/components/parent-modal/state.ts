import { atom } from "jotai";

export interface Position {
  longitude: number;
  latitude: number;
}
export const locationAtom = atom<Position | null>(null);
export const pageAtom = atom<number>(1);
export const navigationModeActiveAtom = atom(false);
