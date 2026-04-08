import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch } from "../app/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: typeof useSelector = useSelector;
