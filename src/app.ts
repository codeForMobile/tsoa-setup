// src/app.ts
import express, {json, urlencoded, Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import swaggerUi from 'swagger-ui-express'

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import("../build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(function NotFoundHandler (_req, res: ExResponse){
  res.status(404).json({
    message: 'Not found'
  })
})

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught validation error for ${req.path}:`, err.fields)
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields
    });
  }
  if (err instanceof Error){
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
  next()
});