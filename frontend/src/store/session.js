import { csrfFetch } from "./csrf";

export const LOG_IN = "LOG_IN";
export const LOG_OUT = "LOG_OUT";

const logIn = (user) => ({
  type: LOG_IN,
  user,
});

const logOut = () => ({
  type: LOG_OUT,
});

export const logInUser = (userInfo) => async (dispatch) => {
  const { credential, password } = userInfo;
  const url = `/api/session`;

  const response = await csrfFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, password }),
  });
  const data = await response.json();

  dispatch(logIn(data.user));
  return data.user;
};

export const signUpUser = (userInfo) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = userInfo;
    const url = `/api/users`;

    const response = await csrfFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, firstName, lastName, email, password }),
    });
    const data = await response.json();

    dispatch(logIn(data.user));
    return data.user;
  };

export const restoreUser = () => async (dispatch) => {

    const url = `/api/session`;

    const response = await csrfFetch(url);
    const data = await response.json();

    dispatch(logIn(data.user));
    return data.user;
  };

const initialState = {
  user: {},
};

export const logOutUser = ()=>async(dispatch)=>{
    const url = `/api/session`;
    const response = await csrfFetch(url,{method:"DELETE"});
    const data = await response.json();

    dispatch(logOut(data.user));
    return data.user;
}

const session = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOG_IN:
      newState.user = {};
      if(action.user === null){
        return newState
      }else{
        newState.user.id = action.user.id;
        newState.user.email = action.user.email;
        newState.user.username = action.user.username;
        newState.user.firstName = action.user.firstName;
        newState.user.lastName = action.user.lastName;
        newState.user.createdAt = action.user.createdAt;
        newState.user.updatedAt = action.user.updatedAt;
        return newState;
      }

    case LOG_OUT:
      newState.user = {};
      return newState;

    default:
      return state;
  }
};

export default session;
