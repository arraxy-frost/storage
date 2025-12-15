import {
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class CreateDirectoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 255)
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    parentId: string;
}
