import { atom } from "jotai";

export interface Complaint {
  complaint_id: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
}

export interface ComplaintImages {
  complaint_id: string;
  images: string[];
}

export type ComplaintWithImage = Complaint & { images: string[] };
export const modalOpenAtom = atom(false);
export const complaintAtom = atom<ComplaintWithImage | null>(null);
export const locationSuggestionAtom = atom<{
  latitude: number;
  longitude: number;
} | null>(null);
