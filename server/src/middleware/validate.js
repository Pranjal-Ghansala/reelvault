export function validate(schema, source) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data.",
          details: result.error.flatten(),
        },
      });
    }

    if (!req.validated) {
      req.validated = {};
    }

    req.validated[source] = result.data;

    next();
  };
}