import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Phrase, PhraseDocument } from '../schemas/phrase.schema';

@Injectable()
export class PhraseService {
    constructor(@InjectModel(Phrase.name) private phraseModel: Model<PhraseDocument>) {}

    async create(createPhraseDto: Partial<Phrase>): Promise<Phrase> {
        const createdPhrase = new this.phraseModel(createPhraseDto);
        return createdPhrase.save();
    }

    async findAll(
        search?: string,
        sortBy?: string,
        order?: 'asc' | 'desc'
    ): Promise<Phrase[]> {
        const query: any = {};
    
        if (search) {
            query.phrase = { $regex: search, $options: 'i' }; // Case insensitive search
        }
    
        // Set default value for order if not provided
        const sortOrder = order === 'asc' ? 1 : (order === 'desc' ? -1 : 1);
        return this.phraseModel.find(query).sort({ [sortBy]: sortOrder }).exec();
    }

    async findOne(id: string): Promise<Phrase> {
        return this.phraseModel.findById(id).exec();
    }

    async update(id: string, updatePhraseDto: Partial<Phrase>): Promise<Phrase> {
        return this.phraseModel.findByIdAndUpdate(id, updatePhraseDto, { new: true }).exec();
    }

    async delete(id: string): Promise<Phrase> {
        return this.phraseModel.findByIdAndDelete(id).exec(); // Updated method
    }

    async getTranslation(id: string, language: string): Promise<string> {
        // Use projection to get only the required translation field
        const phrase = await this.phraseModel.findOne(
            { _id: id },
            { [`translations.${language}`]: 1 } // Project only the translation for the specified language
        );
    
        // Check if the phrase was found
        if (!phrase) {
            throw new NotFoundException(`Phrase with ID ${id} not found`);
        }
    
        // Check if the translation exists
        const translation = phrase.translations[language];
        if (translation === undefined) { // Use undefined to check if it exists
            throw new NotFoundException(`Translation not found for language: ${language}`);
        }
    
        return translation;
    }
}