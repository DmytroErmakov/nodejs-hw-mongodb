import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
//   try {
    const data = await contactServices.getAllContacts();

    res.json({
      status: 200,
      message: 'Successsfully found contacts',
      data,
    });
//   } catch (error) {
//       next(error);
    // res.status(500).json({
    //   message: error.message,
    // });
//   }
};

export const getContactsByIdController = async (req, res) => {
//   try {
    const { id } = req.params;
    const data = await contactServices.getContactById(id);

      if (!data) {
        throw createHttpError(404, `Contact with id=${id} not found`);
               //замість нижчевказаних 3 рядків
               //   const error = new Error(`Contact with id=${id} not found`);
               //   error.status = 404;
               //   throw error;
        //замість нижчевказаних 3 рядків
        //   return res.status(404).json({
        //     message: `Contact with id=${id} not found`,
        //   });
      }

    res.json({
      status: 200,
      message: `Contactt wit ${id} successfully find`,
      data,
    });

//   } catch (error) {
//       next(error);

    //   const { status = 500, message } = error;
    // res.status(status).json({
    //   message,
    // });
//   }
};
