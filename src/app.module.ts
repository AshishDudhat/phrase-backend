import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhraseModule } from './phrase/phrase.module';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/phraseDB'), // Adjust the MongoDB connection string as needed
        PhraseModule,
    ],
})
export class AppModule {}