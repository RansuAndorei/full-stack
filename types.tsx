import { Timestamp } from "firebase/firestore";

export type Food = {
  id: string;
  name: string;
  description: string;
  rating: number;
  image: string;
  phoneNumber: string;
  releaseDate: null;
  createdAt: Timestamp;
};

export type Movie = {
  id: string;
  name: string;
  description: string;
  rating: number;
  image: string;
  phoneNumber: string;
  releaseDate: string;
  createdAt: Timestamp;
};

export type Color = {
  backgroundColor: string;
  divBackgroundColor: string;
  textColor: string;
  buttonColor: string;
};

export type Form = {
  name: string;
  description: string;
  rating: number;
  image: string;
};
