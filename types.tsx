import { type } from "os";

export type Food = {
  id: number;
  name: string;
  description: string;
  rating: number;
  image: string;
  phoneNumber: string;
  releaseDate: null;
};

export type Movie = {
  id: number;
  name: string;
  description: string;
  rating: number;
  image: string;
  phoneNumber: string;
  releaseDate: Date;
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
