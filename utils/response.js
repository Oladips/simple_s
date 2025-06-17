exports.success = ({ data = null, message = 'Success', pagination = null }) => {
    return {
      status: true,
      data,
      errors: null,
      message,
      pagination
    };
  };
  
  exports.error = ({ errors = null, message = 'An error occurred', status = false }) => {
    return {
      status,
      data: null,
      errors,
      message,
      pagination: null
    };
  };
  