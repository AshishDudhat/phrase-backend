import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhraseDocument = Phrase & Document;

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt fields
export class Phrase {
    @Prop({ required: true })
    phrase: string;

    @Prop({ required: true, enum: ['active', 'pending', 'spam', 'deleted'] }) // Limit status to specific values
    status: string;

    @Prop({ type: Object }) // For storing translations
    translations: {
        fr: string;
        es: string;
    };
}

export const PhraseSchema = SchemaFactory.createForClass(Phrase);