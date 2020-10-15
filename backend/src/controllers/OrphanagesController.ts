import { getRepository } from 'typeorm';

import { Request, Response } from 'express';
import * as Yup from 'yup';

import Opharnage from '../models/Opharnage';
import orphanateView from '../views/orphanages_views';

export default {
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Opharnage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images'],
    });

    return response.json(orphanateView.renderMany(orphanages));
  },

  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;

    const orphanagesRepository = getRepository(Opharnage);

    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map((image) => {
      return { path: image.filename };
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        }),
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images,
    });

    await orphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage);
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orphanagesRepository = getRepository(Opharnage);

    const orphanages = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images'],
    });

    return response.json(orphanateView.render(orphanages));
  },
};
