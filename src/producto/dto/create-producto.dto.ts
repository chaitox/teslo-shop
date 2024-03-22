import { IsIn, IsInt, IsNumber, IsOptional,
     IsPositive, IsString, MinLength
     } from "class-validator";

export class CreateProductoDto {
    @IsString()
    @MinLength(1)
    title:string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price:number;

    @IsString()
    @IsOptional()
    description?:string

    @IsString()
    @IsOptional()
    slug?:string

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?:number

    @IsString({each:true})
    size: string[]

    @IsIn(['men','women','unisex','kid'])
    gender: string
}
