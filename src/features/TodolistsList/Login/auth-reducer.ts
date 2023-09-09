import { Dispatch } from "redux";
import {
  setAppStatusAC,
  SetAppStatusActionType,
  setIsInitializedAC,
} from "../../../app/app-reducer";
import { authAPI, LoginType } from "../../../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../../../utils/error-utils";

const initialState = {
  isLoggedIn: false,
};
type InitialStateType = typeof initialState;

export const authReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "login/SET-IS-LOGGED-IN":
      return { ...state, isLoggedIn: action.value };

    default:
      return state;
  }
};

export const setIsLoggedInAC = (value: boolean) =>
  ({ type: "login/SET-IS-LOGGED-IN", value } as const);

export const loginTC =
  (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));

    try {
      const res = await authAPI.login(data);
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError((e as any).message, dispatch);
    }
  };
export const initializeAppTC =
  () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"));

    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true));
        dispatch(setAppStatusAC("succeeded"));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    } catch (e) {
      handleServerNetworkError((e as any).message, dispatch);
    } finally {
      dispatch(setIsInitializedAC(true));
    }
  };
export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"));

  try {
    const res = await authAPI.logOut();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(false));
      dispatch(setAppStatusAC("succeeded"));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError((e as any).message, dispatch);
  }
};

type ActionsType =
  | ReturnType<typeof setIsLoggedInAC>
  | ReturnType<typeof setIsInitializedAC>
  | SetAppStatusActionType;
