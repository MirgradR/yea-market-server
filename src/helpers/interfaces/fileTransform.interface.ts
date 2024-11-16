import { FileTypeEnum } from '../constants/fileType.enum';

export interface ITransformedFile {
  fileName: string;
  filePath: string;
  mimeType: string;
  size: string;
  originalName: string;
  fileType: FileTypeEnum;
}
