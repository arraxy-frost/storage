import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty()
    eventId: string

    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsString()
    text: string

    @IsNotEmpty()
    @IsString()
    sender: string

    @IsNotEmpty()
    @IsString()
    payload: string
}
