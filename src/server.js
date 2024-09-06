import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';

import * as contactServices from "./services/contacts.js";


// це ми замінили ф-єю env
// import dotenv from "dotenv";
// dotenv.config();
// const port = Number(process.env.PORT) || 3000;

export const startServer = () => {
  const app = express();

  const logger = pino({
    transport: {
      target: 'pino-pretty',
    },
  });

  app.use(logger);
  app.use(cors());
  app.use(express.json());

    // routes
    app.get("/contacts", async (req, res) => {
        const data = await contactServices.getAllContacts();

        res.json({
            status: 200,
            message: "Successsfully found contacts",
            data,
        })
    });

    app.get("contact/:id", async (req, res) => {
        const { id } = req.params;
        const data = await contactServices.getContactById(id);

        if (!data) {
           return res.status(404).json({
                message: `Contact with id=${id} not found`
            });
        }

        res.json({
            status: 200,
            message: `Contact wit ${id} successfully find`,
            data,
        })
    })

  app.use((req, res) => {
    res.status(404).json({
      message: `${req.url} not found`,
    });
  });

  app.use((error, req, res, next) => {
    res.status(500).json({
      message: error.message,
    });
  });

  // виклткаємо ф-цію env
  const port = Number(env('PORT', 3000));

  app.listen(port, console.log('Server running on port 3000'));
};
