import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhraseService } from './phrase.service';
import { PhraseController } from './phrase.controller';
import { Phrase, PhraseSchema } from '../schemas/phrase.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Phrase.name, schema: PhraseSchema }])],
    controllers: [PhraseController],
    providers: [PhraseService],
})
export class PhraseModule {}