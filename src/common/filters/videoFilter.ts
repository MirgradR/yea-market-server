import {
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';

type validVideoExtension = 'mp4' | 'avi' | 'mov' | 'wmv' | 'flv';
type validVideoMimeType =
  | 'video/mp4'
  | 'video/x-msvideo'
  | 'video/quicktime'
  | 'video/x-ms-wmv'
  | 'video/x-flv';

const validVideoMimeTypes: validVideoMimeType[] = [
  'video/mp4',
  'video/x-msvideo',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-flv',
];

const validVideoExtensions: validVideoExtension[] = [
  'mp4',
  'avi',
  'mov',
  'wmv',
  'flv',
];

export function videoFilter(req, file, cb) {
  if (!file) throw new BadRequestException('File not provided!');

  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  if (!validVideoExtensions.includes(fileExtension)) {
    cb(new UnsupportedMediaTypeException('Invalid file extension.'), false);
    return;
  }

  if (!validVideoMimeTypes.includes(file.mimetype)) {
    cb(new UnsupportedMediaTypeException('Invalid mime type.'), false);
    return;
  }

  cb(null, true);
}
