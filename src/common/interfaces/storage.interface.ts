import { ResponseDeleteDto } from '../../files/s3-storage/dto/response-delete.dto'

export interface IStorageService {
    uploadObject(file: Express.Multer.File, key: string): Promise<string>
    deleteObject(key: string): Promise<ResponseDeleteDto>
    listObjects(): Promise<string[]>
    getObject(key: string): Promise<Buffer>
    getObjectUrl(key: string): Promise<string>
}