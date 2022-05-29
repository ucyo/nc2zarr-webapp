import {Chunk} from './chunk.model';

export interface CompleteConversionCreation {
  chunks: Chunk[];
  precision: number;
  autoChunks: boolean;
  packed: boolean;
  uniqueTimes: boolean;
  name: string,
  input: string[],
  output: string
}
