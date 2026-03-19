import { PaginatedRequestDto } from '../../common/dto/paginated-request.dto';
import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class SearchFilesDto extends PaginatedRequestDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    mimeType: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    directoryId: string;
}

export class GetFilesDataById {
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    ids: string[];
}

export class UploadOptionsDto {
    @IsOptional()
    @IsBoolean()
    enableCompression: boolean = true;
}
