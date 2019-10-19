export const formatErrorResponse = error => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        return error.response.data;

      case 500:
        return { success: false, errors: { "*": ["Internal server error"] } };

      default:
        return { success: false, errors: { "*": [error.response.status] } };
    }
  } else {
    return { success: false, errors: { "*": ["No response from server"] } };
  }
};
