// cloudinary.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LinkImage } from '@src/global/LinkImage';
import * as cloudinary from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from 'src/config/keyEnviroments';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private cloudinaryCloudName: string;
  private cloudinaryApiKey: string;
  private cloudinaryApiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.cloudinaryCloudName = this.configService.get<string>(
      CLOUDINARY_CLOUD_NAME,
    )!;
    this.cloudinaryApiKey = this.configService.get<string>(CLOUDINARY_API_KEY)!;
    this.cloudinaryApiSecret = this.configService.get<string>(
      CLOUDINARY_API_SECRET,
    )!;

    cloudinary.v2.config({
      cloud_name: this.cloudinaryCloudName,
      api_key: this.cloudinaryApiKey,
      api_secret: this.cloudinaryApiSecret,
    });
  }

  sanitizeString(input: string): string {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9._\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');
  }

  async deletePhoto(photoId: string): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(photoId, (error, result) => {
          if (error) {
            reject(`Failed to delete photo from Cloudinary: ${error.message}`);
          } else if (result.result !== 'ok') {
            reject(`Failed to delete photo from Cloudinary: ${result.result}`);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to delete photo from Cloudinary: ${error.message}`,
      );
    }
  }

  async uploadBuffer(
    fileBuffer: any,
    photoId: string | undefined = undefined,
  ): Promise<LinkImage> {
    try {
      //eliminamos la imagen si ya existe
      if (photoId) {
        try {
          await this.deletePhoto(photoId);
        } catch (error) {
          this.logger.error(error);
        }
      }

      const baseOptions: cloudinary.TransformationOptions = {
        transformation: [{ width: 1080, height: 1080, crop: 'limit' }],
        secure: true,
      };

      //subimos foto
      const image = await new Promise<cloudinary.UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.v2.uploader
            .upload_stream(
              {
                resource_type: 'auto',
                folder: 'apianime',
                transformation: baseOptions,
              },
              (error, result) => {
                if (error) {
                  reject(
                    `Failed to upload file to Cloudinary: ${error.message}`,
                  );
                } else if (!result) {
                  reject(`Failed to upload file to Cloudinary`);
                } else {
                  resolve(result);
                }
              },
            )
            .end(fileBuffer.buffer); // Escribe el buffer en el stream para subirlo a Cloudinary
        },
      );

      // Generamos las URLs en formatos JPG, WebP y AVIF
      const publicId = image.public_id;

      const jpgUrl = cloudinary.v2.url(publicId, {
        ...baseOptions,
        format: 'jpg',
        quality: 'auto:good',
      });

      const avifUrl = cloudinary.v2.url(publicId, {
        ...baseOptions,
        format: 'avif',
        quality: 'auto:good',
      });

      const webpUrl = cloudinary.v2.url(publicId, {
        ...baseOptions,
        format: 'webp',
        quality: 'auto:good',
      });

      return {
        id: publicId,
        jpg: jpgUrl,
        avif: avifUrl,
        webp: webpUrl,
      };
    } catch (error) {
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  }

  async uploadFromUrl(
    imageUrl: string,
    photoId: string | undefined = undefined,
  ) {
    try {
      // Eliminamos la imagen si ya existe
      if (photoId) {
        try {
          await this.deletePhoto(photoId);
        } catch (error) {
          this.logger.error(error);
        }
      }

      // Subimos la imagen desde la URL
      return await new Promise<cloudinary.UploadApiResponse>(
        (resolve, reject) => {
          cloudinary.v2.uploader.upload(
            imageUrl,
            {
              resource_type: 'auto',
              folder: 'apianime',
            },
            (error, result) => {
              if (error) {
                reject(`Failed to upload file to Cloudinary: ${error.message}`);
              } else if (!result) {
                reject(`Failed to upload file to Cloudinary`);
              } else {
                resolve(result);
              }
            },
          );
        },
      );
    } catch (error) {
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
    }
  }
}
