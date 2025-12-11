import { PaginatedRequestDto } from '../../common/dto/paginated-request.dto';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}

export class GetFilesDataById {
    @IsArray()
    ids: string[];
}