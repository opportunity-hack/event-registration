const initialState = {
  isAuthenticated: false,
  token: "",
  user: {},
  checkedForAuth: false
};

const authReducer = (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        token: action.token
      };

    case "LOGOUT":
      return {
        ...initialState
      };

    case "CHECKED_FOR_AUTH":
      return { ...state, checkedForAuth: true };

    default:
      return state;
  }
};

export default authReducer;
