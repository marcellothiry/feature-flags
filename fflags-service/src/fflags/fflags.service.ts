import {
  CreateFFlagBodyRequest,
  CreateFFlagBodyResponse,
  FFlags,
  GetFFlagBodyResponse,
  UpdateFFlagBodyRequest,
  UpdateFFlagBodyResponse
} from './fflags.types.js';
import {FFlagModel, MongoDBLoader} from '@fflags/mongo-loader';

export const createFFlag = async (fflagBody: CreateFFlagBodyRequest): Promise<CreateFFlagBodyResponse | undefined | null> => {
  try {
    const newFFlag = await FFlagModel.create(fflagBody);
    return newFFlag.toJSON();
  } catch (err: any) {
    if (err.code === 11000) return null; // MongoServerError: duplicate key
  }
};

export const updateFFlag = async (fflagBody: UpdateFFlagBodyRequest): Promise<UpdateFFlagBodyResponse | null> => {
  const updatedFFlag = await FFlagModel.findByIdAndUpdate(fflagBody.id, fflagBody, {new: true}).exec();
  return updatedFFlag ? updatedFFlag.toJSON() : null;
};

export const deleteFFlag = async (fflagId: string): Promise<void> => {
  await FFlagModel.findByIdAndDelete(fflagId).exec();
};

export const getFFlagById = async (fflagId: string): Promise<GetFFlagBodyResponse | null> => {
  const fflag = await FFlagModel.findById(fflagId).exec();
  return fflag ? fflag.toJSON() : null;
};

export const getAllFFlagsForCaching = async (environmentName: string): Promise<FFlags | null> => {
  const fflags = await MongoDBLoader.load(environmentName);
  if (fflags.size === 0) return null;
  let fflagsOutput = {};
  for (const fflagEntry of fflags.entries()) {
    fflagsOutput = {
      ...fflagsOutput,
      [fflagEntry[0]]: fflagEntry[1]
    };
  }
  return fflagsOutput;
};